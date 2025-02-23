import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const LoadingComponent = ({ message }: { message: string }) => {
  return (
    <View className="bg-dark mt-12 flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="white" />
      <Text className="font-jetbrainsLight mt-2.5 text-lg text-primary">{message}</Text>
    </View>
  );
};

export default LoadingComponent;
