import { View, Text, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { Coordinates } from "@/types";
import { useFetchData } from "@/core/hooks";

export default function Map() {
  const route = useRoute();
  const { confId } = route.params as { confId: string };
  console.log(route.params);
  const {
    data: coordinates,
    loading,
    error,
  } = useFetchData<Coordinates>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}:8080/api/v1/conferences/${confId}/location`
  );

  const handleGoToMaps = () => {
    if (coordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`;
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View className="w-full h-full flex justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="w-full h-full flex justify-center items-center">
        <Text className="text-lg text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <View className="w-full h-full relative flex items-center">
      {coordinates && (
        <>
          <MapView
            className="w-full h-full"
            initialRegion={{
              latitude: Number(coordinates.latitude),
              longitude: Number(coordinates.longitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: Number(coordinates.latitude),
                longitude: Number(coordinates.longitude),
              }}
            />
          </MapView>
          <View className="absolute top-5">
            <Text
              className="rounded-md shadow-xl shadow-black bg-white p-3 font-bold text-sm border-2 border-transparent active:border-sky-200"
              onPress={handleGoToMaps}
            >
              Open in Google Maps
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
