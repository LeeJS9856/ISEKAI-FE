import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import Live2DViewer from '@/components/Live2DViewer';
import { useWebSocket } from '@/hooks/useWebSocket';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import OverlayButton from '@/components/OverlayButton';
import OverlayContainer from '@/components/OverlayContainer';
import { FONTS } from '@/constants';
import { EmotionType } from '@/types/chat';
import { getTicketForWebSocket } from './api/getTicketForWebSocket';
import { useChatMessages } from './hooks/useChatMessages';

// 웹소켓 감정 타입 → Live2D 감정 이름 매핑
const EMOTION_MAP: Record<EmotionType, string> = {
  SAD: '슬픔',
  SHY: '부끄러움',
  HAPPY: '행복',
  ANGRY: '화남',
  NEUTRAL: '중립',
  SURPRISED: '놀람',
  DESPISE: '경멸'
};

const ChattingPage = () => {
  const wsBaseUrl = import.meta.env.VITE_WS_SERVER_URL;
  const navigate = useNavigate();
  const { characterId } = useParams<{ characterId: string }>();

  // 채팅 메시지 관리 (커스텀 훅으로 분리)
  const { messages, isBotResponding, currentEmotion, handlers } = useChatMessages();

  // UI 상태
  const [isStarted, setIsStarted] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // 1. WS 티켓 발급 (React Query 사용)
  const { data: ticket } = useQuery({
    queryKey: ['ws-ticket'],
    queryFn: getTicketForWebSocket,
    staleTime: 1000 * 60, // 1분간 캐시 유지 (선택사항)
  });

  // 2. URL 구성 (티켓과 characterId가 있을 때만 생성)
  const fullWsUrl = (characterId && ticket && wsBaseUrl) 
    ? `${wsBaseUrl}/characters/${characterId}/voice?ticket=${ticket}`
    : '';

  // WebSocket 연결 및 오디오 스트리밍
  const { getCurrentRms, isServerReady } = useWebSocket({
    serverUrl: isStarted ? fullWsUrl : '',
    autoConnect: isStarted,
    ...handlers
  });

  // 사용자 입력 처리
  const handleSendMessage = useCallback(
    (text: string) => {
      //추후 구현
    },
    []
  );

  // 줌 인/아웃 핸들러
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4.0));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1.0));
  }, []);

  // 마이크 권한 체크
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const status = await navigator.permissions.query({
            name: 'microphone' as PermissionName
          });
          if (status.state === 'granted') setIsStarted(true);
        }
      } catch (e) {
        console.warn(e);
      }
    };
    checkPermission();
  }, []);

  return (
    <PageContainer>
      {/* 1. 배경 이미지 */}
      <Background />

      {/* 2. 뒤로가기 버튼 */}
      <BackButtonWrapper>
        <OverlayButton onClick={() => navigate(-1)} size="md">
          <img src="/Resources/arrow-back.png" alt="뒤로가기" />
        </OverlayButton>
      </BackButtonWrapper>

      {/* 3. 줌 컨트롤 버튼 */}
      <ZoomControlsWrapper>
        <OverlayContainer padding="md">
          <OverlayButton onClick={handleZoomIn} size="sm">+</OverlayButton>
          <ZoomLevel>{Math.round(zoomLevel * 100)}%</ZoomLevel>
          <OverlayButton onClick={handleZoomOut} size="sm" disabled={zoomLevel <= 1.0}>−</OverlayButton>
        </OverlayContainer>
      </ZoomControlsWrapper>

      {/* 4. Live2D 컨테이너 (좌측 50%) */}
      <Live2DContainer>
        <Live2DWrapper>
          <Live2DViewer 
            modelUrl="/Resources/live2d_model.zip" 
            getLipSyncValue={getCurrentRms} 
            zoom={zoomLevel}
            expression={EMOTION_MAP[currentEmotion]}
          />
        </Live2DWrapper>
      </Live2DContainer>

      {/* 5. 채팅 UI (우측 50%) - React 컴포넌트 사용 */}
      <ChatUIWrapper>
        <ChatMessages messages={messages} />
        <ChatInput
          onSend={handleSendMessage}
          placeholder="감정 키워드를 입력하세요 (예: 슬픔, 웃음)"
        />
      </ChatUIWrapper>
    </PageContainer>
  );
};

export default ChattingPage;

// --- Styled Components ---

const PageContainer = styled.section`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: ${FONTS.family.netmarble.medium}, sans-serif;
  background-color: #000;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/Resources/anime-school-background.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(3px) brightness(1);
  transform: scale(1.1);
  z-index: 1;
`;

const BackButtonWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
`;

const Live2DContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Live2DWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const ChatUIWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  padding: 40px 80px;
  box-sizing: border-box;
`;

const ZoomControlsWrapper = styled.div`
  position: absolute;
  top: 80px;
  left: 20px;
  z-index: 10;
`;

const ZoomLevel = styled.span`
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;
