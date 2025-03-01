import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
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

const TaskMapWithCarousel: React.FC = () => {
  const mapRef = useRef<MapRef>(null);

  return (
    <View style={styles.container}>
      <View className="flex-1 overflow-hidden rounded-lg">
        <GoogleMapView
          tasksLocations={tasksLocations}
          ref={mapRef}
          googleMapsApiKey={'AIzaSyBLV8dy31iwxSABri1mUdh1WIMyhuO-kVQ'}
        />
      </View>

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
    height: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default observer(TaskMapWithCarousel);
