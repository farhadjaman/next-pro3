import * as React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';

export default function Screen() {
  return (
    <View className="flex-1 items-center justify-center gap-1 px-12">
      <Text variant="title3" className="pb-1 text-center font-semibold">
        Jobs
      </Text>
    </View>
  );
}
