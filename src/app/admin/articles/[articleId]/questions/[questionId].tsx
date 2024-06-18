import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { Question } from "@/types";

export default function Page() {
  const { isAuthenticated, userRole } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      router.replace("/auth");
    }
  }, [isAuthenticated, userRole]);

  const params = useLocalSearchParams();
  const questionId = params.questionId;

  const [question, setQuestion] = useState<Question>();

  useEffect(() => {
    async function fetchQuestion() {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/questions/${questionId}`,
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
        setQuestion(data);
      }
    }

    fetchQuestion();
  }, [questionId]);

  const handleSubmit = async () => {
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    const response = await fetch(
      `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/questions/${questionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(question),
      }
    );

    if (response.ok) {
      router.push("/admin/questions");
    }
  };

  async function handleRemove(requestId: number | undefined) {
    if (requestId === undefined) return;

    const jwtToken = await AsyncStorage.getItem("jwtToken");
    const response = await fetch(
      `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/questions/${requestId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (response.ok) {
      router.back();
    }
  }

  return (
    <ScrollView className="bg-white h-full pt-20 gap-y-4 px-6">
      <View className="flex">
        <Text className="text-4xl font-bold mb-12 text-center">
          Answer Article Question
        </Text>

        <View className="gap-y-8">
          <Text className="text-2xl text-center">{question?.question}</Text>

          <TextInput
            className="w-full border border-gray-300 p-2 rounded-md mb-3 h-24"
            placeholder="Description"
            onChangeText={(text) =>
              question ? setQuestion({ ...question, answer: text }) : null
            }
            multiline
          />

          <Button title="Submit" onPress={handleSubmit} />

          <View className="mt-4">
            <Button
              title="Remove"
              bgColor="bg-red-500"
              onPress={() => handleRemove(question?.id)}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
