import { View, Text, Button, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React from "react";

export default function Map() {
  const [coordinates, setCoordinates] = React.useState({
    lat: 37.78825,
    long: -122.4324,
  });

  const handleGoToMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.long}`;
    Linking.openURL(url);
  };

  return (
    <View className="w-full h-full bg-red-300 relative flex items-center">
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
      <View className="absolute top-5">
        <Text
          className="rounded-md bg-white p-3 font-bold text-sm border-2 border-transparent active:border-sky-200"
          onPress={handleGoToMaps}
        >
          Open in Google Maps
        </Text>
      </View>
    </View>
  );
}
