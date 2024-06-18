import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import Button from "@/components/button";
import { useAuth } from "@/app/context/AuthContext";

export default function Page() {
  const { isAuthenticated, userRole } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      router.replace("/auth");
    }
  }, [isAuthenticated, userRole]);

  const params = useLocalSearchParams();
  const conferenceId = params.conferenceId;
  const trackId = params.trackId;

  const [article, setArticle] = useState({
    title: "",
    authors: "",
    abstract: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  async function handleSubmit() {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${conferenceId}/tracks/${trackId}/articles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(article),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Article created successfully!");
        // TODO: redirect to a proper page
        // If only the other monkey was actually use file based routing life would be dream
        router.replace("/");
      } else {
        Alert.alert("Error", "Article creation failed.");
        console.log(await response.json());
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  }

  function showStartDatePicker(mode: any) {
    function updateStartDate(
      event: DateTimePickerEvent,
      selectedDate: Date | undefined
    ) {
      if (!selectedDate) {
        return;
      }
      setArticle({ ...article, startDate: selectedDate });
    }

    DateTimePickerAndroid.open({
      value: article.startDate,
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
      setArticle({ ...article, endDate: selectedDate });
    }

    DateTimePickerAndroid.open({
      value: article.endDate,
      onChange: updateEndDate,
      mode: mode,
      is24Hour: true,
    });
  }

  return (
    <SafeAreaView className="h-full bg-white flex-1">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="font-bold text-2xl mb-4">Submit Article</Text>

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-md mb-3"
          placeholder="Article Title"
          value={article.title}
          onChangeText={(text) => setArticle({ ...article, title: text })}
        />

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-md mb-3"
          placeholder="Authors (comma-separated)"
          value={article.authors}
          onChangeText={(text) => setArticle({ ...article, authors: text })}
        />

        <TextInput
          className="w-full border border-gray-300 p-2 rounded-md mb-3"
          placeholder="Abstract"
          value={article.abstract}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => setArticle({ ...article, abstract: text })}
        />

        <View className="flex-row justify-between mb-4">
          <View>
            <Button
              title="Pick Start Date"
              onPress={() => showStartDatePicker("date")}
            />
            <Text className="text-center">
              {article.startDate.toLocaleDateString()}
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
              {article.startDate.toLocaleTimeString()}
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
              {article.endDate.toLocaleDateString()}
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
              {article.endDate.toLocaleTimeString()}
            </Text>
          </View>
        </View>

        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}
