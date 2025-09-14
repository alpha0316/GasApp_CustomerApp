import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import BackButton from '@/components/BackButton';
import PrimaryButton from '@/components/PrimaryButton';
import { useRoute } from '@react-navigation/native';
import { useLocationContext } from '../../hooks/LocationContext';
import OpenStreetMapComponent from './OpenStreetMapComponent';

type MyLocation = Coordinates & {
  name?: string; // For a place name
  address?: {
    name?: string;
    street?: string;
    city?: string;
  };
};

type RouteParams = {
  offerName: string;
  offerPrice: string;
  offerId: string;
  cylinderName?: string;
  cylinderPrice?: string;
  cylinderId?: string;
  cylinderSize?: string;
  orderSummary?: string;
};

// Types
interface Coordinates {
  name?: string;
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
  address?: {
    name?: string;
  };
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Type guard to check if location has address property
const hasAddress = (location: any): location is MyLocation => {
  return location && typeof location === 'object' && 'address' in location;
};

// Helper function to safely get location name
const getLocationName = (location: any): string => {
  if (!location) return '';
  
  if (typeof location === 'string') {
    return location;
  }
  
  if (Array.isArray(location) && location.length > 0) {
    return String(location[0] ?? '');
  }
  
  if (hasAddress(location) && location.address?.name) {
    return location.address.name;
  }
  
  if (location.name) {
    return location.name;
  }
  
  // If it's a basic Location object with coordinates
  if (location.latitude && location.longitude) {
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
  }
  
  return '';
};

// Helper function to safely get address name
const getAddressName = (location: any): string => {
  if (!location) return '';
  
  if (hasAddress(location) && location.address?.name) {
    return location.address.name;
  }
  
  if (location.name) {
    return location.name;
  }
  
  return '';
};

// Constants
const DEFAULT_REGION: Region = {
  latitude: 6.67618,
  longitude: -1.56236,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const KUMASI_REGION: Region = {
  latitude: 6.6885,
  longitude: -1.6244,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// Icon Components
const SearchIcon: React.FC = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path
      d="M17.031 17.7901C17.491 18.2501 18.201 17.5401 17.741 17.0901L13.991 13.3301C15.3064 11.8746 16.0335 9.98189 16.031 8.02006C16.031 3.63006 12.461 0.0600586 8.07096 0.0600586C3.68096 0.0600586 0.110962 3.63006 0.110962 8.02006C0.110962 12.4101 3.68096 15.9801 8.07096 15.9801C10.051 15.9801 11.881 15.2501 13.281 14.0401L17.031 17.7901ZM1.10996 8.02006C1.10996 4.18006 4.23996 1.06006 8.06996 1.06006C11.91 1.06006 15.03 4.18006 15.03 8.02006C15.03 11.8601 11.91 14.9801 8.06996 14.9801C4.23996 14.9801 1.10996 11.8601 1.10996 8.02006Z"
      fill="black"
      fillOpacity="0.6"
    />
  </Svg>
);

const CloseIcon: React.FC = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" 
      fill="#1D1B20"
    />
  </Svg>
);

const HomeIcon: React.FC = () => (
  <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
    <Path
      d="M16 15.375V6.875C16 6.71975 15.9639 6.56664 15.8944 6.42779C15.825 6.28893 15.7242 6.16815 15.6 6.075L8.6 0.825C8.4269 0.695178 8.21637 0.625 8 0.625C7.78363 0.625 7.5731 0.695178 7.4 0.825L0.4 6.075C0.275804 6.16815 0.175 6.28893 0.105573 6.42779C0.036145 6.56664 0 6.71975 0 6.875V15.375C0 15.6402 0.105357 15.8946 0.292893 16.0821C0.48043 16.2696 0.734784 16.375 1 16.375H5C5.26522 16.375 5.51957 16.2696 5.70711 16.0821C5.89464 15.8946 6 15.6402 6 15.375V12.375C6 12.1098 6.10536 11.8554 6.29289 11.6679C6.48043 11.4804 6.73478 11.375 7 11.375H9C9.26522 11.375 9.51957 11.4804 9.70711 11.6679C9.89464 11.8554 10 12.1098 10 12.375V15.375C10 15.6402 10.1054 15.8946 10.2929 16.0821C10.4804 16.2696 10.7348 16.375 11 16.375H15C15.2652 16.375 15.5196 16.2696 15.7071 16.0821C15.8946 15.8946 16 15.6402 16 15.375Z"
      fill="#00000060"
    />
  </Svg>
);

const LocationIcon: React.FC<{ filled?: boolean }> = ({ filled = false }) => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path 
      d="M13.7465 5.80004C13.0532 2.71337 10.3598 1.33337 7.99983 1.33337C7.99983 1.33337 7.99983 1.33337 7.99317 1.33337C5.63983 1.33337 2.95317 2.71337 2.25317 5.79337C1.4665 9.23337 3.57317 12.1467 5.47983 13.9867C6.1865 14.6667 7.09317 15.0067 7.99983 15.0067C8.9065 15.0067 9.81317 14.6667 10.5132 13.9867C12.4198 12.1467 14.5265 9.24004 13.7465 5.80004ZM10.1865 6.35337L7.51983 9.02004C7.41983 9.12004 7.29317 9.16671 7.1665 9.16671C7.03983 9.16671 6.91317 9.12004 6.81317 9.02004L5.81317 8.02004C5.61983 7.82671 5.61983 7.50671 5.81317 7.31337C6.0065 7.12004 6.3265 7.12004 6.51983 7.31337L7.1665 7.96004L9.47983 5.64671C9.67317 5.45337 9.99317 5.45337 10.1865 5.64671C10.3798 5.84004 10.3798 6.16004 10.1865 6.35337Z" 
      fill={filled ? "black" : "#00000060"}
    />
  </Svg>
);

