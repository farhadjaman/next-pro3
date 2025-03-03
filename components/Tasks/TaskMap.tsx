import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import GoogleMapView, { MapRef } from '~/components/Tasks/GoogleMapView';
import CarouselComponent from '~/components/Tasks/TaskSlider';
import { demoTasks } from '~/lib/demoData';
import { TaskLocation } from '~/types/task';

const tasksLocations: TaskLocation[] = demoTasks.map((task) => ({
  id: task.id,
  title: task.title,
  location: {
    name: task.location.name,
    address: task.location.address,
    postalCode: task.location.postalCode,
    city: task.location.city,
    lat: task.location.lat,
    long: task.location.long,
  },
}));

// Define constants for bottom sheet heights
const TAB_HEIGHT = 60; // Adjust this to match your actual tab height
const BOTTOM_SHEET_INITIAL_HEIGHT = TAB_HEIGHT + 20; // Slightly bigger than tabs
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TaskMapWithCarousel: React.FC = () => {
  const mapRef = useRef<MapRef>(null);
  // Convert pixel heights to percentages of screen height
  const snapPoints = useMemo(() => [
    `${Math.round((BOTTOM_SHEET_INITIAL_HEIGHT / SCREEN_HEIGHT) * 100)}%`, 
    '50%', 
    '75%'
  ], []);
  
  // Add a ref for the bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <View style={styles.container}>
      <View className="flex-1 overflow-hidden rounded-lg">
        <GoogleMapView
          tasksLocations={tasksLocations}
          ref={mapRef}
          googleMapsApiKey="AIzaSyBLV8dy31iwxSABri1mUdh1WIMyhuO-kVQ"
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.taskDetailsTitle}>Task Details</Text>
          {/* Add your task details content here */}
        </View>
      </BottomSheet>

      <View style={styles.carouselContainer}>
        <CarouselComponent />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  carouselContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  bottomSheetContent: {
    padding: 20,
  },
  taskDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  handleIndicator: {
    backgroundColor: '#000',
    width: 30,
    height: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default observer(TaskMapWithCarousel);
