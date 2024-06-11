import { AntDesign } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Conferences",
          headerRight: () => (
            <Link
              href={{
                pathname: "profile",
              }}
            >
              <AntDesign name="user" size={24} />
            </Link>
          ),
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
        name="track"
        options={{
          headerShown: true,
          title: "Track",
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          title: "Conference",
        }}
      />
    </Stack>
  );
}
