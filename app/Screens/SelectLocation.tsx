import BackButton from '@/components/BackButton';
import PrimaryButton from '@/components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useEffect, useState, ClipPath } from 'react';
import {
  // StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native';
import Svg, { Path, G, Rect, Defs } from 'react-native-svg';
import OpenStreetMapComponent from './OpenStreetMapComponent';
import { ScrollView } from 'react-native';
import { useLocationContext } from '../../hooks/LocationContext'; 

type Coordinates = {
  name?: string;
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
};


export default function SelectLocation() {
  const navigation = useNavigation();
//   const route = useRoute();

  const [currentLocation, setCurrentLocation] = useState<(string | number)[] | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [clostSearch, setCloseSearch] = useState(false);
  const [orderLocation, setOrderLocation] = useState<Coordinates | null>(null)
  const [region, setRegion] = useState({
    latitude: 6.67618,
    longitude: -1.56236,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01, 
  });
  const [marker, setMarker] = useState<{ latitude: number; longitude: number; latitudeDelta?: number; longitudeDelta?: number } | null>(null);



  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied. Using default location.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      setMarker(newRegion);
      updateAddress(newRegion);
    })();
  }, []);

  useEffect(() => {
    console.log('Region updated:', region);
  }, [region]);

  const isDisabled = !currentLocation || !marker;

  const { selectedLocation, closeLandmarks, userLocation, setSelectedLocation } = useLocationContext();

    useEffect(() => {
      if (currentLocation) {
        setOrderLocation(currentLocation);
        setSelectedLocation(null);
        console.log('eass', orderLocation)
      } else if (selectedLocation) {
        setOrderLocation(selectedLocation);
        // setCurrentLocation('');
        console.log('eass', orderLocation)
      }
    }, [currentLocation, selectedLocation]);

  useEffect(() => {
    // console.log('yes:', userLocation);
     console.log('no:', selectedLocation);
  },[closeLandmarks])


  const handleCloseSearch = () => {
    setOpenSearch(false);
    setCloseSearch(true);
  };

  const updateAddress = async ({ latitude, longitude }: { latitude: number; longitude: number }): Promise<void> => {
    try {
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      // Store address, longitude, and latitude in an array in currentLocation
      setCurrentLocation([
        address ? `${address.street || ''}, ${address.city || ''}` : 'Custom Location',
        longitude,
        latitude
      ]);
      // console.log('active', [
      //   address ? `${address.street || ''}, ${address.city || ''}` : 'Custom Location',
      //   longitude,
      //   latitude
      // ]);
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      setCurrentLocation(['Custom Location', longitude, latitude]);
    }
  };

  // const handleMapPress = async (e) => {
  //   const { latitude, longitude } = e.nativeEvent.coordinate;
  //   setMarker({ latitude, longitude });
  //   setRegion({ ...region, latitude, longitude });
  //   updateAddress({ latitude, longitude });
  // };

  const handleLocationSelect = (
    locationName: string,
    coords: { latitude: number; longitude: number; latitudeDelta?: number; longitudeDelta?: number }
  ) => {
    setCurrentLocation(locationName);
    setMarker(coords);
    setRegion({ ...region, ...coords });
  };

  const handleRefocusLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(newRegion);
    setMarker(newRegion);
    updateAddress(newRegion);
  };

