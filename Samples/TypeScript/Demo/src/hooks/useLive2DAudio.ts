import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketManager } from '../live2d-library/websocket/websocketmanager';

/**
 * Live2D Audio Hook
 * Manages WebSocket connection for audio streaming and provides current RMS value.
 */
export const useLive2DAudio = (serverUrl: string) => {
  const wsManagerRef = useRef<WebSocketManager | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize WebSocket and Audio Manager
  useEffect(() => {
    if (!serverUrl) return;

    const initAudio = async () => {
      try {
        const manager = new WebSocketManager(serverUrl);
        wsManagerRef.current = manager;
        
        await manager.initialize();
        setIsConnected(true);
      } catch (err) {
        console.error('[useLive2DAudio] Initialization failed:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    initAudio();

    // Cleanup on unmount
    return () => {
      if (wsManagerRef.current) {
        wsManagerRef.current.dispose();
        wsManagerRef.current = null;
      }
      setIsConnected(false);
    };
  }, [serverUrl]);

  // Get current audio RMS (Volume)
  const getCurrentRms = useCallback(() => {
    return wsManagerRef.current?.getCurrentRms() || 0;
  }, []);

  return { isConnected, error, getCurrentRms };
};
