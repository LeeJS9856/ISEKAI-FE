import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// === 애니메이션 정의 ===

const heartbeat = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.08);
  }
  30% {
    transform: scale(1);
  }
  45% {
    transform: scale(1.05);
  }
  60% {
    transform: scale(1);
  }
`;

const heartPulse = keyframes`
  0%, 100% {
    stroke-width: 3;
    opacity: 1;
  }
  50% {
    stroke-width: 4;
    opacity: 0.9;
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    opacity: 0.4;
    stroke-width: 5;
  }
  50% {
    opacity: 0.7;
    stroke-width: 7;
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

const HeartWrapper = styled.div<{ size: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  animation: ${heartbeat} 1.5s ease-in-out infinite;
`;

const HeartSvg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const HeartOutline = styled.path`
  animation: ${heartPulse} 1.5s ease-in-out infinite;
`;

const HeartOutlineGlow = styled.path`
  animation: ${glowPulse} 1.5s ease-in-out infinite;
  opacity: 0.6;
`;

const EcgLine = styled.path`
  /* 고정된 심전도 - 애니메이션 없음 */
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

interface LoadingHeartProps {
  /** 로딩 텍스트 (선택사항) */
  loadingText?: string;
  /** 컴포넌트 크기 (px) */
  size?: number;
}

// === 메인 컴포넌트 ===

const LoadingHeart: React.FC<LoadingHeartProps> = ({
  loadingText = '로딩 중...',
  size = 200,
}) => {
  const heartPath = 'M50 88 C25 65, 5 50, 5 30 C5 15, 20 5, 35 5 C42 5, 48 10, 50 15 C52 10, 58 5, 65 5 C80 5, 95 15, 95 30 C95 50, 75 65, 50 88 Z';

  // 사용자 참고 이미지 기반 심전도 path
  // 수평 → 살짝아래 → 많이위 → 많이아래 → 중간위 → 살짝아래 → 살짝위 → 살짝아래 → 수평
  const ecgPath = 'M0 50 L30 50 L33 53 L40 20 L50 80 L60 35 L65 55 L70 45 L73 50 L100 50';

  return (
    <Container>
      <HeartWrapper size={size}>
        {/* 하트 + 심전도 통합 SVG */}
        <HeartSvg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* 하트 그라데이션 */}
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b9d" />
              <stop offset="50%" stopColor="#c44569" />
              <stop offset="100%" stopColor="#8e44ad" />
            </linearGradient>

            {/* 심전도 그라데이션 */}
            <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff8fab" />
              <stop offset="50%" stopColor="#c44569" />
              <stop offset="100%" stopColor="#c44569" />
            </linearGradient>

            {/* 글로우 효과용 필터 */}
            <filter id="heartGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* 심전도 글로우 */}
            <filter id="ecgGlow" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 하트 외곽선 (글로우 효과) */}
          <HeartOutlineGlow
            d={heartPath}
            fill="none"
            stroke="url(#heartGradient)"
            strokeWidth="4"
            filter="url(#heartGlow)"
          />

          {/* 하트 외곽선 */}
          <HeartOutline
            d={heartPath}
            fill="none"
            stroke="url(#heartGradient)"
            strokeWidth="3"
          />

          {/* 고정된 심전도 라인 */}
          <EcgLine
            d={ecgPath}
            fill="none"
            stroke="url(#ecgGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ecgGlow)"
          />
        </HeartSvg>
      </HeartWrapper>

      {/* 로딩 텍스트 */}
      {loadingText && <LoadingText>{loadingText}</LoadingText>}
    </Container>
  );
};

export default LoadingHeart;
