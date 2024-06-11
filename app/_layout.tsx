import { AntDesign } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function RootLayout() {
  const handleShare = () => {
    // Add your share logic here
    console.log("Share button pressed");
  };

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="article"
        options={{
          headerShown: true,
          title: "Article",
        }}
      />
      <Stack.Screen
        name="conference"
        options={{
          headerShown: true,
          title: "Conference",
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={{ padding: 5 }}>
              <AntDesign name="sharealt" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
