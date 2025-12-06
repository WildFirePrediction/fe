import { LocationCoord } from '../../types/locationCoord';

export interface FirePredictionResponse {
  fire_id: string;
  fireLocation: LocationCoord;
  prediction: FirePrediction;
}

export interface FirePrediction {
  timestep: number;
  timestamp: string;
  predicted_cells: FirePredictionCell[];
}

export interface FirePredictionCell {
  lat: number;
  lon: number;
  probability: number;
}
