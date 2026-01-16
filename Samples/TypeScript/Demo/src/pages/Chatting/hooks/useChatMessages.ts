import { useState, useCallback } from 'react';
import { ChatMessage, EmotionType } from '@/types/chat';

/** 스트리밍 메시지 ID 상수 */
const STREAMING_USER_ID = 'streaming-user';
const STREAMING_BOT_ID = 'streaming-bot';

/**
 * 채팅 메시지 상태 관리 훅
 * - 완료된 메시지와 스트리밍 메시지를 하나의 배열로 관리
 * - WebSocket 이벤트 핸들러들을 제공
 */
export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('NEUTRAL');

  // 스트리밍 메시지 제거 헬퍼
  const removeStreamingMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  // 완료된 메시지 추가 헬퍼
  const addCompleteMessage = useCallback((type: 'user' | 'ai', text: string) => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      text,
      timestamp: Date.now(),
      status: 'complete'
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  // 모든 스트리밍 메시지 제거
  const clearStreamingMessages = useCallback(() => {
    removeStreamingMessage(STREAMING_USER_ID);
    removeStreamingMessage(STREAMING_BOT_ID);
  }, [removeStreamingMessage]);

  // === WebSocket 이벤트 핸들러 ===

  const handleServerReady = useCallback(() => {
    console.log('[useChatMessages] 서버 준비 완료');
  }, []);

  // 스트리밍 청크 추가 공통 헬퍼
  const appendStreamingChunk = useCallback((
    streamingId: string, 
    type: 'user' | 'ai', 
    chunk: string
  ) => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      const isStreaming = last?.id === streamingId;
      const newText = (isStreaming ? last.text : '') + chunk;
      
      const streamingMessage: ChatMessage = {
        id: streamingId,
        type,
        text: newText,
        timestamp: Date.now(),
        status: 'streaming'
      };

      return isStreaming
        ? [...prev.slice(0, -1), streamingMessage]
        : [...prev, streamingMessage];
    });
  }, []);

  const handleUserSubtitleChunk = useCallback((text: string) => {
    appendStreamingChunk(STREAMING_USER_ID, 'user', text);
  }, [appendStreamingChunk]);

  const handleUserSentence = useCallback((text: string) => {
    removeStreamingMessage(STREAMING_USER_ID);
    addCompleteMessage('user', text);
    setIsBotResponding(true);
  }, [removeStreamingMessage, addCompleteMessage]);

  const handleBotSubtitle = useCallback((text: string) => {
    appendStreamingChunk(STREAMING_BOT_ID, 'ai', text);
  }, [appendStreamingChunk]);

  const handleTurnComplete = useCallback((user: string, bot: string) => {
    removeStreamingMessage(STREAMING_BOT_ID);
    addCompleteMessage('ai', bot);
    setIsBotResponding(false);
  }, [removeStreamingMessage, addCompleteMessage]);

  const handleEmotion = useCallback((emotion: EmotionType) => {
    setCurrentEmotion(emotion);
    console.log('[useChatMessages] 감정 변화:', emotion);
  }, []);

  const handleInterrupted = useCallback(() => {
    clearStreamingMessages();
    setIsBotResponding(false);
    console.log('[useChatMessages] 사용자 끼어들기 감지');
  }, [clearStreamingMessages]);

  const handleError = useCallback((errorCode: string, message: string) => {
    console.error('[useChatMessages] 웹소켓 에러:', errorCode, message);
    clearStreamingMessages();
    setIsBotResponding(false);
  }, [clearStreamingMessages]);

  return {
    // 상태
    messages,
    isBotResponding,
    currentEmotion,
    
    // WebSocket 이벤트 핸들러
    handlers: {
      onServerReady: handleServerReady,
      onUserSubtitleChunk: handleUserSubtitleChunk,
      onUserSentence: handleUserSentence,
      onBotSubtitle: handleBotSubtitle,
      onTurnComplete: handleTurnComplete,
      onEmotion: handleEmotion,
      onInterrupted: handleInterrupted,
      onError: handleError
    }
  };
};
