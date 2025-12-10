import { GetShelterNearbyParams, GetShelterNearbyResposne } from './types/shelter';
import { apiGet } from './axios/apiUtil';

export const getSheltersNearby = async ({ lat, lon, page, size }: GetShelterNearbyParams) => {
  return apiGet<GetShelterNearbyResposne>('/shelters/nearby', { lat, lon, page, size });
};
