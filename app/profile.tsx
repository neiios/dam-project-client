import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { View, Text } from "react-native";

export default function Profile() {
  async function handleLogout() {
    await AsyncStorage.removeItem("jwtToken");
    router.dismissAll();
    router.replace("/");
  }

  return (
    <View className="bg-white flex-1 items-center justify-center">
      <View className="max-w-[200px]">
        <Button title="Log out" onPress={handleLogout} />
      </View>
    </View>
  );
}
