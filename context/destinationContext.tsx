import React, { createContext, useContext, useState } from 'react';
import { FullCoordWithName } from '../types/locationCoord';

interface DestinationContextType {
  destination: FullCoordWithName | undefined;
  setDestination: React.Dispatch<React.SetStateAction<FullCoordWithName | undefined>>;
}

interface ProviderProps {
  children: React.ReactNode;
}

const DestinationContext = createContext<DestinationContextType | null>(null);

export const useDestination = () => {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error('destination context 오류');
  }
  return context;
};

export const DestinationProvider: React.FC<ProviderProps> = ({ children }: ProviderProps) => {
  const [destination, setDestination] = useState<FullCoordWithName | undefined>();
  const value = { destination, setDestination };

  return <DestinationContext.Provider value={value}>{children}</DestinationContext.Provider>;
};

export default DestinationContext;
