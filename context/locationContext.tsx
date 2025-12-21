import React, { createContext, useContext, useState } from 'react';
import { FullCoord } from '../types/locationCoord';

interface LocationContextType {
  currentLocation: FullCoord;
  setCurrentLocation: React.Dispatch<React.SetStateAction<FullCoord>>;
}
interface ProviderProps {
  children: React.ReactNode;
}

const LocationContext = createContext<LocationContextType | null>(null);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('destination context 오류');
  }
  return context;
};

export const LocationProvider: React.FC<ProviderProps> = ({ children }: ProviderProps) => {
  const [currentLocation, setCurrentLocation] = useState<FullCoord>({
    latitude: 35.830919,
    longitude: 128.583357,
  });
  const value = { currentLocation, setCurrentLocation };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export default LocationContext;
