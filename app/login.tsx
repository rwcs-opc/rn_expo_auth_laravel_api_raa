import { useAuth } from '@/contexts/AuthContextMock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signInWithPhone, confirmCode } = useAuth();
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone; // Default to India; adjust as needed
    }

    setLoading(true);
    try {
      const res = await axios.post('https://safe-online.rwcs.in/api/send-otp', {
        phone: formattedPhone,
      });

      Alert.alert('Success', `${res.data.message}\nOTP: ${res.data.otp}`);
      console.log('otp: ', res.data);

      const confirmationResult = await signInWithPhone(formattedPhone);
      setConfirmation(confirmationResult);
    } catch (error: any) {
      console.error('Send OTP error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send OTP';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }
    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }

    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://safe-online.rwcs.in/api/verify-otp', {
        phone: formattedPhone,
        otp: otp,
      });

      // console.log('OTP verification response:', response);

      if (response.status === 206) {
        // New user, navigate to registration with phone number
        router.push({
          pathname: '/register',
          params: { phone: formattedPhone },
        });
        return;
      } else if (response.status === 200 && response.data.token) {
        // Save token and navigate to dashboard
        // await AsyncStorage.setItem('authToken', response.data.token);
        // router.replace('/dashboard', { userDetail: response.data.userDetail });
        await AsyncStorage.setItem('authToken', response.data.token);
        router.replace({
          pathname: '/dashboard',
          params: { userDetail: JSON.stringify(response.data.userDetail) },
        });
        // router.replace({ pathname: '/tabs/dashboard', params: { userDetail: ... } });


      } else {
        throw new Error(response.data.message || 'OTP verification failed');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to verify OTP';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to Safe Online</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneInputWrapper}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.phoneInput}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                editable={!confirmation}
                placeholder="Enter phone number"
              />
            </View>
          </View>

          {!confirmation && (
            <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          )}

          {confirmation && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Enter OTP</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={6}
                  placeholder="6-digit OTP"
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleVerifyOTP} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                  setConfirmation(null);
                  setOtp('');
                }}
              >
                <Text style={styles.resendText}>Change Phone Number</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>By continuing, you agree to our Terms & Privacy Policy</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20 },
  header: { marginTop: 40, marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#E23744', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666666' },

  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 8 },

  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
  },
  countryCode: { fontSize: 16, fontWeight: '600', color: '#333333', paddingLeft: 16, paddingRight: 8 },
  phoneInput: { flex: 1, height: 56, fontSize: 16, color: '#333333', paddingRight: 16 },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    color: '#333333',
  },

  button: {
    backgroundColor: '#E23744',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#E23744',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },

  resendButton: { marginTop: 20, alignItems: 'center' },
  resendText: { color: '#E23744', fontSize: 16, fontWeight: '600' },

  footer: { marginTop: 30, alignItems: 'center' },
  footerText: { fontSize: 12, color: '#999999', textAlign: 'center' },
});
