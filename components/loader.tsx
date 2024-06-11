import { ActivityIndicator, View } from "react-native";

export default function Loader() {
  return (
    <View className="bg-white flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#075985" />
    </View>
  );
}
