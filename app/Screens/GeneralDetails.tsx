import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';
import BackButton from '@/components/BackButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function GeneralDetails() {
  const navigation = useNavigation();


  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
 


  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneNumberRef = useRef<TextInput>(null);

  const handleNext = (nextRef: React.RefObject<TextInput>) => {
    nextRef.current?.focus();
  };

 {/*}
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Sign up the user with Firebase
    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;

      // Save user details to AsyncStorage
      const userDetails = {
        firstName,
        lastName,
        email,
        phoneNumber,
        userId: user.uid,
      };
      await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
      await AsyncStorage.setItem('userId', user.uid);

      navigation.navigate('SelectHostel');
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', 'An error occurred while signing up. Please try again.');
    }
  };*/}

  const isButtonDisabled = firstName === '' && lastName === '' && email === '' 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>General Details</Text>
      </View>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        returnKeyType="next"
        onSubmitEditing={() => handleNext(lastNameRef)}
        placeholder='Enter your first name'
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        ref={lastNameRef}
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        returnKeyType="next"
        onSubmitEditing={() => handleNext(emailRef)}
        placeholder='Enter your Last name'
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        ref={emailRef}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => handleNext(phoneNumberRef)}
        placeholder='Enter your email address'
      />
     
      <PrimaryButton title="Next" disabled={isButtonDisabled} onPress={() => navigation.navigate('OrderIDPage')} />
      <View style={styles.text}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: 'rgba(0, 0, 0, 0.20)',
    borderWidth: 1,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  text: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
  },
  scrollContainer: {
    maxHeight: '55%',
    overflow: 'hidden',
  }
});
