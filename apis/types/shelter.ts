export interface GetShelterNearbyParams {
  lat: number;
  lon: number;
  page: number;
  size: number;
}

export interface GetShelterNearbyResponse {
  shelters: ShelterData[];
  radiusKm: number;
  page: number;
  size: number;
  totalCount: number;
  hasMore: boolean;
}

export interface ShelterData {
  facilityName: string;
  roadAddress: string;
  latitude: number;
  longitude: number;
  shelterTypeName: string;
  distanceM: number;
}
