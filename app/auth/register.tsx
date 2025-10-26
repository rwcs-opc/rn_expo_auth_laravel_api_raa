import { useAuth } from '@/contexts/AuthContextMock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    age: '',
    address_line1: '',
    address_line2: '',
    city: '',
    district: '',
    state: '',
    country: '',
    pin: '',
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams();
  const { registerUser, user, setUserData, setAuthToken, fetchUserFromAPI } = useAuth();

  useEffect(() => {
    if (params.phone) {
      setFormData((prev) => ({
        ...prev,
        phone: params.phone as string,
      }));
    }
  }, [params.phone]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to get your location');
        setLoadingLocation(false);
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      Alert.alert('Success', 'Location captured successfully');
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleRegister = async () => {
    const normalizedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()])
    ) as typeof formData;

    if (!normalizedData.name || !normalizedData.gender || !normalizedData.age) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Gender, Age)');
      return;
    }
    if (!normalizedData.phone) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }

    const requiredAddressFields: Array<keyof typeof normalizedData> = [
      'address_line1',
      'city',
      'district',
      'state',
      'country',
      'pin',
    ];
    if (requiredAddressFields.some((field) => !normalizedData[field])) {
      Alert.alert(
        'Error',
        'Please fill in all required address fields (Address Line 1, City, District, State, Country, PIN)'
      );
      return;
    }

    const ageNumber = parseInt(normalizedData.age, 10);
    if (Number.isNaN(ageNumber) || ageNumber <= 0) {
      Alert.alert('Error', 'Please enter a valid age');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Please capture your location');
      return;
    }

    setLoading(true);
    try {
      const registrationData = {
        ...normalizedData,
        age: ageNumber,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const response = await axios.post('https://safe-online.rwcs.in/api/register-user', registrationData);
      console.log('api register-user register response ', response.data);

      if (response.status === 200 && response.data.token) {
        const combinedAddress = [registrationData.address_line1, registrationData.address_line2]
          .filter(Boolean)
          .join(', ');
        const profileForAuth = {
          name: registrationData.name,
          gender: registrationData.gender,
          age: registrationData.age,
          address: combinedAddress,
          district: registrationData.district,
          state: registrationData.state,
          country: registrationData.country,
          pin: registrationData.pin,
          latitude: registrationData.latitude,
          longitude: registrationData.longitude,
        };

        if (user) {
          try {
            await registerUser(profileForAuth);
          } catch (registerError) {
            console.warn('Unable to sync profile with auth context:', registerError);
          }
        } else if (setUserData) {
          const userDetail = response.data.userDetail || {};
          const parsedLatitude =
            userDetail?.latitude !== undefined && userDetail?.latitude !== null
              ? Number(userDetail.latitude)
              : undefined;
          const parsedLongitude =
            userDetail?.longitude !== undefined && userDetail?.longitude !== null
              ? Number(userDetail.longitude)
              : undefined;

          const fallbackUserData = {
            uid: response.data.user?.id?.toString() || `api_${registrationData.phone}`,
            phoneNumber: userDetail?.phone || registrationData.phone,
            name: userDetail?.name || registrationData.name,
            gender: userDetail?.gender || registrationData.gender,
            age: userDetail?.age || registrationData.age,
            address:
              [userDetail?.address_line1, userDetail?.address_line2].filter(Boolean).join(', ') ||
              combinedAddress,
            district: userDetail?.district || registrationData.district,
            state: userDetail?.state || registrationData.state,
            country: userDetail?.country || registrationData.country,
            pin: userDetail?.pin || registrationData.pin,
            latitude: parsedLatitude ?? registrationData.latitude,
            longitude: parsedLongitude ?? registrationData.longitude,
            isRegistered: true,
          };

          try {
            await AsyncStorage.setItem('user', JSON.stringify({ uid: fallbackUserData.uid, phoneNumber: fallbackUserData.phoneNumber }));
            await AsyncStorage.setItem('userData', JSON.stringify(fallbackUserData));
            setUserData(fallbackUserData);
          } catch (storageError) {
            console.warn('Unable to persist user data locally:', storageError);
          }
        }

        Alert.alert('Success', response.data?.message || 'Registration completed successfully!');

        const token = response.data.token;
        console.log('Registration successful, authToken received:', token);

        try {
          // Set the auth token in context and AsyncStorage
          await setAuthToken(token);

          // Fetch user details from API using the token
          await fetchUserFromAPI(token);

          // Navigate to tabs after successful registration
          router.replace('/(tabs)');
        } catch (fetchError) {
          console.error('Error fetching user data after registration:', fetchError);
          Alert.alert('Error', 'Registration successful but failed to load user data. Please login again.');
        }
      } else {
        throw new Error((typeof response.data?.message === 'string' && response.data.message) || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to register';
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
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Please provide your details</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={formData.phone}
                editable={false}
                selectTextOnFocus={false}
                keyboardType="phone-pad"
                placeholder="Phone number"
              />
              <Text style={styles.helperText}>Phone number is verified via OTP.</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(value) => updateField('age', value.replace(/[^0-9]/g, ''))}
                placeholder="Enter your age"
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender *</Text>
              <View style={styles.genderContainer}>
                {['Male', 'Female', 'Other'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderButton,
                      formData.gender === gender && styles.genderButtonActive,
                    ]}
                    onPress={() => updateField('gender', gender)}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        formData.gender === gender && styles.genderTextActive,
                      ]}
                    >
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Details</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address Line 1 *</Text>
              <TextInput
                style={styles.input}
                value={formData.address_line1}
                onChangeText={(value) => updateField('address_line1', value)}
                placeholder="House number, street"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address Line 2</Text>
              <TextInput
                style={styles.input}
                value={formData.address_line2}
                onChangeText={(value) => updateField('address_line2', value)}
                placeholder="Area, landmark"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(value) => updateField('city', value)}
                placeholder="Enter your city"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>District *</Text>
              <TextInput
                style={styles.input}
                value={formData.district}
                onChangeText={(value) => updateField('district', value)}
                placeholder="Enter your district"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>State *</Text>
              <TextInput
                style={styles.input}
                value={formData.state}
                onChangeText={(value) => updateField('state', value)}
                placeholder="Enter your state"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={styles.input}
                value={formData.country}
                onChangeText={(value) => updateField('country', value)}
                placeholder="Enter your country"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>PIN Code *</Text>
              <TextInput
                style={styles.input}
                value={formData.pin}
                onChangeText={(value) => updateField('pin', value.replace(/[^0-9]/g, ''))}
                placeholder="Enter PIN code"
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.locationButton, location && styles.locationButtonActive]}
            onPress={getLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.locationButtonText}>
                {location
                  ? `✓ Location Captured (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`
                  : 'Capture Current Location'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Complete Registration</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20 },
  header: { marginTop: 20, marginBottom: 30, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E23744', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666666' },

  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 8 },
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

  genderContainer: { flexDirection: 'row', gap: 10 },
  genderButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  genderButtonActive: { backgroundColor: '#E23744', borderColor: '#E23744' },
  genderText: { fontSize: 16, color: '#666666', fontWeight: '600' },
  genderTextActive: { color: '#FFFFFF' },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333333', marginBottom: 16 },
  disabledInput: { backgroundColor: '#EFEFEF', borderColor: '#E0E0E0', color: '#777777' },
  helperText: { fontSize: 12, color: '#888888', marginTop: 6 },

  locationButton: {
    height: 56,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButtonActive: { backgroundColor: '#2ECC71' },
  locationButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  button: {
    backgroundColor: '#E23744',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#E23744',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});
