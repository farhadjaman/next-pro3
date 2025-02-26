import { Tabs } from 'expo-router/tabs';
import { useColorScheme } from '~/lib/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';

export default function TabsLayout() {
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
          title: 'On Site',
          tabBarIcon: ({ color }) => <FontAwesome5 name="tasks" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workshop"
        options={{
          title: 'Workshop',
          tabBarIcon: ({ color }) => <FontAwesome5 name="wrench" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="other"
        options={{
          title: 'Other',
          tabBarIcon: ({ color }) => <FontAwesome5 name="users" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <FontAwesome5 name="search" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
