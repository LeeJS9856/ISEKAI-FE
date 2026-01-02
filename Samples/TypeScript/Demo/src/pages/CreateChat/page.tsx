import styled from '@emotion/styled';
import { useState } from 'react';
import { VoiceType } from './types';
import {
  NameInput,
  AppearanceInput,
  PersonalityInput,
  VoiceSelector,
  BackgroundInput
} from './components';

const CreateChatPage = () => {
  // Form states
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState('');
  const [personality, setPersonality] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceType>('cute');
  const [background, setBackground] = useState('');

  // Playing voice state
  const [playingVoice, setPlayingVoice] = useState<VoiceType | null>(null);

  const handleVoicePlay = (voiceType: VoiceType) => {
    if (playingVoice === voiceType) {
      setPlayingVoice(null);
    } else {
      setPlayingVoice(voiceType);
      setSelectedVoice(voiceType);
    }
  };

  const handleSave = async () => {
    const characterData = {
      name,
      appearance,
      personality,
      voice: selectedVoice,
      background
    };
    console.log('Saving character:', characterData);
  };

  const isFormValid = name.trim() && appearance.trim() && personality.trim();

  return (
    <Container>
      <MainContent>
        <Section>
          <SectionTitle>캐릭터 설정</SectionTitle>
          <Card>
            <NameInput value={name} onChange={setName} />

            <AppearanceInput value={appearance} onChange={setAppearance} />

            <PersonalityInput value={personality} onChange={setPersonality} />

            <VoiceSelector
              selectedVoice={selectedVoice}
              playingVoice={playingVoice}
              onVoiceSelect={handleVoicePlay}
            />
          </Card>
        </Section>

        <Section>
          <SectionTitle>배경 설정</SectionTitle>
          <Card>
            <BackgroundInput value={background} onChange={setBackground} />
          </Card>
        </Section>

        <SaveSection>
          <SaveBtn onClick={handleSave} disabled={!isFormValid}>
            저장하기
          </SaveBtn>
        </SaveSection>
      </MainContent>
    </Container>
  );
};

export default CreateChatPage;

// Styled Components
const Container = styled.div`
  background-color: #1a1a1a;
  color: #fff;
  padding: 20px;
`;

const MainContent = styled.main`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #fff;
`;

const Card = styled.div`
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #333;
`;

const SaveSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  padding-bottom: 30px;
`;

const SaveBtn = styled.button`
  padding: 12px 24px;
  background-color: #ff4d4d;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff3333;
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;
