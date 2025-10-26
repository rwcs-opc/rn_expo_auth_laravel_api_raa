import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
  signInWithPhone: (phoneNumber: string) => Promise<{ confirm: (code: string) => Promise<void> }>;
  confirmCode: (confirmation: any, code: string) => Promise<void>;
  registerUser: (data: Partial<UserData>) => Promise<void>;
  signOut: () => Promise<void>;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ uid: string; phoneNumber: string } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const userDataJson = await AsyncStorage.getItem('userData');
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
      if (userDataJson) {
        setUserData(JSON.parse(userDataJson));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
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
      setUser(null);
      setUserData(null);
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
        signInWithPhone,
        confirmCode,
        registerUser,
        signOut,
        setUserData,
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
