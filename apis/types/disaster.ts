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
