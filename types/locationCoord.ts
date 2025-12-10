export type LocationCoord = {
  lat: number;
  lon: number;
};

export type FullCoord = {
  latitude: number;
  longitude: number;
};

export type FullCoordWithName = FullCoord & {
  facilityName: string;
};
