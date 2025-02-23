import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

type AnimatedChevronProps = {
  isOpen: boolean;
  size?: number;
  color?: string;
};

export function AnimatedChevron({ isOpen, size = 20, color = '#000' }: AnimatedChevronProps) {
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotationAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Feather name="chevron-right" size={size} color={color} />
    </Animated.View>
  );
}
