import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Alert } from "react-native";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";

export default function Page() {
  const { isAuthenticated, userRole } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      router.replace("/auth");
    }
  }, []);

  const params = useLocalSearchParams();
  const conferenceId = params.conferenceId;
  const trackId = params.trackId;

  const [formData, setFormData] = useState({
    name: "",
    room: "",
    description: "",
  });

  useEffect(() => {
    async function fetchTrackData() {
      if (!trackId) return;

      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(
          `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${conferenceId}/tracks/${trackId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name,
            room: data.room,
            description: data.description,
          });
        } else {
          Alert.alert("Error", "Failed to fetch track data.");
        }
      } catch (error) {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }

    fetchTrackData();
  }, [trackId]);

  const handleSubmit = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${conferenceId}/tracks/${trackId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Track updated successfully!");
        // TODO: redirect to a proper page (specifc track details)
        router.push({
          pathname: "/(tabs)",
          params: { confId: conferenceId },
        });
      } else {
        Alert.alert("Error", "Track update failed.");
        console.log(await response.json());
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <ScrollView className="bg-white h-full pt-20 gap-y-4 px-6">
      <View className="flex items-center">
        <Text className="text-4xl font-bold mb-12">Edit Track</Text>

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg mb-3"
          placeholder="Track Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg mb-3"
          placeholder="Room"
          value={formData.room}
          onChangeText={(text) => setFormData({ ...formData, room: text })}
        />

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-md mb-3 h-24"
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
