export interface GetUserPreferenceResponse {
  id: number;
  region: RegionResponse;
  userDevice: UserDevice;
}

export interface UserDevice {
  id: number;
  deviceUuid: string;
}

export interface GetRegionSearchParams {
  keyword: string;
}

export interface RegionResponse {
  id: number;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
}
