import { Stack, router, useSegments } from 'expo-router';

import ListLoading from '~/components/loaders/ListLoading';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '~/lib/context/authContext';

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
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="signin"
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
    </Stack>
  );
};

export default function Root() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
