import { axiosClient } from '@/api/client';
import { CharactersResponse } from '@/pages/Home/types/character';

export interface GetCharactersParams {
  page?: number;
  size?: number;
}

/**
 * 캐릭터 목록을 가져옴
 */
export const getCharacters = async (
  params?: GetCharactersParams
): Promise<CharactersResponse> => {
  const response = await axiosClient.get<CharactersResponse>('/characters?page=1&size=12', {
    params
  });
  return response.data;
};