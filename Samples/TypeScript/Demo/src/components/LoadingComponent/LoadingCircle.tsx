import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// === 애니메이션 정의 ===

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.06);
  }
  30% {
    transform: scale(1);
  }
  45% {
    transform: scale(1.04);
  }
  60% {
    transform: scale(1);
  }
`;

const circlePulse = keyframes`
  0%, 100% {
    stroke-width: 3;
    opacity: 1;
  }
  50% {
    stroke-width: 4;
    opacity: 0.9;
  }
`;

const circleGlowPulse = keyframes`
  0%, 100% {
    opacity: 0.4;
    stroke-width: 6;
  }
  50% {
    opacity: 0.7;
    stroke-width: 8;
  }
`;

const imageFloat = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
`;

const textPulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

// === Styled Components ===

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 40px;
`;

const CircleWrapper = styled.div<{ size: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const CircleSvg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const CircleOutline = styled.circle`
  animation: ${circlePulse} 1.5s ease-in-out infinite;
`;

const CircleOutlineGlow = styled.circle`
  animation: ${circleGlowPulse} 1.5s ease-in-out infinite;
  opacity: 0.6;
`;

const CircleImageContainer = styled.div`
  position: absolute;
  width: 75%;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  overflow: hidden;
  border-radius: 50%;
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: brightness(1.05) saturate(1.1);
  animation: ${imageFloat} 3s ease-in-out infinite;
`;

const LoadingText = styled.div`
  margin-top: 24px;
  font-size: 1.1rem;
  font-weight: 500;
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #8e44ad 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${textPulse} 2s ease-in-out infinite;
  letter-spacing: 0.5px;
`;

// === 컴포넌트 Props ===

interface LoadingCircleProps {
  /** 원 안에 들어갈 캐릭터 이미지 경로 */
  characterImage?: string;
  /** 로딩 텍스트 (선택사항) */
  loadingText?: string;
  /** 컴포넌트 크기 (px) */
  size?: number;
}

// === 메인 컴포넌트 ===

const LoadingCircle: React.FC<LoadingCircleProps> = ({
  characterImage = '/Resources/live2d-photo.png',
  loadingText = '로딩 중...',
  size = 200,
}) => {
  return (
    <Container>
      <CircleWrapper size={size}>
        {/* 원형 외곽선 SVG */}
        <CircleSvg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* 그라데이션 */}
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b9d" />
              <stop offset="50%" stopColor="#c44569" />
              <stop offset="100%" stopColor="#8e44ad" />
            </linearGradient>

            {/* 글로우 효과용 필터 */}
            <filter id="circleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 원형 외곽선 (글로우 효과) */}
          <CircleOutlineGlow
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#circleGradient)"
            strokeWidth="5"
            filter="url(#circleGlow)"
          />

          {/* 원형 외곽선 */}
          <CircleOutline
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#circleGradient)"
            strokeWidth="3"
          />
        </CircleSvg>

        {/* 캐릭터 이미지 */}
        <CircleImageContainer>
          <CharacterImage src={characterImage} alt="Character" />
        </CircleImageContainer>
      </CircleWrapper>

      {/* 로딩 텍스트 */}
      {loadingText && <LoadingText>{loadingText}</LoadingText>}
    </Container>
  );
};

export default LoadingCircle;
