import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook from react-navigation
import PrimaryButton from '@/components/PrimaryButton';


export default function Onboarding() {

  const navigation = useNavigation(); // Initialize navigation hook


  return (
    <View style={styles.main}>
        <View style={styles.main}>
            <PrimaryButton title='Get Started' onPress={() => navigation.navigate('PhoneNumber')}/>
        </View>
        
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    position : 'relative',
    top : '80%',
    justifyContent : 'center',
    gap : 12,
    paddingHorizontal : 12
  },
  text : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center',
    gap : 4
  }
});
