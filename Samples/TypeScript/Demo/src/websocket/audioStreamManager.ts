// src/managers/audioStreamManager.ts
export class AudioStreamManager {
  public audioContext: AudioContext | null = null;
  public mediaStream: MediaStream | null = null;
  public audioWorkletNode: AudioWorkletNode | null = null;

  constructor() {}

  async startStreaming(onAudioData: (data: Float32Array) => void): Promise<void> {
    if (this.audioContext && this.mediaStream) {
      console.log('[Audio] 이미 오디오 스트리밍 중입니다.');
      return;
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
    });

    this.audioContext = new AudioContext({ sampleRate: 16000 });
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);

    await this.audioContext.audioWorklet.addModule('audio-processor.js');
    this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'audio-processor');

    this.audioWorkletNode.port.onmessage = (event) => {
      const audioData: Float32Array = event.data;
      onAudioData(audioData);
    };

    source.connect(this.audioWorkletNode);
    // this.audioWorkletNode.connect(this.audioContext.destination); // 필요시만 사용
    console.log('[Audio] 실시간 오디오 스트리밍 시작');
  }

  async stopStreaming(): Promise<void> {
    if (this.audioWorkletNode) {
      this.audioWorkletNode.disconnect();
      this.audioWorkletNode.port.close();
      this.audioWorkletNode = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
    console.log('[Audio] 오디오 스트리밍 정지');
  }
}
