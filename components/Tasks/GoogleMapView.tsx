import { observer } from 'mobx-react-lite';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  MapViewProps,
  Region,
  Polyline,
} from 'react-native-maps';

import { store } from '~/store';
import { TaskLocation } from '~/types/task';

const decodePolyline = (encoded: string) => {
  let index = 0;
  const len = encoded.length;
  const points = [];
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;
    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }
  return points;
};

export interface MapRef {
  animateToRegion: (region: Region, duration: number) => void;
  zoomToLocations: () => void;
  focusOnCurrentShop: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export interface GoogleMapViewProps extends Partial<MapViewProps> {
  googleMapsApiKey?: string;
  tasksLocations?: TaskLocation[];
}

const GoogleMapViewBase = forwardRef<MapRef, GoogleMapViewProps>((props, ref) => {
  const { currentLocation, currentShop } = store;
  const mapRef = useRef<MapView>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [currentZoom, setCurrentZoom] = useState<number>(0.05);

  const fetchRoute = async () => {
    if (!currentLocation || !currentShop || !props.googleMapsApiKey) return;
    try {
      const origin = `${currentLocation.lat},${currentLocation.long}`;
      const destination = `${currentShop.lat},${currentShop.long}`;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${props.googleMapsApiKey}`
      );
      const data = await response.json();
      console.log('data', data);
      if (data.status !== 'OK' || !data.routes[0]) {
        console.error('No route found:', data.status);
        return;
      }
      const points = decodePolyline(data.routes[0].overview_polyline.points);
      setRouteCoordinates(points);
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, [currentLocation, currentShop, props.googleMapsApiKey]);

  const focusOnCurrentShop = () => {
    if (!mapRef.current || !currentShop) return;

    mapRef.current.animateToRegion(
      {
        latitude: Number(currentShop.lat),
        longitude: Number(currentShop.long),
        latitudeDelta: currentZoom,
        longitudeDelta: currentZoom,
      },
      1000
    );
  };

  const zoomIn = () => {
    // Decrease delta values to zoom in (minimum zoom level of 0.005)
    const newZoom = Math.max(currentZoom / 2, 0.005);
    setCurrentZoom(newZoom);

    // Apply new zoom to current view
    if (mapRef.current && currentShop) {
      mapRef.current.animateToRegion(
        {
          latitude: Number(currentShop.lat),
          longitude: Number(currentShop.long),
          latitudeDelta: newZoom,
          longitudeDelta: newZoom,
        },
        500
      );
    }
  };

  const zoomOut = () => {
    const newZoom = Math.min(currentZoom * 2, 1.0);
    setCurrentZoom(newZoom);

    if (mapRef.current && currentShop) {
      mapRef.current.animateToRegion(
        {
          latitude: Number(currentShop.lat),
          longitude: Number(currentShop.long),
          latitudeDelta: newZoom,
          longitudeDelta: newZoom,
        },
        500
      );
    }
  };

  const zoomToLocations = () => {
    if (!mapRef.current) return;

    // If we have both current location and shop, zoom to fit both
    if (currentLocation && currentShop) {
      mapRef.current.animateToRegion(
        {
          latitude: (Number(currentLocation.lat) + Number(currentShop.lat)) / 2,
          longitude: (Number(currentLocation.long) + Number(currentShop.long)) / 2,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        },
        1000
      );

      // After a short delay, focus specifically on the shop
      setTimeout(() => {
        focusOnCurrentShop();
      }, 1500);
    }
    // If we only have the shop location, focus on it
    else if (currentShop) {
      focusOnCurrentShop();
    }
  };

  // Focus when the current shop changes
  useEffect(() => {
    if (currentShop) {
      focusOnCurrentShop();
    }
  }, [currentShop]);

  useImperativeHandle(ref, () => ({
    animateToRegion: (region: Region, duration: number) => {
      mapRef.current?.animateToRegion(region, duration);
    },
    zoomToLocations,
    focusOnCurrentShop,
    zoomIn,
    zoomOut,
  }));

  const INITIAL_REGION: Region = {
    latitude: Number(currentShop?.lat) || 0,
    longitude: Number(currentShop?.long) || 0,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  if (!currentShop) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        followsUserLocation={false}
        {...props}>
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#44eeb1"
            strokeWidth={3}
            lineDashPattern={[1]}
          />
        )}

        {/* Always show all task locations with markers */}
        {props.tasksLocations &&
          props.tasksLocations.map((task) => (
            <Marker
              key={task.id}
              coordinate={{
                latitude: Number(task.location.lat),
                longitude: Number(task.location.long),
              }}
              title={task.title}
              description={task.location.name}
              pinColor="green"
            />
          ))}

        {/* Marker for current location */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: Number(currentLocation.lat),
              longitude: Number(currentLocation.long),
            }}
            title="Your Location"
            pinColor="blue"
          />
        )}

        {/* Always highlight the current shop with a special marker */}
        {currentShop && (
          <Marker
            coordinate={{
              latitude: Number(currentShop.lat),
              longitude: Number(currentShop.long),
            }}
            title={currentShop.name}
            description="Shop Location"
            pinColor="red"
          />
        )}
      </MapView>

      {/* Custom Zoom Controls */}
      <View style={styles.zoomControlsContainer}>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
          <Text style={styles.zoomButtonText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const GoogleMapView = observer(GoogleMapViewBase) as React.ForwardRefExoticComponent<
  GoogleMapViewProps & React.RefAttributes<MapRef>
>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  zoomControlsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 200, // Position above other controls
    backgroundColor: 'transparent',
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  zoomButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

GoogleMapView.displayName = 'GoogleMapView';

export default GoogleMapView;
