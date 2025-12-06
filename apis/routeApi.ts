import { apiPost } from './axios/apiUtil';
import { PostRoutesParams, PostRoutesResponse } from './types/route';

export const postRoutes = async ({ startLat, startLon, endLat, endLon }: PostRoutesParams) => {
  return apiPost<PostRoutesResponse>('/routes', { startLat, startLon, endLat, endLon });
};
