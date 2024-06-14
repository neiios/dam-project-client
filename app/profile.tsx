import Button from "@/components/button";
import { checkAuth } from "@/core/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Profile() {
  async function handleLogout() {
    await AsyncStorage.removeItem("jwtToken");
    router.dismissAll();
    router.replace("/");
  }

  useEffect(() => {
    (async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        router.replace("/auth");
      }
    })();
  }, []);

  return (
    <View className="bg-white flex-1 items-center justify-center">
      <View className="max-w-[200px]">
        <Button title="Log out" onPress={handleLogout} />
      </View>
    </View>
  );
}
