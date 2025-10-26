import { useAuth } from '@/contexts/AuthContextMock';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { userData, signOut, setUserData } = useAuth(); // ensure your context provides setUserData
  const router = useRouter();
  const params = useLocalSearchParams();

  // Local state to hold user details from params or context
  const [localUserData, setLocalUserData] = useState(userData);

  useEffect(() => {
    if (params.userDetail) {
      try {
        const parsedUserDetail = JSON.parse(params.userDetail as string);
        setLocalUserData(parsedUserDetail);
        setUserData(parsedUserDetail); // optionally update global context if available
      } catch (error) {
        console.error('Failed to parse userDetail param', error);
      }
    }
  }, [params.userDetail]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/'); // Go to home or login after logout
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  if (!localUserData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Back!</Text>
            <Text style={styles.userName}>{localUserData.name || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Update field names to match data */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Number:</Text>
            <Text style={styles.infoValue}>{localUserData.phone}</Text>
          </View>
          {localUserData.name && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{localUserData.name}</Text>
            </View>
          )}
          {localUserData.gender && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender:</Text>
              <Text style={styles.infoValue}>{localUserData.gender}</Text>
            </View>
          )}
          {localUserData.age && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age:</Text>
              <Text style={styles.infoValue}>{localUserData.age}</Text>
            </View>
          )}
        </View>

        {localUserData.address_line1 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Address Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address Line 1:</Text>
              <Text style={styles.infoValue}>{localUserData.address_line1}</Text>
            </View>
            {localUserData.district && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>District:</Text>
                <Text style={styles.infoValue}>{localUserData.district}</Text>
              </View>
            )}
            {localUserData.state && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>State:</Text>
                <Text style={styles.infoValue}>{localUserData.state}</Text>
              </View>
            )}
            {localUserData.country && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Country:</Text>
                <Text style={styles.infoValue}>{localUserData.country}</Text>
              </View>
            )}
            {localUserData.pin && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>PIN Code:</Text>
                <Text style={styles.infoValue}>{localUserData.pin}</Text>
              </View>
            )}
          </View>
        )}

        {localUserData.latitude && localUserData.longitude && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Location</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Latitude:</Text>
              <Text style={styles.infoValue}>{parseFloat(localUserData.latitude).toFixed(6)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Longitude:</Text>
              <Text style={styles.infoValue}>{parseFloat(localUserData.longitude).toFixed(6)}</Text>
            </View>
          </View>
        )}

        {/* Services and other UI sections as before */}
        {/* Services Section */}
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Our Services</Text>

          <View style={styles.serviceGrid}>
            <TouchableOpacity style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>🍔</Text>
              <Text style={styles.serviceText}>Food Delivery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>🛒</Text>
              <Text style={styles.serviceText}>Grocery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>💊</Text>
              <Text style={styles.serviceText}>Medicine</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>🎁</Text>
              <Text style={styles.serviceText}>More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#666666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#E23744',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  servicesContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
});
