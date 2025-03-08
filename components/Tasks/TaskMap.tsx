import { observer } from 'mobx-react-lite';
import React, { useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import GoogleMapView, { MapRef } from '~/components/Tasks/GoogleMapView';
import TaskCarousel from '~/components/Tasks/TaskSlider';
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

const TaskMapWithCarousel: React.FC = () => {
  const mapRef = useRef<MapRef>(null);

  // Add custom styles to position the carousel
  const carouselStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      bottom: 20,
      left: 0,
      right: 0,
      zIndex: 1, // Lower than the bottom sheet which is typically at z-index 2
    }),
    []
  );

  return (
    <View style={styles.container}>
      <View className="flex-1">
        <GoogleMapView
          tasksLocations={tasksLocations}
          ref={mapRef}
          googleMapsApiKey="AIzaSyBLV8dy31iwxSABri1mUdh1WIMyhuO-kVQ"
          style={styles.mapView}
        />
      </View>

      <View style={carouselStyle}>
        <TaskCarousel />
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
  mapView: {
    flex: 1,
  },
});

export default observer(TaskMapWithCarousel);
