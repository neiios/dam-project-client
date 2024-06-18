import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";

import Button from "@/components/button";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Page() {
  const { isAuthenticated, userRole } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      router.replace("/auth");
    }
  }, [isAuthenticated, userRole]);

  const params = useLocalSearchParams();
  const conferenceId = params.conferenceId;
  const articleId = params.articleId;

  const [article, setArticle] = useState({
    title: "",
    authors: "",
    abstract: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    async function fetchArticleData() {
      if (!articleId) return;

      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(
          `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${conferenceId}/articles/${articleId}`,
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
          setArticle({
            title: data.title,
            authors: data.authors,
            abstract: data.abstract,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
          });
        } else {
          Alert.alert("Error", "Failed to fetch article data.");
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert("Error", error.message);
        } else {
          Alert.alert("Error", "An unknown error occurred.");
        }
      }
    }

    fetchArticleData();
  }, [articleId, conferenceId]);

  async function handleSubmit() {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${conferenceId}/articles/${articleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(article),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Article updated successfully!");
        router.push({
          pathname: "/(tabs)",
          params: { confId: conferenceId },
        });
      } else {
        Alert.alert("Error", "Article update failed.");
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
        <Text className="font-bold text-2xl mb-4">Edit Article</Text>

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
