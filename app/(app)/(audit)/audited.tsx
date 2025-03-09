import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

export default function AuditedScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Audited Screen</Text>
      </View>
    </View>
  );
}
