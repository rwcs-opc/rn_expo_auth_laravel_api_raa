import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
// Using mock auth for Expo Go - switch to AuthContext after building with EAS
import { AuthProvider, useAuth } from '@/contexts/AuthContextMock';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, userData, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!user) {
      // User not logged in, redirect to home/login
      if (segments[0] !== 'login' && segments[0] !== '(tabs)') {
        router.replace('/');
      }
    } else if (user && !userData?.isRegistered) {
      // User logged in but not registered, redirect to register
      if (segments[0] !== 'register') {
        router.replace('/register');
      }
    } else if (user && userData?.isRegistered) {
      // User logged in and registered, redirect to dashboard
      if (segments[0] !== 'dashboard') {
        router.replace('/dashboard');
      }
    }
  }, [user, userData, segments, loading]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
