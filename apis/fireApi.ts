import { FirePredictionResponse } from './types/fire';
import { apiGet } from './axios/apiUtil';

export const getFiresActivate = async () => {
  return apiGet<FirePredictionResponse[]>('/fires/active');
};
