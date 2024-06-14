import { ActivityIndicator, View } from "react-native";

export default function Loader() {
  return (
    <View className="bg-white dark:bg-neutral-900 flex-1 justify-center items-center">
      <ActivityIndicator size="large" className="text-red-600" />
    </View>
  );
}
