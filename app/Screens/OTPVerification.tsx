import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';
import BackButton from '@/components/BackButton';

const OTPVerification = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputsRef = useRef([]);
  const { confirmation } = route?.params || {}; // Safely access route.params

  const handleInputChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if a digit is entered
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
    // Move to the previous input if a digit is deleted
    else if (!value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    try {
      await confirmation.confirm(otpCode);
      Alert.alert('Success', 'Phone number verified!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP code. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(`+233${input}`);
      Alert.alert('OTP Resent', 'A new verification code has been sent to your phone.');
      navigation.navigate('SelectSchool', { confirmation });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const isButtonDisabled = otp.some((value) => value === '');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', position: 'absolute', left: 0, right: 0 }}>
          <Text style={styles.headerTitle}>OTP Verification</Text>
        </View>
      </View>
      <Text style={styles.label}>Enter OTP Code</Text>
      <Text style={styles.subtitle}>
        Enter the verification code we just sent to your mobile number.
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputsRef.current[index] = ref)}
            style={[
              styles.input,
              {
                borderColor: value ? '#000' : 'rgba(0, 0, 0, 0.20)',
                backgroundColor: value ? '#fff' : '#F4F4F4',
              },
            ]}
            value={value}
            onChangeText={(text) => handleInputChange(text, index)}
            maxLength={1}
            keyboardType="numeric"
            returnKeyType="next"
            autoCapitalize="none"
          />
        ))}
      </View>

      <PrimaryButton title="Verify" disabled={isButtonDisabled} onPress={() => navigation.navigate('GeneralDetails')} />

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn’t receive a code? </Text>
        <TouchableOpacity onPress={handleResendOTP}>
          <Text style={styles.resendLink}>Resend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 20,
    marginBottom: 8,
    marginTop: 50,
    fontWeight: '600',
  },
  subtitle: {
    marginBottom: 24,
    color: 'rgba(0, 0, 0, 0.60)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap : '80%'

  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  otpContainer: {
    flexDirection: 'row',
    // gap: 30,
    marginBottom: 12,
    justifyContent: 'space-between'
  },
  input: {
    height: 60,
    borderColor: 'rgba(0, 0, 0, 0.20)',
    borderWidth: 1,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
    width: 80,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    color: 'rgba(0, 0, 0, 0.60)',
    fontSize: 14,
  },
  resendLink: {
    fontWeight: '700',
    color: '#000',
  },
});

export default OTPVerification;
