import { useAuth } from '@/contexts/AuthContextMock';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
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
              router.replace('/auth/login');
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
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Back!</Text>
            <Text style={styles.userName}>{userData.name || 'User'}</Text>
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
            <View style={styles.valueWithBadge}>
              <Text style={styles.infoValue}>{userData.phoneNumber}</Text>
              {userData.isPhoneVerified && (
                <Text style={styles.verifiedBadge}>✓</Text>
              )}
            </View>
          </View>
          {userData.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <View style={styles.valueWithBadge}>
                <Text style={styles.infoValue}>{userData.email}</Text>
                {userData.isEmailVerified && (
                  <Text style={styles.verifiedBadge}>✓</Text>
                )}
              </View>
            </View>
          )}
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

        {userData.address && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Address Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address Line 1:</Text>
              <Text style={styles.infoValue}>{userData.address}</Text>
            </View>
            {userData.address_line2 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address Line 2:</Text>
                <Text style={styles.infoValue}>{userData.address_line2}</Text>
              </View>
            )}
            {userData.city && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>City:</Text>
                <Text style={styles.infoValue}>{userData.city}</Text>
              </View>
            )}
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

        {userData.latitude && userData.longitude && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Location</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Latitude:</Text>
              <Text style={styles.infoValue}>{parseFloat(userData.latitude.toString()).toFixed(6)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Longitude:</Text>
              <Text style={styles.infoValue}>{parseFloat(userData.longitude.toString()).toFixed(6)}</Text>
            </View>
          </View>
        )}

        {userData.createdAt && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since:</Text>
              <Text style={styles.infoValue}>
                {new Date(userData.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            {userData.phoneVerifiedAt && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone Verified:</Text>
                <Text style={styles.infoValue}>
                  {new Date(userData.phoneVerifiedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            )}
          </View>
        )}

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
  valueWithBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  verifiedBadge: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
