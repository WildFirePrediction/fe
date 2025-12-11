import { RegionResponse } from '../types/region';

export interface DisastersResponse {
  region: RegionResponse;
  emergencyMessages: EmergencyMessage[];
  weatherWarnings: WeatherWarning[];
}

export interface EmergencyMessage {
  id: number;
  serialNumber: string;
  messageContent: string;
  regionName: string;
  createdAt: string;
  regDate: string;
  stepName: string;
  disasterTypeName: string;
}

export interface WeatherWarning {
  id: WeatherWarningId;
  forecasterName: string;
  warningPresentationCode: string;
  title: string;
  relevantZone: string;
  effectiveTimeText: string;
  content: string;
  effectiveStatusTimeRaw: string;
  effectiveStatusContent: string;
  reservedWarningStatus: string;
  referenceMatter: string;
  maasObtainedAtRaw: string;
}

export interface WeatherWarningId {
  branch: string;
  presentationTime: string;
  presentationSerial: string;
}

export interface WildFireInfoResponse {
  wildfires: FireInfo[];
}

export interface FireInfo {
  id: number;
  frstfrInfoId: string;
  ignitionDateTime: string;
  address: string;
  x: number;
  y: number;
  sidoCode: string;
  sigunguCode: string;
  damageArea: number;
  damageAmount: number | null;
  maasObtainedAt: string;
}

export interface EarthquakeResponse {
  earthquakes: EarthquakeInfo[];
}

export interface EarthquakeInfo {
  id: number;
  earthquakeNo: string;
  branchNo: string;
  disasterTypeKind: string;
  occurrenceTime: string;
  latitude: number;
  longitude: number;
  position: string;
  scale: number; // 규모(Magnitude)
  depthKm: number;
  notificationLevel: string | null;
  refNo: string;
  refMatter: string;
  modificationMatter: string | null;
  maasObtainedAt: string;
}
