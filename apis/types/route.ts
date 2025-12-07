export interface PostRoutesParams {
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
}

export interface PostRoutesResponse {
  totalDistance: number;
  totalTime: number;
  path: [number, number][];
}
