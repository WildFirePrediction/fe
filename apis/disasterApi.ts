import { apiGet } from '../apis/axios/apiUtil';
import { DisastersResponse } from './types/disaster';

export const getRegionDisasters = async (regionId: number) => {
  return apiGet<DisastersResponse>(`/regions/${regionId}/disasters`);
};