const CheckIcon: React.FC = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" 
      fill="black"
    />
  </Svg>
);

const RadioButton: React.FC<{ selected: boolean }> = ({ selected }) => (
  <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
    {selected && <CheckIcon />}
  </View>
);

// Custom hook for location permissions
const useLocationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setHasPermission(false);
      return false;
    }
  }, []);

  return { hasPermission, requestPermission };
};

// Main Component
const SelectLocation: React.FC = () => {
  const navigation = useNavigation();
  const { currentLocation, setCurrentLocation } = useLocationContext();
  const { hasPermission, requestPermission } = useLocationPermission();
  const route = useRoute();
  
  // Get previous screen data with defaults
  const params = route.params as RouteParams;
  const { 
    offerName = '', 
    offerPrice = '', 
    offerId = '',
    ...otherParams 
  } = params || {};

  // State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [marker, setMarker] = useState<Region | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState<boolean>(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  // Prepare location data to send to next screen
  const getLocationDataToPass = useCallback(() => {
    let locationData = {};
    
    if (useCurrentLocation && currentLocation) {
      const locationName = getLocationName(currentLocation);
      locationData = {
        locationName,
        locationType: 'current'
      };
      
      // Add coordinates if available
      if (currentLocation && typeof currentLocation === 'object' && 'latitude' in currentLocation) {
        locationData = {
          ...locationData,
          locationCoordinates: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          }
        };
      }
    } else if (selectedLocation) {
      locationData = {
        locationName: getAddressName(selectedLocation) || selectedLocation.name || 'Selected Location',
        locationCoordinates: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude
        },
        locationType: 'selected'
      };
    }
    
    return locationData;
  }, [useCurrentLocation, currentLocation, selectedLocation]);

  // Computed values
  const displayLocationName = useMemo(() => {
    return getLocationName(currentLocation);
  }, [currentLocation]);

  const isDisabled = !currentLocation || !marker;

  // Effects
  useEffect(() => {
    initializeLocation();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setUseCurrentLocation(false);
    } else {
      setUseCurrentLocation(true);
    }
  }, [selectedLocation]);

  // Location initialization
  const initializeLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    
    try {
      const permissionGranted = await requestPermission();
      
      if (!permissionGranted) {
        Alert.alert(
          'Location Permission Denied',
          'Please enable location permissions to use current location features.',
          [{ text: 'OK' }]
        );
        setRegion(KUMASI_REGION);
        setMarker(KUMASI_REGION);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newRegion: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      setMarker(newRegion);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Using default location.',
        [{ text: 'OK' }]
      );
      setRegion(KUMASI_REGION);
      setMarker(KUMASI_REGION);
    } finally {
      setIsLoadingLocation(false);
    }
  }, [requestPermission]);

  // Event handlers
  const handleSearchFocus = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const handleUseCurrentLocation = useCallback(() => {
    setUseCurrentLocation(true);
    setSelectedLocation(null);
  }, []);

  const handleUseSelectedLocation = useCallback(() => {
    if (selectedLocation) {
      setUseCurrentLocation(false);
    }
  }, [selectedLocation]);

  const handleUserLocationChange = useCallback((location: Coordinates) => {
    setCurrentLocation(location);
  }, [setCurrentLocation]);

  const handleSelectedLocationChange = useCallback((location: Coordinates) => {
    setSelectedLocation(location);
    setUseCurrentLocation(false);
  }, []);

  // Modified continue handler to pass all data
  const handleContinue = useCallback(() => {
    if (isDisabled) {
      Alert.alert('Missing Location', 'Please select a pickup location to continue.');
      return;
    }
    
    const locationData = getLocationDataToPass();
    
    // Combine previous screen data with location data
    const navigationParams = {
      // Pass through previous screen data
      offerName,
      offerPrice,
      offerId,
      ...otherParams,
      
      // Add location data
      ...locationData,
      
      // Add additional location metadata
      selectedLocationDetails: useCurrentLocation ? currentLocation : selectedLocation,
      timestamp: new Date().toISOString(),
    };

    console.log('Navigating to SelectCylinder with params:', navigationParams);
    
    navigation.navigate('SelectCylinder' as never, navigationParams as never);
  }, [
    isDisabled, 
    navigation, 
    getLocationDataToPass, 
    offerName, 
    offerPrice, 
    offerId, 
    otherParams,
    useCurrentLocation,
    currentLocation,
    selectedLocation
  ]);

  // Render methods
  const renderSearchHeader = () => (
    <View style={styles.searchHeader}>
      <TouchableOpacity onPress={handleCloseSearch} style={styles.closeButton}>
        <CloseIcon />
      </TouchableOpacity>
      <Text style={[styles.headerText, styles.searchHeaderText]}>Your Route</Text>
    </View>
  );

  const renderSearchInput = () => (
    <View style={styles.input}>
      <SearchIcon />
      <TextInput
        placeholder="Search for a pickup point"
        value={displayLocationName}
        onFocus={handleSearchFocus}
        returnKeyType="done"
        placeholderTextColor="rgba(0,0,0,0.5)"
        style={styles.inputText}
        showSoftInputOnFocus={true}
      />
    </View>
  );

  const renderLocationOption = (
    isSelected: boolean,
    onPress: () => void,
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    disabled = false
  ) => (
    <TouchableOpacity
      style={[
        styles.locationOption,
        isSelected && styles.locationOptionSelected,
        disabled && styles.locationOptionDisabled,
      ]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.locationText}>
        <Text style={styles.locationTitle}>{title}</Text>
        <Text style={styles.locationSubtitle}>{subtitle}</Text>
      </View>
      <RadioButton selected={isSelected} />
    </TouchableOpacity>
  );

  const footerStyles = [
    styles.footer,
    isSearchOpen && styles.footerExpanded,
  ];

  return (
    <View style={styles.main}>
      <View style={styles.backButton}>
        <BackButton />
      </View>

      <View style={styles.mapContainer}>
        <OpenStreetMapComponent
          onUserLocationChange={handleUserLocationChange}
          onSelectedLocationChange={(locationData: any) => {
            // Handle the LocationData type from OpenStreetMapComponent
            // Convert it to our expected Coordinates format
            if (locationData) {
              // If your OpenStreetMapComponent provides coordinates separately,
              // you might need to extract them differently
              const coordinates: Coordinates = {
                name: locationData.name,
                latitude: locationData.latitude || 0, // Adjust based on actual LocationData structure
                longitude: locationData.longitude || 0, // Adjust based on actual LocationData structure
                address: locationData.address,
              };
              
              setSelectedLocation(coordinates);
              setUseCurrentLocation(false);
            }
          }}
        />
      </View>

      <View style={footerStyles}>
        {isSearchOpen && renderSearchHeader()}
        
        {renderSearchInput()}

        {renderLocationOption(
          useCurrentLocation && !selectedLocation,
          handleUseCurrentLocation,
          <HomeIcon />,
          'Use Current Location',
          getAddressName(currentLocation) || 
          'Save time by selecting your current location',
          isLoadingLocation
        )}

        {!isSearchOpen && renderLocationOption(
          !useCurrentLocation && selectedLocation !== null,
          handleUseSelectedLocation,
          <LocationIcon filled={selectedLocation !== null} />,
          'Selected Location',
          getAddressName(selectedLocation) || 
          'Your selected pickup point will appear here',
          !selectedLocation
        )}

        <ScrollView
          style={[styles.searchResults, !isSearchOpen && styles.hidden]}
          contentContainerStyle={styles.searchResultsContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Add search results here when implementing search functionality */}
        </ScrollView>

        {!isSearchOpen && (
          <PrimaryButton
            title="Continue"
            disabled={isDisabled}
            onPress={handleContinue}
          />
        )}
      </View>
    </View>
  );
};

