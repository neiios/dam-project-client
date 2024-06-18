import Button from "@/components/button";
import Header from "@/components/header";
import Title from "@/components/title";
import React, { useCallback, useEffect, useState } from "react";
import { Text, ScrollView, View, RefreshControl } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/loader";

export interface ArticleQuestion {
  id: number;
  question: string;
  answer: string;
  status: "pending" | "answered";
  articleId: number;
}

export default function Reports() {
  const [questions, setQuestions] = useState<ArticleQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/questions/conferences/1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data: ArticleQuestion[] = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Ensure refreshing state is reset
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchQuestions();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView
      className="bg-white dark:bg-neutral-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <Header>
          <Title>Contact us</Title>
        </Header>

        <View>
          <View className=" border-b-2 border-slate-50 p-5 flex gap-y-5 ">
            <Text className="text-base dark:text-gray-300 mb-5">
              Have any questions about this conference? Don't hesitate and reach
              out!
            </Text>
            <View>
              <Button
                title="Ask a question"
                onPress={() => router.push("../contact")}
              />
            </View>
          </View>
          <View className="flex w-full p-5 ">
            <Text className="text-lg font-bold mb-2">History</Text>
            {questions.length > 0 ? (
              questions.map((question) => (
                <View
                  key={question.id}
                  className="mb-3 p-4 bg-sky-50 rounded-md"
                >
                  <Text className="text-lg dark:text-gray-200 font-semibold">
                    {question.question}
                  </Text>
                  {question.status === "pending" ? (
                    <Text className="dark:text-gray-400 text-center bg-white rounded-md border-sky-200 font-bold text-lg border-2 p-2 mt-2">
                      We'll get to you soon!
                    </Text>
                  ) : (
                    <Text className="dark:text-gray-400 text-center bg-white rounded-md border-green-200 font-bold text-lg border-2 p-2 mt-2">
                      Click to see the answer
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <Text className="text-base dark:text-gray-300">
                No questions available
              </Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
