import '../global.css';
import 'expo-dev-client';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack, useSegments, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { ThemeToggle } from '~/components/ThemeToggle';
import ListLoading from '~/components/loaders/ListLoading';
import { AuthProvider, useAuth } from '~/lib/context/authContext';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { DB_NAME } from '~/lib/constants';

export { ErrorBoundary } from 'expo-router';

// Load the database from assets to the device's filesystem
const loadDatabase = async () => {
  try {
    // Define where we want to store the database file
    const dbFolder = `${FileSystem.documentDirectory}SQLite`;
    const dbPath = `${dbFolder}/${DB_NAME}`;
    // Create the SQLite directory if it doesn't exist
    const folderInfo = await FileSystem.getInfoAsync(dbFolder);
    if (!folderInfo.exists) {
      await FileSystem.makeDirectoryAsync(dbFolder, { intermediates: true });
    }

    // Check if database already exists
    const fileInfo = await FileSystem.getInfoAsync(dbPath);
    if (fileInfo.exists) {
      // For development, you might want to delete the existing db to get a fresh copy
      // Comment out this section if you want to preserve your database between app runs
      await FileSystem.deleteAsync(dbPath);
    }

    // Load the SQLite file from assets
    const sqliteAssets = require(`../assets/data.sqlite`);
    const asset = Asset.fromModule(sqliteAssets);

    // Download the asset
    await asset.downloadAsync();

    if (!asset.localUri) {
      throw new Error('Failed to get localUri for SQLite asset');
    }

    await FileSystem.copyAsync({
      from: asset.localUri,
      to: dbPath,
    });

    // Verify the copy was successful
    const newFileInfo = await FileSystem.getInfoAsync(dbPath);
    if (!newFileInfo.exists) {
      throw new Error('Failed to copy database file');
    }

    return { dbPath, folderPath: dbFolder };
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
};

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
  const [dbReady, setDbReady] = useState(false);
  const [sqliteDirectory, setSqliteDirectory] = useState('');
  const [dbError, setDbError] = useState<Error | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const { folderPath } = await loadDatabase();
        setSqliteDirectory(folderPath);
        setDbReady(true);
      } catch (error) {
        if (error instanceof Error) {
          setDbError(error);
        } else {
          setDbError(new Error('Unknown database error'));
        }
      }
    };

    initDatabase();
  }, []);

  if (dbError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Database Error</Text>
        <Text>{dbError.message}</Text>
        <Button
          title="Retry"
          onPress={() => {
            setDbError(null);
            loadDatabase()
              .then(({ folderPath }) => {
                setSqliteDirectory(folderPath);
                setDbReady(true);
              })
              .catch((error) => {
                if (error instanceof Error) {
                  setDbError(error);
                } else {
                  setDbError(new Error('Unknown database error'));
                }
              });
          }}
        />
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

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
              <SQLite.SQLiteProvider useSuspense databaseName={DB_NAME} directory={sqliteDirectory}>
                <AuthProvider>
                  <MainLayout />
                </AuthProvider>
              </SQLite.SQLiteProvider>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  helpText: {
    marginTop: 10,
    color: '#666',
  },
});
