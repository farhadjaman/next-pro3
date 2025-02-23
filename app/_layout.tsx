import '../global.css';
import 'expo-dev-client';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack, useSegments, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { ThemeToggle } from '~/components/ThemeToggle';
import ListLoading from '~/components/loaders/ListLoading';
import { AuthProvider, useAuth } from '~/lib/context/authContext';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';

export { ErrorBoundary } from 'expo-router';

const MainLayout = () => {
  const { session, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const insideApp = segments[0] === '(app)';

    if (!session && !isLoading) {
      router.replace('/auth/(login)');
    } else if (session && !insideApp) {
      router.replace('/(app)/profile');
    }
  }, [session, isLoading]);

  if (isLoading) return <ListLoading message="Loading..." />;

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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
            <NavThemeProvider value={NAV_THEME[colorScheme]}>
              <AuthProvider>
                <MainLayout />
              </AuthProvider>
            </NavThemeProvider>
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios_from_right',
} as const;

const MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom',
  title: 'Settings',
  headerRight: () => <ThemeToggle />,
} as const;
