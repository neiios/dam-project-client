import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Alert } from "react-native";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import Header from "@/components/header";
import Title from "@/components/title";

export default function Page() {
  const { isAuthenticated, userRole } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      router.replace("/auth");
    }
  }, [isAuthenticated, userRole]);

  const params = useLocalSearchParams();
  const conferenceId = params.conferenceId;

  const [formData, setFormData] = useState({
    name: "",
    room: "",
    description: "",
  });

  const handleSubmit = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${conferenceId}/tracks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Track created successfully!");
        // TODO: redirect to a proper page
        // If only the other monkey was actually use file based routing life would be dream
        router.replace("/");
      } else {
        Alert.alert("Error", "Track creation failed.");
        console.log(await response.json());
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  return (
    <ScrollView className="bg-white ">
      <Header>
        <Title>Add track</Title>
      </Header>
      <View className="p-5 flex gap-y-5">
        <TextInput
          className="w-full border border-gray-300 p-2 rounded-l"
          placeholder="Track Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg"
          placeholder="Room"
          value={formData.room}
          onChangeText={(text) => setFormData({ ...formData, room: text })}
        />

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-md h-24 mb-5"
          placeholder="Description"
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          multiline
        />

        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}
