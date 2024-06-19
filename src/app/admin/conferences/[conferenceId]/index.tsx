import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Alert } from "react-native";
import MapView, { Marker, MapEvent } from "react-native-maps";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
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

  const params = useLocalSearchParams();
  const conferenceId = params.conferenceId;

  const [height, setHeight] = useState(10);
  const [conference, setConference] = useState({
    name: "",
    latitude: "37.78825", // Default latitude
    longitude: "-122.4324", // Default longitude
    startDate: new Date(),
    endDate: new Date(),
    imageUrl: "",
    description: "",
  });

  const onContentSizeChange = (event: any) =>
    setHeight(Math.max(35, event.nativeEvent.contentSize.height));

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
        if (error instanceof Error) {
          Alert.alert("Error", error.message);
        } else {
          Alert.alert("Error", "An unknown error occurred.");
        }
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

  const handleMapPress = (event: MapEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setConference({
      ...conference,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
  };

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
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  }

  return (
    <ScrollView className="bg-white">
      <View>
        <Header>
          <Title>Edit Conference</Title>
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
                latitude: parseFloat(conference.latitude),
                longitude: parseFloat(conference.longitude),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={handleMapPress}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(conference.latitude),
                  longitude: parseFloat(conference.longitude),
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
            className={`w-full border border-gray-300 p-2 rounded-md  h-[${height}]]`}
            placeholder="Description"
            editable
            multiline
            numberOfLines={10}
            onContentSizeChange={onContentSizeChange}
            value={conference.description}
            onChangeText={(text) =>
              setConference({ ...conference, description: text })
            }
            style={{ textAlignVertical: "top" }}
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
      </View>
    </ScrollView>
  );
}
