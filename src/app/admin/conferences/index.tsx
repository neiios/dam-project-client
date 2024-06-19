import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Alert } from "react-native";
import MapView, { Marker, MapEvent } from "react-native-maps";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Header from "@/components/header";
import Title from "@/components/title";

export default function Page() {
  const { isAuthenticated, userRole } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      router.replace("/auth");
    }
  }, [isAuthenticated, userRole]);

  const [conference, setConference] = useState({
    name: "",
    latitude: 37.78825, // Default latitude
    longitude: -122.4324, // Default longitude
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

  const handleMapPress = (event: MapEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setConference({
      ...conference,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
  };

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
    <ScrollView className="bg-white">
      <View>
        <Header>
          <Title>Add Conference</Title>
        </Header>
        <View className="p-5 flex gap-y-5">
          <TextInput
            className="w-full border border-gray-300 p-2 rounded-lg"
            placeholder="Conference Name"
            value={conference.name}
            onChangeText={(text) =>
              setConference({ ...conference, name: text })
            }
          />
          <View className="overflow-hidden rounded-md h-72">
            <MapView
              className="w-full h-full"
              initialRegion={{
                latitude: Number(conference.latitude),
                longitude: Number(conference.longitude),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={handleMapPress}
            >
              <Marker
                coordinate={{
                  latitude: Number(conference.latitude),
                  longitude: Number(conference.longitude),
                }}
              />
            </MapView>
          </View>

          <TextInput
            className="w-full border border-gray-300 p-2 rounded-lg"
            placeholder="Latitude"
            value={conference.latitude.toString()}
            onChangeText={(text) =>
              setConference({ ...conference, latitude: text })
            }
            keyboardType="numeric"
          />
          <TextInput
            className="w-full border border-gray-300 p-2 rounded-lg"
            placeholder="Longitude"
            value={conference.longitude.toString()}
            onChangeText={(text) =>
              setConference({ ...conference, longitude: text })
            }
            keyboardType="numeric"
          />

          <TextInput
            className="w-full border border-gray-300 p-2 rounded-lg"
            placeholder="Image URL"
            value={conference.imageUrl}
            onChangeText={(text) =>
              setConference({ ...conference, imageUrl: text })
            }
          />

          <TextInput
            className="w-full border border-gray-300 p-2 rounded-md h-24"
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
      </View>
    </ScrollView>
  );
}
