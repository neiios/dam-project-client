import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Coordinates } from "@/types";

export default function Map({ latitude, longitude }: Coordinates) {
  return (
    <View className="overflow-hidden rounded-md">
      <MapView
        className="w-full h-full"
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
        />
      </MapView>
    </View>
  );
}
