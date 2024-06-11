import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { useRoute } from "@react-navigation/native";

export default function ConferenceTabLayout() {
  const route = useRoute();
  const { id } = route.params;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#0369a1",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="home" size={24} />
          ),
          title: "Conferences",
        }}
        initialParams={{ id }}
      />
      <Tabs.Screen
        name="articles"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="copy1" size={24} />
          ),
          title: "Articles",
        }}
        initialParams={{ id }}
      />
      <Tabs.Screen
        name="tracks"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="switcher" size={24} />
          ),
          title: "Tracks",
        }}
        initialParams={{ id }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="find" size={24} />
          ),
          title: "Map",
        }}
        initialParams={{ id }}
      />
    </Tabs>
  );
}
