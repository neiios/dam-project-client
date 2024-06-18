import Button from "@/components/button";
import Header from "@/components/header";
import Title from "@/components/title";
import React, { useCallback, useEffect, useState } from "react";
import { Text, ScrollView, View, RefreshControl } from "react-native";
import { Redirect, router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/loader";
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

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
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  if (loading) {
    return <Loader />;
  }

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

  useFocusEffect(
    useCallback(() => {
      fetchQuestions();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchQuestions();
  }, []);

  const answeredQuestions = questions.filter((q) => q.status === "answered");
  const pendingQuestions = questions.filter((q) => q.status === "pending");

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

        <View className="p-5">
          <View className="border-b-2 border-slate-50 flex gap-y-5 mb-5">
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

          {answeredQuestions.length > 0 && (
            <>
              <Text className="text-lg font-bold mb-5">Answered</Text>
              <View className="flex w-full rounded-md border-2 border-neutral-100 bg-neutral-50 mb-5">
                {answeredQuestions.map((question, index) => (
                  <View
                    key={question.id}
                    className={`p-4 w-full border-slate-100 justify-between flex flex-row items-center ${
                      index === answeredQuestions.length - 1 ? "" : "border-b-2"
                    }`}
                  >
                    <Text className="text-sm dark:text-gray-200 font-semibold">
                      {question.question}
                    </Text>
                    <AntDesign
                      className="color-black dark:color-white text-4xl"
                      name="right"
                      size={15}
                    />
                  </View>
                ))}
              </View>
            </>
          )}

          {pendingQuestions.length > 0 && (
            <>
              <Text className="text-lg font-bold mb-5">Pending</Text>
              <View className="flex w-full rounded-md border-2 border-neutral-100 bg-neutral-50">
                {pendingQuestions.map((question, index) => (
                  <View
                    key={question.id}
                    className={`p-4 w-full border-slate-100 justify-between flex flex-row items-center ${
                      index === pendingQuestions.length - 1 ? "" : "border-b-2"
                    }`}
                  >
                    <Text className="text-sm dark:text-gray-200 font-semibold">
                      {question.question}
                    </Text>
                    <AntDesign
                      className="color-black dark:color-white text-4xl"
                      name="right"
                      size={15}
                    />
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
