import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, ViewStyle, Platform } from 'react-native';

interface ExpandableComponentProps {
  collapsedHeight: number;
  expandedHeight: number;
  children: React.ReactNode;
  initialPosition?: 'open' | 'closed';
  backgroundColor?: string;
  containerStyle?: ViewStyle;
  onToggle?: (isExpanded: boolean) => void;
}

// Using the same constant values as react-native-calendars
const KNOB_CONTAINER_HEIGHT = 24;

const ExpandableComponent: React.FC<ExpandableComponentProps> = ({
  collapsedHeight,
  expandedHeight,
  children,
  initialPosition = 'closed',
  backgroundColor = '#FFFFFF',
  containerStyle,
  onToggle = () => {},
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initialPosition === 'open');
  const height = useRef(new Animated.Value(isExpanded ? expandedHeight : collapsedHeight)).current;

  const toggleExpand = (): void => {
    const newExpanded = !isExpanded;
    const toValue = newExpanded ? expandedHeight : collapsedHeight;

    // Switch to spring animation
    Animated.spring(height, {
      toValue,
      speed: 15,
      bounciness: 6,
      useNativeDriver: false,
    }).start();

    setIsExpanded(newExpanded);
    onToggle(newExpanded);
  };

  return (
    <View style={styles.containerWrapper}>
      {/* Apply the same shadow style as react-native-calendars */}
      <Animated.View
        style={[
          styles.containerShadow,
          styles.container,
          { height, backgroundColor },
          containerStyle,
        ]}>
        <View style={styles.contentContainer}>{children}</View>

        {/* Knob container positioned exactly like in react-native-calendars */}
        <View style={styles.knobContainer}>
          <TouchableOpacity onPress={toggleExpand} activeOpacity={0.7}>
            <View style={styles.knob} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Following the exact style structure from react-native-calendars
  containerWrapper: {
    paddingBottom: 6,
  },
  containerShadow: {
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#858F96',
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowOffset: { height: 0, width: 0 },
        zIndex: 99,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  knobContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: KNOB_CONTAINER_HEIGHT,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  knob: {
    width: 40,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#e0e0e0', // Default knob color
  },
});

export default ExpandableComponent;
