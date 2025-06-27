import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SplashScreen from '../Screens/SplashScreen';

import Home from '../Screens/Home';
import OTPVerification from '../Screens/OTPVerification';
import Onboarding from '../Screens/Onboarding';
import PhoneNumber from '../Screens/PhoneNumber';
import OrderIDPage from '../Screens/OrderIDPage';
import GeneralDetails from '../Screens/GeneralDetails';
import SelectLocation from '../Screens/SelectLocation';
import OpenStreetMapComponent from '../Screens/OpenStreetMapComponent';
import SelectCylinder from '../Screens/SelectCylinder';
import Amount from '../Screens/Amount';
import Payment from '../Screens/Payment';
import Tracker from '../Screens/Tracker';

const Stack = createNativeStackNavigator();

export default function MainNav() {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumber} options={{ headerShown: false }} />
      <Stack.Screen name="OrderIDPage" component={OrderIDPage} options={{ headerShown: false }} />
      <Stack.Screen name="GeneralDetails" component={GeneralDetails} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="OTPVerification" component={OTPVerification} options={{ headerShown: false }} />
      <Stack.Screen name="SelectLocation" component={SelectLocation} options={{ headerShown: false }} />
      <Stack.Screen name="SelectCylinder" component={SelectCylinder} options={{ headerShown: false }} />
      <Stack.Screen name="Amount" component={Amount} options={{ headerShown: false }} />
      <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
      <Stack.Screen name="Tracker" component={Tracker} options={{ headerShown: false }} />
      {/* <Stack.Screen name="OpenStreetMapComponent" component={OpenStreetMapComponent} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
  );
}
