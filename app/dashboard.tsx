import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContextMock';

export default function DashboardScreen() {
  const { userData, signOut } = useAuth();
  const router = useRouter();

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
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  if (!userData) {
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Back!</Text>
            <Text style={styles.userName}>{userData.name || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Number:</Text>
            <Text style={styles.infoValue}>{userData.phoneNumber}</Text>
          </View>

          {userData.name && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{userData.name}</Text>
            </View>
          )}

          {userData.gender && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender:</Text>
              <Text style={styles.infoValue}>{userData.gender}</Text>
            </View>
          )}

          {userData.age && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age:</Text>
              <Text style={styles.infoValue}>{userData.age}</Text>
            </View>
          )}
        </View>

        {/* Address Card */}
        {userData.address && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Address Details</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>{userData.address}</Text>
            </View>

            {userData.district && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>District:</Text>
                <Text style={styles.infoValue}>{userData.district}</Text>
              </View>
            )}

            {userData.state && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>State:</Text>
                <Text style={styles.infoValue}>{userData.state}</Text>
              </View>
            )}

            {userData.country && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Country:</Text>
                <Text style={styles.infoValue}>{userData.country}</Text>
              </View>
            )}

            {userData.pin && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>PIN Code:</Text>
                <Text style={styles.infoValue}>{userData.pin}</Text>
              </View>
            )}
          </View>
        )}

        {/* Location Card */}
        {userData.latitude && userData.longitude && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Location</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Latitude:</Text>
              <Text style={styles.infoValue}>{userData.latitude.toFixed(6)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Longitude:</Text>
              <Text style={styles.infoValue}>{userData.longitude.toFixed(6)}</Text>
            </View>
          </View>
        )}

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
