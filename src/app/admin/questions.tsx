import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { FatQuestion } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/button";

export default function Page() {
  const { isAuthenticated, userRole } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      router.replace("/auth");
    }
  }, [isAuthenticated, userRole]);

  const [questions, setQuestions] = useState<FatQuestion[]>([]);
  const pendingQuestions = questions.filter((r) => r.status === "pending");
  const answeredQuestions = questions.filter((r) => r.status === "answered");

  useEffect(() => {
    async function fetchQuestions() {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/questions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await AsyncStorage.getItem("jwtToken")),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    }

    fetchQuestions();
  }, []);

  async function handleRemove(questionId: number) {
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    const response = await fetch(
      `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/questions/${questionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (response.ok) {
      const updatedQuestions = questions.filter((r) => r.id !== questionId);
      setQuestions(updatedQuestions);
    }
  }

  return (
    <ScrollView className="bg-white min-h-full px-10">
      <View className="flex-col items-center">
        <Text className="text-4xl font-bold mb-8 mt-10 text-center">
          Questions
        </Text>

        <Text className="text-2xl font-bold mb-4">Pending Questions</Text>

        {pendingQuestions.length === 0 ? (
          <Text className="text-lg text-center w-full">
            No pending questions
          </Text>
        ) : null}

        <View className="flex items-center w-full">
          {pendingQuestions.map((question) => (
            <View
              key={question.id}
              className="border border-neutral-300 p-4 rounded-lg shadow-md flex items-center w-full mb-4"
            >
              <View className="border-b border-neutral-300 w-full flex items-center gap-y-4">
                <Text className="text-xl text-center font-bold border-b w-full p-2 border-neutral-300">
                  {question.question}
                </Text>

                <Text>User: {question.user.name} </Text>

                <Text>Article: {question.article.title}</Text>

                <Text className="mb-4 text-center ">
                  Status: Waiting for an answer
                </Text>
              </View>

              <View className="flex-row gap-x-4 p-4">
                <View>
                  <Button
                    title="Remove"
                    bgColor="bg-red-500"
                    onPress={() => handleRemove(question.id)}
                  />
                </View>

                <View>
                  <Button
                    title="Answer"
                    onPress={() =>
                      router.push(
                        `/admin/articles/${question.articleId}/questions/${question.id}`
                      )
                    }
                  />
                </View>
              </View>
            </View>
          ))}

          <Text className="text-2xl font-bold mb-4">Answered Questions</Text>

          {answeredQuestions.length === 0 ? (
            <Text className="text-lg text-center w-full">
              No answered questions
            </Text>
          ) : null}

          {answeredQuestions.map((question) => (
            <View
              key={question.id}
              className="border border-neutral-300 p-4 rounded-lg shadow-md flex items-center w-full mb-4"
            >
              <View className="border-b border-neutral-300 w-full flex items-center gap-y-4">
                <Text className="text-xl text-center font-bold border-b w-full p-2 border-neutral-300">
                  {question.question}
                </Text>

                <Text>User: {question.user.name} </Text>

                <Text>Article: {question.article.title}</Text>

                <Text className="mb-4 text-center ">
                  Answer: {question.answer}
                </Text>
              </View>

              <View className="flex-row gap-x-4 p-4">
                <View>
                  <Button
                    title="Remove"
                    bgColor="bg-red-500"
                    onPress={() => handleRemove(question.id)}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
