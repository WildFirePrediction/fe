import { apiGet, apiPost } from './axios/apiUtil';
import {
  GetRegionSearchParams,
  GetRegionSearchResponse,
  GetUserPreferenceResponse,
} from './types/region';

export const getUserPreferences = async () => {
  return apiGet<GetUserPreferenceResponse[]>('/user-preferences');
};

export const postUserPreferences = async (regionIds: number[]) => {
  return apiPost('/user-preferences', regionIds);
};

export const getRegionsSearch = async ({ keyword }: GetRegionSearchParams) => {
  return apiGet<GetRegionSearchResponse[]>('/regions/search', { keyword });
};
