import { useAuth } from '@/contexts/AuthContextMock';
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
  const { registerUser, signOut } = useAuth();

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
    if (!formData.name || !formData.gender || !formData.age) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Gender, Age)');
      return;
    }
    if (!formData.phone) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }
    if (
      !formData.address_line1 ||
      !formData.city ||
      !formData.district ||
      !formData.state ||
      !formData.country ||
      !formData.pin
    ) {
      Alert.alert('Error', 'Please fill in all required address fields (Address Line 1, City, District, State, Country, PIN)');
      return;
    }
    if (!location) {
      Alert.alert('Error', 'Please capture your location');
      return;
    }

    setLoading(true);
    try {
      const registrationData = {
        ...formData,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const response = await axios.post('https://safe-online.rwcs.in/api/register-user', registrationData);

      if (response.data.success) {
        await registerUser(registrationData);
        Alert.alert('Success', 'Registration completed successfully!');
        router.replace('/dashboard');
      } else {
        throw new Error(response.data.message || 'Registration failed');
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

          {/* Form fields for name, gender, age, phone (disabled), address, etc. */}
          {/* Add fields following your design, similar to the previous snippet */}

          {/* Example for name input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Enter your full name"
            />
          </View>

          {/* Gender selection */}
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

          {/* Other form inputs like age, address_line1, city, district, state, country, pin */}

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