// Styles remain the same
const styles = StyleSheet.create<{
  main: ViewStyle;
  backButton: ViewStyle;
  headerText: TextStyle;
  searchHeader: ViewStyle;
  searchHeaderText: TextStyle;
  closeButton: ViewStyle;
  mapContainer: ViewStyle;
  footer: ViewStyle;
  footerExpanded: ViewStyle;
  input: ViewStyle;
  inputText: TextStyle;
  locationOption: ViewStyle;
  locationOptionSelected: ViewStyle;
  locationOptionDisabled: ViewStyle;
  iconContainer: ViewStyle;
  locationText: ViewStyle;
  locationTitle: TextStyle;
  locationSubtitle: TextStyle;
  radioButton: ViewStyle;
  radioButtonSelected: ViewStyle;
  searchResults: ViewStyle;
  searchResultsContent: ViewStyle;
  hidden: ViewStyle;
}>({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 2,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  searchHeaderText: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 16,
    zIndex: 1,
  },
  footerExpanded: {
    top: 100,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#FAFAFA',
    gap: 12,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    gap: 12,
    backgroundColor: '#fafafa',
  },
  locationOptionSelected: {
    borderColor: 'black',
    backgroundColor: 'white',
  },
  locationOptionDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  locationSubtitle: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: 'black',
    backgroundColor: 'transparent',
  },
  searchResults: {
    maxHeight: 320,
  },
  searchResultsContent: {
    gap: 12,
  },
  hidden: {
    display: 'none',
  },
});

export default SelectLocation;