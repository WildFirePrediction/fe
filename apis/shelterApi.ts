import { GetShelterNearbyParams, GetShelterNearbyResponse } from './types/shelter';
import { apiGet } from './axios/apiUtil';

export const getSheltersNearby = async ({ lat, lon, page, size }: GetShelterNearbyParams) => {
  return apiGet<GetShelterNearbyResponse>('/shelters/nearby', { lat, lon, page, size });
};
