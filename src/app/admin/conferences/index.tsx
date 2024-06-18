import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Alert } from "react-native";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function Page() {
  const { isAuthenticated, userRole } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      router.replace("/auth");
    }
  }, [isAuthenticated, userRole]);

  const [conference, setConference] = useState({
    name: "",
    latitude: "",
    longitude: "",
    startDate: new Date(),
    endDate: new Date(),
    imageUrl: "",
    description: "",
  });

  function showStartDatePicker(mode: any) {
    function updateStartDate(
      event: DateTimePickerEvent,
      selectedDate: Date | undefined
    ) {
      if (!selectedDate) {
        return;
      }
      setConference({ ...conference, startDate: selectedDate });
    }

    DateTimePickerAndroid.open({
      value: conference.startDate,
      onChange: updateStartDate,
      mode: mode,
      is24Hour: true,
    });
  }

  function showEndDatePicker(mode: any) {
    function updateEndDate(
      event: DateTimePickerEvent,
      selectedDate: Date | undefined
    ) {
      if (!selectedDate) {
        return;
      }
      setConference({ ...conference, endDate: selectedDate });
    }

    DateTimePickerAndroid.open({
      value: conference.endDate,
      onChange: updateEndDate,
      mode: mode,
      is24Hour: true,
    });
  }

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
          body: JSON.stringify(conference),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Conference created successfully!");
        router.replace("/");
      } else {
        Alert.alert("Error", "Conference creation failed.");
      }
    } catch (error: any) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  return (
    <ScrollView className="bg-white h-full pt-20 gap-y-4 px-6">
      <View className="flex items-center">
        <Text className="text-4xl font-bold mb-12">Add Conference</Text>

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg mb-3"
          placeholder="Conference Name"
          value={conference.name}
          onChangeText={(text) => setConference({ ...conference, name: text })}
        />
        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg mb-3"
          placeholder="Latitude"
          value={conference.latitude}
          onChangeText={(text) =>
            setConference({ ...conference, latitude: text })
          }
          keyboardType="numeric"
        />
        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg mb-3"
          placeholder="Longitude"
          value={conference.longitude}
          onChangeText={(text) =>
            setConference({ ...conference, longitude: text })
          }
          keyboardType="numeric"
        />

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-lg mb-3"
          placeholder="Image URL"
          value={conference.imageUrl}
          onChangeText={(text) =>
            setConference({ ...conference, imageUrl: text })
          }
        />

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-md mb-3 h-24"
          placeholder="Description"
          value={conference.description}
          onChangeText={(text) =>
            setConference({ ...conference, description: text })
          }
          multiline
        />

        <View className="flex-row justify-between mb-4">
          <View>
            <Button
              title="Pick Start Date"
              onPress={() => showStartDatePicker("date")}
            />
            <Text className="text-center">
              {conference.startDate.toLocaleDateString()}
            </Text>
          </View>

          <View>
            <Button
              title="Pick Start Time"
              onPress={() => {
                showStartDatePicker("time");
              }}
            />
            <Text className="text-center">
              {conference.startDate.toLocaleTimeString()}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between mb-4">
          <View>
            <Button
              title="Pick End Date"
              onPress={() => showEndDatePicker("date")}
            />
            <Text className="text-center mt-2">
              {conference.endDate.toLocaleDateString()}
            </Text>
          </View>

          <View>
            <Button
              onPress={() => {
                showEndDatePicker("time");
              }}
              title="Pick End Time"
            />
            <Text className="text-center">
              {conference.endDate.toLocaleTimeString()}
            </Text>
          </View>
        </View>

        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}
