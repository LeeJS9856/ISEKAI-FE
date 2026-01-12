export interface Character {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  badge?: string;
}

export interface CharacterCardProps {
  character: Character;
  onClick?: (character: Character) => void;
}

// API 응답 타입
export interface ApiCharacter {
  id: number;
  author: {
    email: string;
  };
  live2dModelUrl: string;
  backgroundUrl: string;
  thumbnailUrl: string;
  name: string;
  persona: string;
  voiceId: number;
  isPublic: boolean;
  isAuthorMe: boolean;
}

export interface CharactersResponse {
  content: ApiCharacter[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

// API 응답을 Character 타입으로 변환하는 유틸 함수
export const apiCharacterToCharacter = (apiChar: ApiCharacter): Character => ({
  id: String(apiChar.id),
  title: apiChar.name,
  description: apiChar.persona,
  imageUrl: apiChar.thumbnailUrl,
  badge: apiChar.isAuthorMe ? '내 캐릭터' : undefined
});