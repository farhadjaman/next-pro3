import React, { useCallback, useMemo, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import TaskMap from '~/components/Tasks/TaskMap';
import { useColorScheme } from '~/lib/useColorScheme';

export default function MapScreen() {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['5%', '60%', '98%'], []);
  const { colors } = useColorScheme();
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <TaskMap />
      <BottomSheet
        index={0}
        handleIndicatorStyle={{ backgroundColor: colors.grey3 }}
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}>
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
