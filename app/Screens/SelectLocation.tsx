import BackButton from '@/components/BackButton';
import PrimaryButton from '@/components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  // StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import OpenStreetMapComponent from './OpenStreetMapComponent';
import { ScrollView } from 'react-native';

export default function SelectLocation() {
  const navigation = useNavigation();
//   const route = useRoute();

  const [currentLocation, setCurrentLocation] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [clostSearch, setCloseSearch] = useState(false);
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

  const handleCloseSearch = () => {
    setOpenSearch(false);
    setCloseSearch(true);
  };

  const updateAddress = async ({ latitude, longitude }: { latitude: number; longitude: number }): Promise<void> => {
    try {
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      setCurrentLocation(address ? `${address.street || ''}, ${address.city || ''}` : 'Custom Location');
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      setCurrentLocation('Custom Location');
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
        {/* <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          followsUserLocation={true}
          onPress={handleMapPress}
        >
          {marker && (
            <Marker coordinate={marker} title={currentLocation || 'Selected Location'} />
          )}
        </MapView>
        <TouchableOpacity style={styles.refocusButton} onPress={handleRefocusLocation}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v4h4v2h-4v4h-2v-4H7v-2h4V7z"
              fill="#fff"
            />
          </Svg>
        </TouchableOpacity> */}
        <OpenStreetMapComponent/>
      </View>

      <View style={[styles.footer, { top: openSearch === true ? -300 : 0,  
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
          <View style={{ position: 'absolute', left: 0 }}>
            
            <TouchableOpacity style={{
              backgroundColor : "red"
            }} onPress={handleCloseSearch}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#1D1B20"/>
              </Svg>
            </TouchableOpacity>
          </View>
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

        <View
          style={[
            styles.locationOption,
            // { display: openSearch ? 'none' : 'flex' }
          ]}
          onTouchEnd={() =>
            handleLocationSelect('Current Location', {
              latitude: region.latitude,
              longitude: region.longitude,
            })
          }
        >
          <View style={styles.iconContainer}>
            <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
              <Path
                d="M16 15.375V6.875C16 6.71975 15.9639 6.56664 15.8944 6.42779C15.825 6.28893 15.7242 6.16815 15.6 6.075L8.6 0.825C8.4269 0.695178 8.21637 0.625 8 0.625C7.78363 0.625 7.5731 0.695178 7.4 0.825L0.4 6.075C0.275804 6.16815 0.175 6.28893 0.105573 6.42779C0.036145 6.56664 0 6.71975 0 6.875V15.375C0 15.6402 0.105357 15.8946 0.292893 16.0821C0.48043 16.2696 0.734784 16.375 1 16.375H5C5.26522 16.375 5.51957 16.2696 5.70711 16.0821C5.89464 15.8946 6 15.6402 6 15.375V12.375C6 12.1098 6.10536 11.8554 6.29289 11.6679C6.48043 11.4804 6.73478 11.375 7 11.375H9C9.26522 11.375 9.51957 11.4804 9.70711 11.6679C9.89464 11.8554 10 12.1098 10 12.375V15.375C10 15.6402 10.1054 15.8946 10.2929 16.0821C10.4804 16.2696 10.7348 16.375 11 16.375H15C15.2652 16.375 15.5196 16.2696 15.7071 16.0821C15.8946 15.8946 16 15.6402 16 15.375Z"
                fill="#00000060"
              />
            </Svg>
          </View>
          <View style={styles.locationText}>
            <Text style={styles.locationTitle}>Use Current Location</Text>
            <Text style={styles.locationSubtitle}>
              Save time by selecting your current location
            </Text>
          </View>
        </View>

        <ScrollView
          style={{ maxHeight: 320 }}
          contentContainerStyle={{ gap: 8 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: 'column', gap: 8 }}>
            <View style={{ marginBottom: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 12,
                  backgroundColor: '#fafafa',
                  gap: 12,
                }}
                onTouchEnd={() =>
                  handleLocationSelect('Landmark 1', {
                    latitude: region.latitude + 0.0005,
                    longitude: region.longitude + 0.0005,
                  })
                }
              >
                <View style={styles.iconContainer}>
                  <Svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    {/* ...SVG Paths... */}
                    <Path d="M31 8H23V10H31V31H23V33H33V10C33 9.46957 32.7893 8.96086 32.4142 8.58579C32.0391 8.21071 31.5304 8 31 8Z" fill="black" fillOpacity="0.6"/>
                    <Path d="M19.88 3H6.12C5.55774 3 5.01851 3.22336 4.62093 3.62093C4.22336 4.01851 4 4.55774 4 5.12V33H22V5.12C22 4.55774 21.7766 4.01851 21.3791 3.62093C20.9815 3.22336 20.4423 3 19.88 3ZM20 31H17V28H9V31H6V5.12C6 5.10424 6.0031 5.08864 6.00913 5.07408C6.01516 5.05952 6.024 5.04629 6.03515 5.03515C6.04629 5.024 6.05952 5.01516 6.07408 5.00913C6.08864 5.0031 6.10424 5 6.12 5H19.88C19.8958 5 19.9114 5.0031 19.9259 5.00913C19.9405 5.01516 19.9537 5.024 19.9649 5.03515C19.976 5.04629 19.9848 5.05952 19.9909 5.07408C19.9969 5.08864 20 5.10424 20 5.12V31Z" fill="black" fillOpacity="0.6"/>
                    {/* ...other paths... */}
                  </Svg>
                </View>
                <View style={styles.locationText}>
                  <Text style={styles.locationTitle}>Pizzaman Chicken</Text>
                  <Text style={styles.locationSubtitle}>
                    Mango Road, Kumasi
                  </Text>
                </View>
              </View>
            </View>
            {/* Repeat the above block for each location option as needed */}
            <View style={{ marginBottom: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 12,
                  backgroundColor: '#fafafa',
                  gap: 12,
                }}
                onTouchEnd={() =>
                  handleLocationSelect('Landmark 1', {
                    latitude: region.latitude + 0.0005,
                    longitude: region.longitude + 0.0005,
                  })
                }
              >
                <View style={styles.iconContainer}>
                  <Svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    {/* ...SVG Paths... */}
                    <Path d="M31 8H23V10H31V31H23V33H33V10C33 9.46957 32.7893 8.96086 32.4142 8.58579C32.0391 8.21071 31.5304 8 31 8Z" fill="black" fillOpacity="0.6"/>
                    <Path d="M19.88 3H6.12C5.55774 3 5.01851 3.22336 4.62093 3.62093C4.22336 4.01851 4 4.55774 4 5.12V33H22V5.12C22 4.55774 21.7766 4.01851 21.3791 3.62093C20.9815 3.22336 20.4423 3 19.88 3ZM20 31H17V28H9V31H6V5.12C6 5.10424 6.0031 5.08864 6.00913 5.07408C6.01516 5.05952 6.024 5.04629 6.03515 5.03515C6.04629 5.024 6.05952 5.01516 6.07408 5.00913C6.08864 5.0031 6.10424 5 6.12 5H19.88C19.8958 5 19.9114 5.0031 19.9259 5.00913C19.9405 5.01516 19.9537 5.024 19.9649 5.03515C19.976 5.04629 19.9848 5.05952 19.9909 5.07408C19.9969 5.08864 20 5.10424 20 5.12V31Z" fill="black" fillOpacity="0.6"/>
                    {/* ...other paths... */}
                  </Svg>
                </View>
                <View style={styles.locationText}>
                  <Text style={styles.locationTitle}>Pizzaman Chicken</Text>
                  <Text style={styles.locationSubtitle}>
                    Mango Road, Kumasi
                  </Text>
                </View>
              </View>
            </View>
               <View style={{ marginBottom: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 12,
                  backgroundColor: '#fafafa',
                  gap: 12,
                }}
                onTouchEnd={() =>
                  handleLocationSelect('Landmark 1', {
                    latitude: region.latitude + 0.0005,
                    longitude: region.longitude + 0.0005,
                  })
                }
              >
                <View style={styles.iconContainer}>
                  <Svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    {/* ...SVG Paths... */}
                    <Path d="M31 8H23V10H31V31H23V33H33V10C33 9.46957 32.7893 8.96086 32.4142 8.58579C32.0391 8.21071 31.5304 8 31 8Z" fill="black" fillOpacity="0.6"/>
                    <Path d="M19.88 3H6.12C5.55774 3 5.01851 3.22336 4.62093 3.62093C4.22336 4.01851 4 4.55774 4 5.12V33H22V5.12C22 4.55774 21.7766 4.01851 21.3791 3.62093C20.9815 3.22336 20.4423 3 19.88 3ZM20 31H17V28H9V31H6V5.12C6 5.10424 6.0031 5.08864 6.00913 5.07408C6.01516 5.05952 6.024 5.04629 6.03515 5.03515C6.04629 5.024 6.05952 5.01516 6.07408 5.00913C6.08864 5.0031 6.10424 5 6.12 5H19.88C19.8958 5 19.9114 5.0031 19.9259 5.00913C19.9405 5.01516 19.9537 5.024 19.9649 5.03515C19.976 5.04629 19.9848 5.05952 19.9909 5.07408C19.9969 5.08864 20 5.10424 20 5.12V31Z" fill="black" fillOpacity="0.6"/>
                    {/* ...other paths... */}
                  </Svg>
                </View>
                <View style={styles.locationText}>
                  <Text style={styles.locationTitle}>Pizzaman Chicken</Text>
                  <Text style={styles.locationSubtitle}>
                    Mango Road, Kumasi
                  </Text>
                </View>
              </View>
            </View>
               <View style={{ marginBottom: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 12,
                  backgroundColor: '#fafafa',
                  gap: 12,
                }}
                onTouchEnd={() =>
                  handleLocationSelect('Landmark 1', {
                    latitude: region.latitude + 0.0005,
                    longitude: region.longitude + 0.0005,
                  })
                }
              >
                <View style={styles.iconContainer}>
                  <Svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    {/* ...SVG Paths... */}
                    <Path d="M31 8H23V10H31V31H23V33H33V10C33 9.46957 32.7893 8.96086 32.4142 8.58579C32.0391 8.21071 31.5304 8 31 8Z" fill="black" fillOpacity="0.6"/>
                    <Path d="M19.88 3H6.12C5.55774 3 5.01851 3.22336 4.62093 3.62093C4.22336 4.01851 4 4.55774 4 5.12V33H22V5.12C22 4.55774 21.7766 4.01851 21.3791 3.62093C20.9815 3.22336 20.4423 3 19.88 3ZM20 31H17V28H9V31H6V5.12C6 5.10424 6.0031 5.08864 6.00913 5.07408C6.01516 5.05952 6.024 5.04629 6.03515 5.03515C6.04629 5.024 6.05952 5.01516 6.07408 5.00913C6.08864 5.0031 6.10424 5 6.12 5H19.88C19.8958 5 19.9114 5.0031 19.9259 5.00913C19.9405 5.01516 19.9537 5.024 19.9649 5.03515C19.976 5.04629 19.9848 5.05952 19.9909 5.07408C19.9969 5.08864 20 5.10424 20 5.12V31Z" fill="black" fillOpacity="0.6"/>
                    {/* ...other paths... */}
                  </Svg>
                </View>
                <View style={styles.locationText}>
                  <Text style={styles.locationTitle}>Pizzaman Chicken</Text>
                  <Text style={styles.locationSubtitle}>
                    Mango Road, Kumasi
                  </Text>
                </View>
              </View>
            </View>
            {/* Add more options as needed */}
          </View>
        </ScrollView>
       
       <View style={{
          display: openSearch === true ? 'none' : 'flex',
        }} >
           <PrimaryButton title="Continue" onPress={function (): void {
            throw new Error('Function not implemented.');
          } } />
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
    borderTopRightRadius : 24,
    borderTopLeftRadius : 24,
    position: 'relative',
    zIndex: 1,
   
    // height: '90%',
    // top is now set dynamically in the component
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