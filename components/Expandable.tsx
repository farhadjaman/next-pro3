import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';

interface ExpandableComponentProps {
  collapsedHeight: number;
  expandedHeight: number;
  children: React.ReactNode;
  initialPosition?: 'open' | 'closed';
  animationDuration?: number;
  backgroundColor?: string;
  containerStyle?: ViewStyle;
  onToggle?: (isExpanded: boolean) => void;
}

const ExpandableComponent: React.FC<ExpandableComponentProps> = ({
  collapsedHeight,
  expandedHeight,
  children,
  initialPosition = 'closed',
  backgroundColor = '#FFFFFF',
  animationDuration = 300,
  containerStyle,
  onToggle = () => {},
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initialPosition === 'open');
  const height = useRef(new Animated.Value(isExpanded ? expandedHeight : collapsedHeight)).current;

  const toggleExpand = (): void => {
    const newExpanded = !isExpanded;
    const toValue = newExpanded ? expandedHeight : collapsedHeight;

    Animated.timing(height, {
      toValue,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();

    setIsExpanded(newExpanded);
    onToggle(newExpanded);
  };

  return (
    <Animated.View style={[styles.container, { height }, containerStyle]}>
      <View style={[styles.calendarContainer, { backgroundColor }]}>{children}</View>

      <TouchableOpacity style={styles.knobContainer} onPress={toggleExpand} activeOpacity={0.7}>
        <View style={styles.knobHandle} />
        <Text style={styles.knobText}>{isExpanded ? 'Collapse Calendar' : 'Expand Calendar'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // This ensures the component is positioned correctly in the flow
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    // Shadow for elevation effect
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    // Zero bottom margin to remove gap
    marginBottom: 0,
  },
  calendarContainer: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  knobContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  knobHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 4,
  },
  knobText: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
  },
});

export default ExpandableComponent;
