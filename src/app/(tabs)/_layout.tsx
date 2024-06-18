import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "@/app/context/ThemeContext";
import Theme from "@/core/theme";

export default function ConferenceTabLayout() {
  const route = useRoute();
  const { confId } = route.params as { confId: string };
  const { colorScheme } = useTheme();

  const tabBarStyle = {
    backgroundColor:
      colorScheme === "light" ? Theme["light-bg"] : Theme["dark-bg"],
    borderTopColor: colorScheme === "light" ? "#e0e0e0" : "#303030",
  };

  const tabBarActiveTintColor = colorScheme === "light" ? "#0369a1" : "#ffffff";
  const tabBarInactiveTintColor =
    colorScheme === "light" ? "#8e8e8e" : "#b0b0b0";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tabBarActiveTintColor,
        tabBarInactiveTintColor: tabBarInactiveTintColor,
        tabBarStyle: tabBarStyle,
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
        initialParams={{ confId }}
      />
      <Tabs.Screen
        name="articles"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="copy1" size={24} />
          ),
          title: "Articles",
        }}
        initialParams={{ confId }}
      />
      <Tabs.Screen
        name="tracks"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="switcher" size={24} />
          ),
          title: "Tracks",
        }}
        initialParams={{ confId }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="message1" size={24} />
          ),
          title: "Requests",
        }}
        initialParams={{ confId }}
      />
    </Tabs>
  );
}
