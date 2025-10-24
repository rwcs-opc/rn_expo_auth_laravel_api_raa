import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContextMock';
import * as Location from 'expo-location';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    address: '',
    district: '',
    state: '',
    country: '',
    pin: '',
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { registerUser } = useAuth();
  const router = useRouter();

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
    // Validate required fields
    if (!formData.name || !formData.gender || !formData.age) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Gender, Age)');
      return;
    }

    if (!formData.address || !formData.district || !formData.state || !formData.country || !formData.pin) {
      Alert.alert('Error', 'Please fill in all address fields');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Please capture your location');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        ...formData,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      Alert.alert('Success', 'Registration completed successfully!');
      // Navigation will be handled by auth state change
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Please provide your details</Text>
          </View>

          <View style={styles.form}>
            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
              />
            </View>

            {/* Gender */}
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

            {/* Age */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                value={formData.age}
                onChangeText={(value) => updateField('age', value)}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            {/* Address */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your complete address"
                value={formData.address}
                onChangeText={(value) => updateField('address', value)}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* District */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>District *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your district"
                value={formData.district}
                onChangeText={(value) => updateField('district', value)}
              />
            </View>

            {/* State */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>State *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your state"
                value={formData.state}
                onChangeText={(value) => updateField('state', value)}
              />
            </View>

            {/* Country */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your country"
                value={formData.country}
                onChangeText={(value) => updateField('country', value)}
              />
            </View>

            {/* PIN */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>PIN Code *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your PIN code"
                value={formData.pin}
                onChangeText={(value) => updateField('pin', value)}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            {/* Location */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location *</Text>
              <TouchableOpacity
                style={[styles.locationButton, location && styles.locationButtonActive]}
                onPress={getLocation}
                disabled={loadingLocation}
              >
                {loadingLocation ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.locationButtonText}>
                    {location
                      ? `✓ Location Captured (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`
                      : 'Capture Current Location'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Complete Registration</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E23744',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
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
  textArea: {
    height: 100,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
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
  genderButtonActive: {
    backgroundColor: '#E23744',
    borderColor: '#E23744',
  },
  genderText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
  },
  genderTextActive: {
    color: '#FFFFFF',
  },
  locationButton: {
    height: 56,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButtonActive: {
    backgroundColor: '#2ECC71',
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
