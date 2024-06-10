import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
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
        name="conferencesMap"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="find" size={24} />
          ),
          title: "Map",
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="message1" size={24} />
          ),
          title: "Contact",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="user" size={24} />
          ),
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
