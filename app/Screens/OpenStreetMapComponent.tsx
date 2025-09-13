import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar, 
  Alert,
  ViewStyle 
} from 'react-native';
import MapView, { 
  Marker, 
  PROVIDER_GOOGLE, 
  Region, 
  MapPressEvent,
  LatLng 
} from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Types
interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface AddressInfo {
  name?: string;
  street?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
}

interface LocationData {
  coords: LocationCoords;
  address: AddressInfo | null;
}

interface MapScreenProps {
  onUserLocationChange?: (location: LocationData) => void;
  onSelectedLocationChange?: (location: LocationData) => void;
  initialRegion?: Region;
  showsUserLocation?: boolean;
  showsCompass?: boolean;
  mapType?: 'standard' | 'satellite' | 'terrain' | 'hybrid';
}

// Constants
const { width, height } = Dimensions.get('window');

const DEFAULT_REGION: Region = {
  latitude: 6.6885, // Kumasi, Ghana
  longitude: -1.6244,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const LOCATION_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.Balanced,
  timeInterval: 1000,
  distanceInterval: 10,
};

const MAP_ANIMATION_DURATION = 1000;

// Custom hook for location services
const useLocationService = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      
      if (!granted) {
        setError('Location permission denied');
      }
      
      return granted;
    } catch (err) {
      const errorMsg = 'Failed to request location permission';
      setError(errorMsg);
      console.error(errorMsg, err);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    if (hasPermission === false) {
      setError('Location permission not granted');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get current position
      const location = await Location.getCurrentPositionAsync(LOCATION_OPTIONS);
      
      // Get address information
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const locationData: LocationData = {
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        address: reverseGeocode.length > 0 ? reverseGeocode[0] : null,
      };

      return locationData;
    } catch (err) {
      const errorMsg = 'Failed to get current location';
      setError(errorMsg);
      console.error(errorMsg, err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [hasPermission]);

  const reverseGeocode = useCallback(async (coords: LocationCoords): Promise<AddressInfo | null> => {
    try {
      const result = await Location.reverseGeocodeAsync(coords);
      return result.length > 0 ? result[0] : null;
    } catch (err) {
      console.error('Failed to reverse geocode:', err);
      return null;
    }
  }, []);

  return {
    hasPermission,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
    reverseGeocode,
  };
};

// Main Component
const MapScreen: React.FC<MapScreenProps> = ({
  onUserLocationChange,
  onSelectedLocationChange,
  initialRegion = DEFAULT_REGION,
  showsUserLocation = true,
  showsCompass = true,
  mapType: initialMapType = 'standard'
}) => {
  // Hooks
  const {
    hasPermission,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
    reverseGeocode,
  } = useLocationService();

  // Refs
  const mapRef = useRef<MapView>(null);

  // State
  const [region, setRegion] = useState<Region>(initialRegion);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'terrain' | 'hybrid'>(initialMapType);

  // Computed values
  const mapStyles = useMemo(() => ({
    container: styles.container,
    map: styles.map,
    locationButton: styles.locationButton,
    mapTypeButton: styles.mapTypeButton,
  }), []);

  // Effects
  useEffect(() => {
    initializeLocation();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Location Error', error, [{ text: 'OK' }]);
    }
  }, [error]);

  // Location initialization
  const initializeLocation = useCallback(async () => {
    const permissionGranted = await requestPermission();
    
    if (!permissionGranted) {
      return;
    }

    const location = await getCurrentLocation();
    
    if (location) {
      setUserLocation(location);
      
      const newRegion: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      setRegion(newRegion);
      onUserLocationChange?.(location);

      // Animate to user location
      mapRef.current?.animateToRegion(newRegion, MAP_ANIMATION_DURATION);
    }
  }, [requestPermission, getCurrentLocation, onUserLocationChange]);

  // Event handlers
  const handleMapPress = useCallback(async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    try {
      const address = await reverseGeocode({ latitude, longitude });
      
      const locationData: LocationData = {
        coords: { latitude, longitude },
        address,
      };

      setSelectedLocation(locationData);
      onSelectedLocationChange?.(locationData);
    } catch (err) {
      console.error('Failed to handle map press:', err);
      Alert.alert('Error', 'Failed to get location information');
    }
  }, [reverseGeocode, onSelectedLocationChange]);

  const handleGoToMyLocation = useCallback(async () => {
    if (userLocation) {
      const targetRegion: Region = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current?.animateToRegion(targetRegion, MAP_ANIMATION_DURATION);
      setRegion(targetRegion);
    } else {
      // Try to get current location if we don't have it
      const location = await getCurrentLocation();
      if (location) {
        const targetRegion: Region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        mapRef.current?.animateToRegion(targetRegion, MAP_ANIMATION_DURATION);
        setRegion(targetRegion);
        setUserLocation(location);
        onUserLocationChange?.(location);
      } else {
        Alert.alert('Location Error', 'Unable to get your current location');
      }
    }
  }, [userLocation, getCurrentLocation, onUserLocationChange]);

  const handleChangeMapType = useCallback(() => {
    const types: Array<'standard' | 'satellite' | 'terrain' | 'hybrid'> = [
      'standard', 
      'satellite', 
      'terrain', 
      'hybrid'
    ];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
  }, [mapType]);

  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
  }, []);

  // Render methods
  const renderUserMarker = () => {
    if (!userLocation || !showsUserLocation) return null;

    return (
      <Marker
        coordinate={userLocation.coords}
        title="Your Location"
        description={userLocation.address?.name || "You are here"}
        identifier="user-location"
      />
    );
  };

  const renderSelectedMarker = () => {
    if (!selectedLocation) return null;

    const title = selectedLocation.address?.name || 'Selected Location';
    const description = selectedLocation.address?.city && selectedLocation.address?.region
      ? `${selectedLocation.address.city}, ${selectedLocation.address.region}`
      : 'Custom location';

    return (
      <Marker
        coordinate={selectedLocation!.coords}
        title={title}
        description={description}
        pinColor="blue"
        identifier="selected-location"
      />
    );
  };

  const renderControls = () => (
    <>
      <TouchableOpacity 
        style={mapStyles.locationButton}
        onPress={handleGoToMyLocation}
        disabled={isLoading}
        activeOpacity={0.7}
      >
         <Icon name="my-location" size={24} color="#007AFF" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={mapStyles.mapTypeButton}
        onPress={handleChangeMapType}
        activeOpacity={0.7}
      >
        <Icon 
          name="layers" 
          size={24} 
          color="#007AFF" 
        />
      </TouchableOpacity>
    </>
  );

  if (hasPermission === false) {
    return (
      <View style={[mapStyles.container, styles.centerContent]}>
        <Icon name="location-off" size={48} color="#999" />
      </View>
    );
  }

  return (
    <View style={mapStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <MapView
        ref={mapRef}
        style={mapStyles.map}
        provider={PROVIDER_GOOGLE}
        mapType={mapType}
        region={region}
        onPress={handleMapPress}
        onRegionChangeComplete={handleRegionChangeComplete}
        // showsUserLocation={false} // We handle this with custom marker
        showsCompass={showsCompass}
        showsMyLocationButton={false} // We have custom button
        showsPointsOfInterest={true}
        showsBuildings={true}
        showsTraffic={false}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        toolbarEnabled={false}
        showsUserLocation={true}
      >
        {renderUserMarker()}
        {renderSelectedMarker()}
      </MapView>

      {renderControls()}
    </View>
  );
};

// Styles
const styles = StyleSheet.create<{
  container: ViewStyle;
  map: ViewStyle;
  locationButton: ViewStyle;
  mapTypeButton: ViewStyle;
  centerContent: ViewStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    width,
    height,
  },
  locationButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapTypeButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;