import React, { useEffect } from "react";
import { View, Text, Switch } from "react-native";
import { useTheme } from "@/app/context/ThemeContext";
import Button from "@/components/button";
import { router } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const { colorScheme, toggleColorScheme } = useTheme();
  const { isAuthenticated, validateAuth } = useAuth();

  async function handleLogout() {
    await AsyncStorage.removeItem("jwtToken");
    await validateAuth();
    router.replace("/");
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated]);

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
