import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React from "react";

export default function Map() {
  const [coordinates, setCoordinates] = React.useState({
    lat: 37.78825,
    long: -122.4324,
  });

  return (
    <View className="w-full h-full bg-red-300">
      <MapView
        className="w-full h-full"
        initialRegion={{
          latitude: coordinates.lat,
          longitude: coordinates.long,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: coordinates.lat,
            longitude: coordinates.long,
          }}
        />
      </MapView>
    </View>
  );
}
