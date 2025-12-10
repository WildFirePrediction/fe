import { LocationCoord } from '../../types/locationCoord';

export interface FirePredictionResponse {
  fire_id: string;
  fire_location: LocationCoord;
  predictions: FirePrediction[];
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

export interface FireEndResponse {
  fire_id: string;
  fire_location: LocationCoord;
  ended_timestamp: string;
  completion_timestamp: string;
}
