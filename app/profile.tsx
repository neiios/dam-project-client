import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Text, Switch } from "react-native";
import { useTheme } from "./context/ThemeContext";
import { checkAuth } from "@/core/utils";

export default function Profile() {
  const { colorScheme, toggleColorScheme } = useTheme();
  const router = useRouter();

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
    <View className="flex-1 items-center justify-center dark:bg-neutral-800">
      <View className="max-w-[200px]">
        <Button title="Log out" onPress={handleLogout} />
        <View className="mt-4 flex-row items-center">
          <Text className="mr-2 dark:text-white">Dark Mode</Text>
          <Switch
            value={colorScheme === "dark"}
            onValueChange={toggleColorScheme}
          />
        </View>
      </View>
    </View>
  );
}
