import React, { createContext, useState, useContext, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface UserData {
  uid: string;
  phoneNumber: string;
  name?: string;
  gender?: string;
  age?: string;
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
  user: FirebaseAuthTypes.User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithPhone: (phoneNumber: string) => Promise<FirebaseAuthTypes.ConfirmationResult>;
  confirmCode: (confirmation: FirebaseAuthTypes.ConfirmationResult, code: string) => Promise<void>;
  registerUser: (data: Partial<UserData>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await firestore()
          .collection('users')
          .doc(firebaseUser.uid)
          .get();
        
        if (userDoc.exists) {
          const data = userDoc.data();
          if (data) {
            setUserData(data as UserData);
          }
        } else {
          // User exists in auth but not in Firestore (first time login)
          setUserData({
            uid: firebaseUser.uid,
            phoneNumber: firebaseUser.phoneNumber || '',
            isRegistered: false,
          });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithPhone = async (phoneNumber: string) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      return confirmation;
    } catch (error) {
      console.error('Error signing in with phone:', error);
      throw error;
    }
  };

  const confirmCode = async (
    confirmation: FirebaseAuthTypes.ConfirmationResult,
    code: string
  ) => {
    try {
      await confirmation.confirm(code);
    } catch (error) {
      console.error('Error confirming code:', error);
      throw error;
    }
  };

  const registerUser = async (data: Partial<UserData>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const userDocData: UserData = {
        uid: user.uid,
        phoneNumber: user.phoneNumber || '',
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

      await firestore()
        .collection('users')
        .doc(user.uid)
        .set(userDocData);

      setUserData(userDocData);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
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
