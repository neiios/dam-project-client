import { View, Image, Text } from "react-native";

export default function Logo() {
  return (
    <View className="flex flex-row items-center gap-x-2">
      <Image
        className="w-12 h-12"
        source={require("../assets/images/logo.png")}
      />
      <Text className="text-lg font-bold">SciGather</Text>
    </View>
  );
}
