import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Alert } from "react-native";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
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
  }, []);

  const params = useLocalSearchParams();
  const conferenceId = params.conferenceId;

  const [conference, setConference] = useState({
    name: "",
    latitude: "",
    longitude: "",
    startDate: new Date(),
    endDate: new Date(),
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    async function fetchConferenceData() {
      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(
          `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${conferenceId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (!response.ok) {
          Alert.alert("Error", "Failed to fetch conference data.");
        }

        const data = await response.json();
        setConference({
          name: data.name,
          latitude: data.latitude,
          longitude: data.longitude,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          imageUrl: data.imageUrl,
          description: data.description,
        });
      } catch (error) {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }

    if (conferenceId) {
      fetchConferenceData();
    }
  }, [conferenceId]);

  function showDatePicker(
    mode: "date" | "time",
    dateType: "startDate" | "endDate"
  ) {
    function updateDate(
      event: DateTimePickerEvent,
      selectedDate: Date | undefined
    ) {
      if (!selectedDate) {
        return;
      }

      setConference({ ...conference, [dateType]: selectedDate });
    }

    DateTimePickerAndroid.open({
      value: conference[dateType],
      onChange: updateDate,
      mode: mode,
      is24Hour: true,
    });
  }

  async function handleSubmit() {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${conferenceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(conference),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Conference updated successfully!");
        router.push({
          pathname: "/(tabs)",
          params: { confId: conferenceId },
        });
      } else {
        Alert.alert("Error", "Conference update failed.");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  }

  return (
    <ScrollView className="bg-white h-full pt-20 gap-y-4 px-6">
      <View className="flex items-center">
        <Text className="text-4xl font-bold mb-12">Edit Conference</Text>

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
              onPress={() => showDatePicker("date", "startDate")}
            />
            <Text className="text-center">
              {conference.startDate.toLocaleDateString()}
            </Text>
          </View>

          <View>
            <Button
              title="Pick Start Time"
              onPress={() => {
                showDatePicker("time", "startDate");
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
              onPress={() => showDatePicker("date", "endDate")}
            />
            <Text className="text-center mt-2">
              {conference.endDate.toLocaleDateString()}
            </Text>
          </View>

          <View>
            <Button
              onPress={() => showDatePicker("time", "endDate")}
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
