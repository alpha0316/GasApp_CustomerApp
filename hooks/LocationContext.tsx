// LocationContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  selectedLocation: Coordinates | null;
  setSelectedLocation: (location: Coordinates | null) => void;
  userLocation: Coordinates | null;
  setUserLocation: (location: Coordinates | null) => void;
  closeLandmarks: any[];
  setCloseLandmarks: (landmarks: any[]) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [closeLandmarks, setCloseLandmarks] = useState<any[]>([]);

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        userLocation,
        setUserLocation,
        closeLandmarks,
        setCloseLandmarks,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
