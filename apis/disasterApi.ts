import { apiGet } from '../apis/axios/apiUtil';
import { DisastersResponse, EarthquakeResponse, WildFireInfoResponse } from './types/disaster';

export const getRegionDisasters = async (regionId: number) => {
  return apiGet<DisastersResponse>(`/regions/${regionId}/disasters`);
};
export const getDisasterInfoWildfire = async () => {
  return apiGet<WildFireInfoResponse>(`/disaster-info/wildfire`);
};

export const getDisasterInfoEarthquake = async () => {
  return apiGet<EarthquakeResponse>(`/disaster-info/earthquake`);
};
