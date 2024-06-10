import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import React from "react";

export default function ConferenceTabLayout() {
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
      />
      <Tabs.Screen
        name="articles"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="copy1" size={24} />
          ),
          title: "Articles",
        }}
      />
      <Tabs.Screen
        name="tracks"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="switcher" size={24} />
          ),
          title: "Tracks",
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="find" size={24} />
          ),
          title: "Map",
        }}
      />
    </Tabs>
  );
}
