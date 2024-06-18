import React from "react";
import { View } from "react-native";
import { Link, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { ThemeProvider, useTheme } from "@/app/context/ThemeContext";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import Theme from "@/core/theme";

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
          name="requestForm"
          options={{
            headerShown: true,
            title: "Request information",
            headerStyle: { backgroundColor: headerStyle.backgroundColor },
            headerTintColor: headerStyle.color,
          }}
        />
        <Stack.Screen
          name="auth"
          options={{
            headerShown: true,
            title: "Welcome",
            headerStyle: { backgroundColor: headerStyle.backgroundColor },
            headerTintColor: headerStyle.color,
          }}
        />
        <Stack.Screen
          name="questions"
          options={{
            headerShown: true,
            title: "Questions",
            headerStyle: { backgroundColor: headerStyle.backgroundColor },
            headerTintColor: headerStyle.color,
          }}
        />
        <Stack.Screen
          name="questionForm"
          options={{
            headerShown: true,
            title: "Ask a question",
            headerStyle: { backgroundColor: headerStyle.backgroundColor },
            headerTintColor: headerStyle.color,
          }}
        />
        <Stack.Screen
          name="conferenceRequest"
          options={{
            headerShown: true,
            title: "Request",
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
