import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router/tabs';

import { useColorScheme } from '~/lib/useColorScheme';

export default function AuditsLayout() {
  const { colors } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {},
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Customers',
          tabBarIcon: ({ color }) => <FontAwesome5 name="users" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="audited"
        options={{
          title: 'Audited',
          tabBarIcon: ({ color }) => <FontAwesome5 name="check-circle" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
