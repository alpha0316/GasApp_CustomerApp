import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
import MainNav from './MainNav';
import { LocationProvider } from '../../hooks/LocationContext'; // Import LocationContext
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function Index() {
  return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <LocationProvider>
            <MainNav/>
          </LocationProvider>
        </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
});
