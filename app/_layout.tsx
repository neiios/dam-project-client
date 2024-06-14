import React from "react";
import { View } from "react-native";
import { Link, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import useAuth
import Theme from "../core/theme";

function RootLayout() {
  const { colorScheme } = useTheme();
  const { isAuthenticated } = useAuth(); // Use authentication state

  const headerStyle = {
    backgroundColor:
      colorScheme === "light" ? Theme["light-bg"] : Theme["dark-bg"],
    color: colorScheme === "light" ? Theme["light-text"] : Theme["dark-text"],
  };

  const containerStyle = {
    flex: 1,
    backgroundColor:
      colorScheme === "light" ? Theme["light-bg"] : Theme["dark-bg"],
  };

  return (
    <View style={containerStyle}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            title: "Conferences",
            headerStyle: { backgroundColor: headerStyle.backgroundColor },
            headerTintColor: headerStyle.color,
            headerRight: () =>
              isAuthenticated && ( // Conditionally render the profile icon
                <Link href="/profile">
                  <AntDesign name="user" size={24} color={headerStyle.color} />
                </Link>
              ),
          }}
        />
        <Stack.Screen
          name="article"
          options={{
            headerShown: true,
            title: "Article",
            headerStyle: { backgroundColor: headerStyle.backgroundColor },
            headerTintColor: headerStyle.color,
          }}
        />
        <Stack.Screen
          name="track"
          options={{
            headerShown: true,
            title: "Track",
            headerStyle: { backgroundColor: headerStyle.backgroundColor },
            headerTintColor: headerStyle.color,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            title: "Conference",
            headerStyle: { backgroundColor: headerStyle.backgroundColor },
            headerTintColor: headerStyle.color,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: true,
            title: "Profile",
            headerStyle: { backgroundColor: headerStyle.backgroundColor },
            headerTintColor: headerStyle.color,
          }}
        />
        <Stack.Screen
          name="contact"
          options={{
            headerShown: true,
            title: "Contact",
            headerStyle: { backgroundColor: headerStyle.backgroundColor },
            headerTintColor: headerStyle.color,
          }}
        />
      </Stack>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}
