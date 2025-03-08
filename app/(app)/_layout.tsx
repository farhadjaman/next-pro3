import { Ionicons, Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { router, useSegments, Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useEffect, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { observer } from 'mobx-react-lite';

import RoleManagement from '~/components/app/RoleManagement';
import { AnimatedChevron } from '~/components/AnimatedIcons/AnimatedChevron';
import { HeaderButton } from '~/components/HeaderButton';
import ListLoading from '~/components/loaders/ListLoading';
import {
  DrawerContentRoot,
  DrawerContentSection,
  DrawerContentSectionItem,
  DrawerContentSectionTitle,
  getActiveDrawerContentScreen,
} from '~/components/nativewindui/DrawerContent';
import { Text } from '~/components/nativewindui/Text';
import { useAuth } from '~/lib/context/authContext';
import { useColorScheme } from '~/lib/useColorScheme';
import { store } from '~/store';

export default function AppLayout() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const { colors } = useColorScheme();

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
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        swipeEnabled: true,
        headerTintColor: Platform.OS === 'ios' ? undefined : colors.foreground,
      }}>
      <Drawer.Screen
        name="profile/index"
        options={{
          headerTitle: 'Profile',
          drawerLabel: 'Profile',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="(jobs)"
        options={{
          headerTitle: 'Professional Jobs',
          drawerLabel: 'Professional Jobs',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="border-bottom" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

const DrawerContent = observer((props: DrawerContentComponentProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const activeScreen = getActiveDrawerContentScreen(props);
  const { colors } = useColorScheme();

  // Pull username from the store; if not available, fallback to 'Guest'
  const username =
    store.currentUser && store.currentUser.firstName && store.currentUser.lastName
      ? `${store.currentUser.firstName} ${store.currentUser.lastName}`
      : 'Guest';

  return (
    <DrawerContentRoot navigation={props.navigation}>
      <DrawerContentSection>
        <Pressable
          onPress={() => setIsSheetOpen(true)}
          className="flex-row items-center rounded-md p-4"
          style={{ backgroundColor: colors.grey6 }}>
          <Feather name="user" size={28} color={colors.primary} />
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
              {username}
            </Text>
            <Text className="text-xs text-gray-600">Tap to manage role</Text>
          </View>
          <AnimatedChevron isOpen={isSheetOpen} size={20} color={colors.primary} />
        </Pressable>
      </DrawerContentSection>
      <DrawerContentSectionTitle type="default">Activities</DrawerContentSectionTitle>
      <DrawerContentSection>
        <DrawerContentSectionItem
          icon={{ name: 'play-circle-outline' }}
          isActive={activeScreen === '(tabs)'}
          label="Professional Jobs"
          onPress={() => router.push('/(app)/(jobs)')}
        />
        <DrawerContentSectionItem icon={{ name: 'atom' }} isActive={false} label="Consumer Jobs" />
        <DrawerContentSectionItem icon={{ name: 'alarm' }} isActive={false} label="Spare Parts" />
        <DrawerContentSectionItem
          icon={{ name: 'alarm' }}
          isActive={false}
          label="Assets Managment"
        />
      </DrawerContentSection>
      {Platform.OS === 'android' && <View className="mx-3.5 my-1 h-px bg-border" />}
      <DrawerContentSectionTitle>User</DrawerContentSectionTitle>
      <DrawerContentSection>
        <DrawerContentSectionItem
          icon={{ name: 'microphone-variant' }}
          isActive={activeScreen === '(profile)'}
          label="Profile"
          onPress={() => router.push('/(app)/profile')}
        />
        <DrawerContentSectionItem icon={{ name: 'music-note' }} isActive={false} label="My Stats" />
      </DrawerContentSection>
      <RoleManagement isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </DrawerContentRoot>
  );
});
