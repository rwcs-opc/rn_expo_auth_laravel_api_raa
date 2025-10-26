import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
// Using mock auth for Expo Go - switch to AuthContext after building with EAS
import { AuthProvider, useAuth } from '@/contexts/AuthContextMock';


function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, userData, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user) {
      // User not logged in, redirect to auth/login if not already there
      if (!inAuthGroup && segments[0] !== 'auth') {
        router.replace('/auth/login');
      }
    } else if (user && !userData?.isRegistered) {
      // User logged in but not registered, redirect to register
      if (segments[0] !== 'auth' || segments[1] !== 'register') {
        router.replace('/auth/register');
      }
    } else if (user && userData?.isRegistered) {
      // User logged in and registered, redirect to tabs
      if (!inTabsGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [user, userData, segments, loading]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="otherScreens/modal" options={{ presentation: 'modal', headerShown: false }} />
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
