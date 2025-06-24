import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
import MainNav from './MainNav';
import { LocationProvider } from '../../hooks/LocationContext'; // Import LocationContext

export default function Index() {
  return (
    <LocationProvider>
      <MainNav/>
    </LocationProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
});
