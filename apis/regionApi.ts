import { apiGet, apiPost } from './axios/apiUtil';
import { GetRegionSearchParams, RegionResponse } from './types/region';

export const getUserPreferences = async () => {
  return apiGet<RegionResponse[]>('/user-preferences');
};

export const postUserPreferences = async (regionIds: number[]) => {
  return apiPost('/user-preferences', regionIds);
};

export const getRegionsSearch = async ({ keyword }: GetRegionSearchParams) => {
  return apiGet<RegionResponse[]>('/regions/search', { keyword });
};
