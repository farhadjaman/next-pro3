import '../global.css';
import 'expo-dev-client';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack, useSegments, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useEffect } from 'react';

import { ThemeToggle } from '~/components/ThemeToggle';
import ListLoading from '~/components/loaders/ListLoading';

import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { AuthProvider, useAuth } from '~/lib/context/authContext';

export { ErrorBoundary } from 'expo-router';

const MainLayout = () => {
  const { session, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    //@ts-ignore
    const insideApp = segments[0] === '(app)';
    if (isLoading) <ListLoading message="Loading..." />;

    if (!session && !isLoading) {
      router.replace('/auth/(login)');
    } else if (session && !insideApp) {
      router.replace('/profile');
    }
  }, [session, isLoading]);

  return (
    <Stack screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="auth"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(app)"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="modal" options={MODAL_OPTIONS} />
    </Stack>
  );
};

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
        <NavThemeProvider value={NAV_THEME[colorScheme]}>
          <AuthProvider>
            <MainLayout />
          </AuthProvider>
        </NavThemeProvider>
      </KeyboardProvider>
    </>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios_from_right', // for android
} as const;

const MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom',
  title: 'Settings',
  headerRight: () => <ThemeToggle />,
} as const;
