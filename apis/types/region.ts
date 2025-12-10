export interface GetUserPreferenceResponse {
  id: number;
  region: Region;
  userDevice: UserDevice;
}

export interface Region {
  id: number;
  adminCode: string;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
}

export interface UserDevice {
  id: number;
  deviceUuid: string;
}

export interface GetRegionSearchParams {
  keyword: string;
}

export interface GetRegionSearchResponse {
  id: number;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
}
