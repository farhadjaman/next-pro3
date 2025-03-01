import { Tabs } from 'expo-router/tabs';
import { useColorScheme } from '~/lib/useColorScheme';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';

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
          title: 'map',
          tabBarIcon: ({ color }) => <FontAwesome5 name="map" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calender"
        options={{
          title: 'calender',
          tabBarIcon: ({ color }) => <AntDesign name="calendar" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="unassigned"
        options={{
          title: 'Unassigned',
          tabBarIcon: ({ color }) => <FontAwesome5 name="tasks" size={20} color={color} />,
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