//   const handleContinue = () => {
//     if (!currentLocation || !marker) {
//       alert('Please select a pickup location.');
//       return;
//     }
//     navigation.navigate('SelectCylinder', {
//       offerName,
//       offerPrice,
//       totalCost,
//       price,
//       pickupLocation: { name: currentLocation, coords: marker },
//     });
//   };

  return (
    <View style={styles.main}>

        <View style={styles.backButton}>
          <BackButton /> 
      </View>

      <View style={styles.mapContainer}>

        <OpenStreetMapComponent/>
      </View>

      <View style={[styles.footer, { position : 'fixed' ,top: openSearch === true ? -550 : 0,  
        paddingTop : openSearch === true ? 24 : 24,
        borderTopRightRadius : openSearch === true ? 0 : 24,
        borderTopLeftRadius : openSearch === true ? 0 : 24,
        }]}>

        <View
          style={{
            display: openSearch ? 'flex' : 'none',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: 12,
          }}
        >   
            <TouchableOpacity style={{
              // backgroundColor : "red"
            }} onPress={handleCloseSearch}>
              <View style={{
                display : 'flex',
                alignItems : 'center'
              }}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#1D1B20"/>
              </Svg>
               </View>
            </TouchableOpacity>
          <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Your Route</Text>
        </View>
        

        <View style={styles.input}>
          <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <Path
              d="M17.031 17.7901C17.491 18.2501 18.201 17.5401 17.741 17.0901L13.991 13.3301C15.3064 11.8746 16.0335 9.98189 16.031 8.02006C16.031 3.63006 12.461 0.0600586 8.07096 0.0600586C3.68096 0.0600586 0.110962 3.63006 0.110962 8.02006C0.110962 12.4101 3.68096 15.9801 8.07096 15.9801C10.051 15.9801 11.881 15.2501 13.281 14.0401L17.031 17.7901ZM1.10996 8.02006C1.10996 4.18006 4.23996 1.06006 8.06996 1.06006C11.91 1.06006 15.03 4.18006 15.03 8.02006C15.03 11.8601 11.91 14.9801 8.06996 14.9801C4.23996 14.9801 1.10996 11.8601 1.10996 8.02006Z"
              fill="black"
              fillOpacity="0.6"
            />
          </Svg>
          <TextInput
            placeholder="Search for a pickup point"
            value={currentLocation}
            onFocus={() => [setOpenSearch(true), setCloseSearch(false)]}
            returnKeyType="done"
            placeholderTextColor="rgba(0,0,0,0.5)"
            style={styles.inputText}
            // autoFocus={true}
            showSoftInputOnFocus={true}
          />
        </View>

        <TouchableOpacity
          style={{
            ...styles.locationOption,
            display: 'flex' ,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderWidth: 1,
            borderColor: currentLocation ? 'black'  :  'rgba(0, 0, 0, 0.1)',
            borderRadius: 16,
            gap: 12,
            backgroundColor: '#fafafa',
          }}
          activeOpacity={0.7}
          onPress={() => {
              setOpenSearch(false);
              setCloseSearch(true);
              // setOrderLocation(userLocation)

        // Clear selectedLocation
      }}
        >
          <View style={styles.iconContainer}>
            <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
              <Path
                d="M16 15.375V6.875C16 6.71975 15.9639 6.56664 15.8944 6.42779C15.825 6.28893 15.7242 6.16815 15.6 6.075L8.6 0.825C8.4269 0.695178 8.21637 0.625 8 0.625C7.78363 0.625 7.5731 0.695178 7.4 0.825L0.4 6.075C0.275804 6.16815 0.175 6.28893 0.105573 6.42779C0.036145 6.56664 0 6.71975 0 6.875V15.375C0 15.6402 0.105357 15.8946 0.292893 16.0821C0.48043 16.2696 0.734784 16.375 1 16.375H5C5.26522 16.375 5.51957 16.2696 5.70711 16.0821C5.89464 15.8946 6 15.6402 6 15.375V12.375C6 12.1098 6.10536 11.8554 6.29289 11.6679C6.48043 11.4804 6.73478 11.375 7 11.375H9C9.26522 11.375 9.51957 11.4804 9.70711 11.6679C9.89464 11.8554 10 12.1098 10 12.375V15.375C10 15.6402 10.1054 15.8946 10.2929 16.0821C10.4804 16.2696 10.7348 16.375 11 16.375H15C15.2652 16.375 15.5196 16.2696 15.7071 16.0821C15.8946 15.8946 16 15.6402 16 15.375Z"
                fill="#00000060"
              />
            </Svg>
          </View>
          <View style={[styles.locationText, { flex: 1 }]}>
            <Text style={styles.locationTitle}>Use Current Location</Text>
            <Text style={styles.locationSubtitle}>
              
                {
                currentLocation
                  ? currentLocation[0] 
                  : 'Save time by selecting your current location'
              }
            </Text>
          </View>

          { currentLocation ? 

            <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="black"/>
            </Svg>
            :
            <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    marginLeft: 8,
                    alignSelf: 'center',
                  }}
                />
          }   
        </TouchableOpacity>

        
        <View
          style={{
            display: openSearch ? 'none' : 'flex',
               flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                borderWidth: 1,
                borderColor: selectedLocation ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.1)',
                borderRadius: 16,
                gap: 12,
                backgroundColor : selectedLocation ? '#fafafa' : 'white',
          }}
        >
          <View style={styles.iconContainer}>
          {selectedLocation ? (
            <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path d="M13.7465 5.80004C13.0532 2.71337 10.3598 1.33337 7.99983 1.33337C7.99983 1.33337 7.99983 1.33337 7.99317 1.33337C5.63983 1.33337 2.95317 2.71337 2.25317 5.79337C1.4665 9.23337 3.57317 12.1467 5.47983 13.9867C6.1865 14.6667 7.09317 15.0067 7.99983 15.0067C8.9065 15.0067 9.81317 14.6667 10.5132 13.9867C12.4198 12.1467 14.5265 9.24004 13.7465 5.80004ZM10.1865 6.35337L7.51983 9.02004C7.41983 9.12004 7.29317 9.16671 7.1665 9.16671C7.03983 9.16671 6.91317 9.12004 6.81317 9.02004L5.81317 8.02004C5.61983 7.82671 5.61983 7.50671 5.81317 7.31337C6.0065 7.12004 6.3265 7.12004 6.51983 7.31337L7.1665 7.96004L9.47983 5.64671C9.67317 5.45337 9.99317 5.45337 10.1865 5.64671C10.3798 5.84004 10.3798 6.16004 10.1865 6.35337Z" fill="black"/>
            </Svg>
          ) : (
            <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path d="M13.7465 5.80004C13.0532 2.71337 10.3598 1.33337 7.99983 1.33337C7.99983 1.33337 7.99983 1.33337 7.99317 1.33337C5.63983 1.33337 2.95317 2.71337 2.25317 5.79337C1.4665 9.23337 3.57317 12.1467 5.47983 13.9867C6.1865 14.6667 7.09317 15.0067 7.99983 15.0067C8.9065 15.0067 9.81317 14.6667 10.5132 13.9867C12.4198 12.1467 14.5265 9.24004 13.7465 5.80004ZM10.1865 6.35337L7.51983 9.02004C7.41983 9.12004 7.29317 9.16671 7.1665 9.16671C7.03983 9.16671 6.91317 9.12004 6.81317 9.02004L5.81317 8.02004C5.61983 7.82671 5.61983 7.50671 5.81317 7.31337C6.0065 7.12004 6.3265 7.12004 6.51983 7.31337L7.1665 7.96004L9.47983 5.64671C9.67317 5.45337 9.99317 5.45337 10.1865 5.64671C10.3798 5.84004 10.3798 6.16004 10.1865 6.35337Z" fill="#00000060"/>
            </Svg>
          )}
          </View>
          <View style={[styles.locationText, { flex: 1 }]}>
            <Text style={styles.locationTitle}>Selected Location</Text>
            <Text style={styles.locationSubtitle}>

              {
                selectedLocation
                  ? (selectedLocation.name?.split(',')[0] || 'Custom Location')
                  : 'Your selected pickup point will appear here'
              }
            </Text>
          </View>

          { selectedLocation ? 

          <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="black"/>
          </Svg>
       
            :
            <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    marginLeft: 8,
                    alignSelf: 'center',
                  }}
                />
          }   
        </View>

        <ScrollView
          style={{ maxHeight: 320, display: openSearch ? 'flex' : 'none' }}
          contentContainerStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: 'column', gap: 12 }}>
           {closeLandmarks && closeLandmarks.length > 0 && (
            <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center',}}>
              {closeLandmarks.map((landmark, idx) => {
                const parts = landmark.display_name.split(',').map(s => s.trim());
                // Try to get city and state from the end of the array
                const city = parts.length >= 4 ? parts[parts.length - 4] : '';
                const state = parts.length >= 3 ? parts[parts.length - 3] : '';
                return (
  
                  <View key={landmark.osm_id || idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, }}>

                 
                   <View style={styles.iconContainer}>
                      <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <G clipPath="url(#clip0_6041_2093)">
                                    <Path d="M13.7777 3.55554H10.2222V4.44443H13.7777V13.7778H10.2222V14.6667H14.6666V4.44443C14.6666 4.20868 14.573 3.98259 14.4063 3.81589C14.2396 3.64919 14.0135 3.55554 13.7777 3.55554Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M8.83561 1.33337H2.72005C2.47016 1.33337 2.2305 1.43264 2.0538 1.60934C1.8771 1.78605 1.77783 2.0257 1.77783 2.2756V14.6667H9.77783V2.2756C9.77783 2.0257 9.67856 1.78605 9.50186 1.60934C9.32516 1.43264 9.0855 1.33337 8.83561 1.33337ZM8.88894 13.7778H7.55561V12.4445H4.00005V13.7778H2.66672V2.2756C2.66672 2.26859 2.6681 2.26166 2.67078 2.25519C2.67346 2.24872 2.67739 2.24284 2.68234 2.23788C2.68729 2.23293 2.69317 2.229 2.69964 2.22632C2.70612 2.22364 2.71305 2.22226 2.72005 2.22226H8.83561C8.84261 2.22226 8.84955 2.22364 8.85602 2.22632C8.86249 2.229 8.86837 2.23293 8.87332 2.23788C8.87827 2.24284 8.8822 2.24872 8.88488 2.25519C8.88756 2.26166 8.88894 2.26859 8.88894 2.2756V13.7778Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M3.55554 3.55554H4.44443V4.44443H3.55554V3.55554Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M5.33337 3.55554H6.22226V4.44443H5.33337V3.55554Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M7.11108 3.55554H7.99997V4.44443H7.11108V3.55554Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M3.55554 5.77783H4.44443V6.66672H3.55554V5.77783Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M5.33337 5.77783H6.22226V6.66672H5.33337V5.77783Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M7.11108 5.77783H7.99997V6.66672H7.11108V5.77783Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M3.55554 8H4.44443V8.88889H3.55554V8Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M5.33337 8H6.22226V8.88889H5.33337V8Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M7.11108 8H7.99997V8.88889H7.11108V8Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M3.55554 10.2222H4.44443V11.1111H3.55554V10.2222Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M5.33337 10.2222H6.22226V11.1111H5.33337V10.2222Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M7.11108 10.2222H7.99997V11.1111H7.11108V10.2222Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M10.2222 5.77783H11.1111V6.66672H10.2222V5.77783Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M12 5.77783H12.8889V6.66672H12V5.77783Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M10.2222 8H11.1111V8.88889H10.2222V8Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M12 8H12.8889V8.88889H12V8Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M10.2222 10.2222H11.1111V11.1111H10.2222V10.2222Z" fill="black" fill-opacity="0.6"/>
                                    <Path d="M12 10.2222H12.8889V11.1111H12V10.2222Z" fill="black" fill-opacity="0.6"/>
                                  </G>
                                  <Defs>
                                  
                                  </Defs>
                      </Svg>
                  </View>

                  <View>
                    <Text style={styles.locationTitle}>
                     {landmark.name}
                    </Text>
                    <Text style={styles.locationSubtitle}>
                      {city}, {state}
                    </Text>
                  
                  </View>
                  </View>
      );
    })}
  </View>
)}
          </View>
        </ScrollView>
       
       <View style={{
          display: openSearch === true ? 'none' : 'flex',
        }} >
           <PrimaryButton title="Continue" disabled={isDisabled} onPress={() => navigation.navigate('SelectCylinder' as never)}
          />
       </View>


      </View>
    </View>
  );
}

import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';

const styles = StyleSheet.create<{
  main: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  headerText: TextStyle;
  mapContainer: ViewStyle;
  map: ViewStyle;
  refocusButton: ViewStyle;
  footer: ViewStyle;
  input: ViewStyle;
  inputText: TextStyle;
  locationOption: ViewStyle;
  iconContainer: ViewStyle;
  locationText: ViewStyle;
  locationTitle: TextStyle;
  locationSubtitle: TextStyle;
}>({
  main: {
    flex: 1,
    backgroundColor: 'white',
    // paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  refocusButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  footer: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    gap: 12,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    top: 0, // Cover from top to bottom
    // Remove height property to allow full coverage
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
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    gap: 12,
    
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 40,
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
  },
  locationSubtitle: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
});