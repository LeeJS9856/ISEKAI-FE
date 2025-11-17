// src/managers/websocketManager.ts
import { AudioStreamManager } from './audioStreamManager';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private audioStreamManager = new AudioStreamManager();
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;
  private isInitializing: boolean = false; // 중복 초기화 방지

  private bytesSent: number = 0;
  private messageCount: number = 0;
  private lastLogTime: number = Date.now();
  private totalMessageCount: number = 0; // 전체 누적 카운트

  constructor(private serverUrl: string) {}

  public async initialize(): Promise<void> {
    if (this.isInitializing) {
      console.log('[WebSocket] 이미 초기화 중입니다. 중복 호출 방지.');
      return;
    }

    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] 이미 연결되어 있습니다.');
      return;
    }

    this.isInitializing = true;

    try {
      await this.connectWebSocket();
      await this.startAudioStreaming();
      this.startStatsLogging();
    } finally {
      this.isInitializing = false;
    }
  }

  private startStatsLogging(): void {
    if ((this as any)._statsInterval) {
      return;
    }

    (this as any)._statsInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - this.lastLogTime) / 1000 || 1;
      const kbPerSec = (this.bytesSent / 1024 / elapsed).toFixed(2);

      console.log(
        `[Stats] 최근 5초: ${this.messageCount}개 메시지, ${kbPerSec} KB/s | 총 누적: ${this.totalMessageCount}개, ${(this.bytesSent / 1024).toFixed(2)} KB`
      );

      this.bytesSent = 0;
      this.messageCount = 0;
      this.lastLogTime = now;
    }, 5000);
  }

  private connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.ws) {
          console.log('[WebSocket] 기존 연결 정리 중...');
          this.ws.onclose = null;
          this.ws.close();
          this.ws = null;
        }

        console.log(`[WebSocket] 새 연결 생성: ${this.serverUrl}`);
        this.ws = new WebSocket(this.serverUrl);

        this.ws.onopen = () => {
          console.log('[WebSocket] 연결 성공');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocket] 에러:', error);
          this.isConnected = false;
        };

        this.ws.onclose = (event) => {
          console.log(`[WebSocket] 연결 종료 (코드: ${event.code}, 사유: ${event.reason || '없음'})`);
          this.isConnected = false;

          if (event.code !== 1000) {
            this.attemptReconnect();
          }
        };

        this.ws.onmessage = (event) => {
          console.log('[WebSocket] 서버 응답:', event.data);
          this.handleServerMessage(event.data);
        };
      } catch (error) {
        console.error('[WebSocket] 연결 실패:', error);
        reject(error);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] 최대 재연결 시도 횟수 초과');
      return;
    }

    if (this.isInitializing) {
      console.log('[WebSocket] 이미 재연결 중입니다.');
      return;
    }

    this.reconnectAttempts++;
    console.log(`[WebSocket] ${this.reconnectDelay / 1000}초 후 재연결 시도... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.initialize().catch((error) => {
        console.error('[WebSocket] 재연결 실패:', error);
      });
    }, this.reconnectDelay);
  }

  private async startAudioStreaming(): Promise<void> {
    await this.audioStreamManager.startStreaming((audioData: Float32Array) => {
      this.sendAudioData(audioData);
    });
  }

  private sendAudioData(audioData: Float32Array): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (this.totalMessageCount < 5) {
        console.warn('[WebSocket] 연결되지 않음, 데이터 전송 불가');
      }
      return;
    }

    if (audioData.length === 0) {
      console.warn('[WebSocket] 빈 오디오 데이터, 전송 스킵');
      return;
    }

    try {
      const int16Data = this.float32ToInt16(audioData);
      const byteLength = int16Data.buffer.byteLength;

      this.ws.send(int16Data.buffer);

      this.bytesSent += byteLength;
      this.messageCount++;
      this.totalMessageCount++;

      if (this.totalMessageCount === 1) {
        console.log(`[WebSocket] 첫 오디오 데이터 전송 성공! (${byteLength} bytes)`);
        console.log(`[WebSocket] 연결 상태: readyState=${this.ws.readyState}, bufferedAmount=${this.ws.bufferedAmount}`);
      }
    } catch (error) {
      console.error('[WebSocket] 오디오 전송 실패:', error);
    }
  }

  private float32ToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16Array;
  }

  private handleServerMessage(data: any): void {
    try {
      const message = JSON.parse(data);
      console.log('[WebSocket] 파싱된 메시지:', message);
    } catch (error) {
      console.log('[WebSocket] 원본 메시지:', data);
    }
  }

  public getIsConnected(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  public async dispose(): Promise<void> {
    console.log('[WebSocket] 리소스 정리 중...');

    if ((this as any)._statsInterval) {
      clearInterval((this as any)._statsInterval);
      (this as any)._statsInterval = null;
    }

    await this.audioStreamManager.stopStreaming();

    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close(1000, 'Client initiated close');
      this.ws = null;
    }

    this.isConnected = false;
    this.isInitializing = false;
    this.totalMessageCount = 0;
    console.log('[WebSocket] 리소스 정리 완료');
  }
}
