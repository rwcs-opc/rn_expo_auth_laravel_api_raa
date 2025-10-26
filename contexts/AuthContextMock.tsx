import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface UserData {
  uid: string;
  phoneNumber: string;
  name?: string;
  gender?: string;
  age?: string | number;
  address?: string;
  district?: string;
  state?: string;
  country?: string;
  pin?: string;
  latitude?: number;
  longitude?: number;
  isRegistered: boolean;
}

interface AuthContextType {
  user: { uid: string; phoneNumber: string } | null;
  userData: UserData | null;
  loading: boolean;
  authToken: string | null;
  signInWithPhone: (phoneNumber: string) => Promise<{ confirm: (code: string) => Promise<void> }>;
  confirmCode: (confirmation: any, code: string) => Promise<void>;
  registerUser: (data: Partial<UserData>) => Promise<void>;
  signOut: () => Promise<void>;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  fetchUserFromAPI: (token: string) => Promise<void>;
  setAuthToken: (token: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ uid: string; phoneNumber: string } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const userDataJson = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('authToken');

      if (userJson) {
        setUser(JSON.parse(userJson));
      }
      if (userDataJson) {
        setUserData(JSON.parse(userDataJson));
      }

      if (token) {
        setAuthTokenState(token);

        // Validate token with API on app startup
        try {
          console.log('🔍 Validating token on app startup...');
          await fetchUserFromAPI(token);
          console.log('✅ Token validated successfully');
        } catch (error: any) {
          // Token invalid - clear everything
          console.log('❌ Token validation failed on startup:', error.message);
          await AsyncStorage.multiRemove(['user', 'userData', 'authToken']);
          setUser(null);
          setUserData(null);
          setAuthTokenState(null);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const setAuthToken = async (token: string | null) => {
    try {
      if (token) {
        await AsyncStorage.setItem('authToken', token);
        setAuthTokenState(token);
      } else {
        await AsyncStorage.removeItem('authToken');
        setAuthTokenState(null);
      }
    } catch (error) {
      console.error('Error setting auth token:', error);
      throw error;
    }
  };

  const fetchUserFromAPI = async (token: string) => {
    try {
      const response = await axios.get('https://safe-online.rwcs.in/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        timeout: 15000, // 15 seconds timeout
      });

      if (response.status === 200 && response.data) {
        const apiUser = response.data;

        // Map API user data to our UserData structure
        const mappedUserData: UserData = {
          uid: apiUser.id?.toString() || `api_${Date.now()}`,
          phoneNumber: apiUser.phone || '',
          name: apiUser.name,
          gender: apiUser.gender,
          age: apiUser.age,
          address: apiUser.address_line1,
          district: apiUser.district,
          state: apiUser.state,
          country: apiUser.country,
          pin: apiUser.pin,
          latitude: apiUser.latitude ? parseFloat(apiUser.latitude) : undefined,
          longitude: apiUser.longitude ? parseFloat(apiUser.longitude) : undefined,
          isRegistered: true,
        };

        const userObj = {
          uid: mappedUserData.uid,
          phoneNumber: mappedUserData.phoneNumber,
        };

        // Save to state and AsyncStorage
        setUser(userObj);
        setUserData(mappedUserData);
        await AsyncStorage.setItem('user', JSON.stringify(userObj));
        await AsyncStorage.setItem('userData', JSON.stringify(mappedUserData));

        console.log('✅ User data fetched and saved successfully');
      }
    } catch (error: any) {
      // Handle 401 Unauthorized - Token deleted/invalid/expired
      if (error.response?.status === 401) {
        console.log('🔒 Token invalid (401) - Session expired');

        // Clear all auth data
        try {
          await AsyncStorage.multiRemove(['user', 'userData', 'authToken']);
          setUser(null);
          setUserData(null);
          setAuthTokenState(null);
          console.log('✅ Auth data cleared from storage');
        } catch (clearError) {
          console.error('Error clearing auth data:', clearError);
        }

        // Show alert to user
        Alert.alert(
          'Session Expired',
          'Your session has expired or token was revoked. Please login again.',
          [{ text: 'OK' }],
          { cancelable: false }
        );

        throw new Error('Token is invalid. Please login again.');
      }

      // Handle other errors
      console.error('Error fetching user from API:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      throw error;
    }
  };

  const signInWithPhone = async (phoneNumber: string) => {
    // Mock OTP sending: fixed OTP is "112233"
    console.log('Mock: Sending OTP to', phoneNumber);
    // console.log('🔐 Use OTP: 112233');

    return {
      confirm: async (code: string) => {
        if (code === '112233') {
          const mockUser = {
            uid: `user_${Date.now()}`,
            phoneNumber: phoneNumber,
          };

          setUser(mockUser);
          await AsyncStorage.setItem('user', JSON.stringify(mockUser));

          const existingUserData = await AsyncStorage.getItem(`userData_${mockUser.uid}`);
          if (existingUserData) {
            const parsedData = JSON.parse(existingUserData);
            setUserData(parsedData);
            await AsyncStorage.setItem('userData', existingUserData);
          } else {
            // New user without details yet
            const newUserData: UserData = {
              uid: mockUser.uid,
              phoneNumber: mockUser.phoneNumber,
              isRegistered: false,
            };
            setUserData(newUserData);
            await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
          }
        } else {
          throw new Error('Invalid OTP');
        }
      },
    };
  };

  const confirmCode = async (confirmation: any, code: string) => {
    await confirmation.confirm(code);
  };

  const registerUser = async (data: Partial<UserData>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const userDocData: UserData = {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        name: data.name,
        gender: data.gender,
        age: data.age,
        address: data.address,
        district: data.district,
        state: data.state,
        country: data.country,
        pin: data.pin,
        latitude: data.latitude,
        longitude: data.longitude,
        isRegistered: true,
      };

      await AsyncStorage.setItem(`userData_${user.uid}`, JSON.stringify(userDocData));
      await AsyncStorage.setItem('userData', JSON.stringify(userDocData));
      setUserData(userDocData);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setUserData(null);
      setAuthTokenState(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        authToken,
        signInWithPhone,
        confirmCode,
        registerUser,
        signOut,
        setUserData,
        fetchUserFromAPI,
        setAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
