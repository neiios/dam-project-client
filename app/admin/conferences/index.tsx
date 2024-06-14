import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Alert } from "react-native";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function AddConferencePage() {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
    description: "",
  });

  const handleSubmit = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences`,
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
        Alert.alert("Success", "Conference created successfully!");
        router.replace("/");
      } else {
        Alert.alert("Error", "Conference creation failed.");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <ScrollView className="bg-white h-full pt-20 gap-y-4 px-6">
      <View className="flex items-center">
        <Text className="text-4xl font-bold mb-12">Add Conference</Text>

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg mb-3"
          placeholder="Conference Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg mb-3"
          placeholder="Latitude"
          value={formData.latitude}
          onChangeText={(text) => setFormData({ ...formData, latitude: text })}
          keyboardType="numeric"
        />
        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg mb-3"
          placeholder="Longitude"
          value={formData.longitude}
          onChangeText={(text) => setFormData({ ...formData, longitude: text })}
          keyboardType="numeric"
        />

        {/* Replace with an actual date picker */}
        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg mb-3"
          placeholder="Start Date (YYYY-MM-DD)"
          value={formData.startDate}
          onChangeText={(text) => setFormData({ ...formData, startDate: text })}
        />
        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg mb-3"
          placeholder="End Date (YYYY-MM-DD)"
          value={formData.endDate}
          onChangeText={(text) => setFormData({ ...formData, endDate: text })}
        />

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg mb-3"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
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
