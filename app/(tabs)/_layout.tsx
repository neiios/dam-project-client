import { Tabs } from "expo-router";
import {
  FontAwesome,
  Entypo,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Entypo name="home" size={24} />,
        }}
      />
      <Tabs.Screen
        name="conferencesMap"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="map-signs" size={24} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          tabBarIcon: ({ color }) => <Entypo name="new-message" size={24} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle" size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
