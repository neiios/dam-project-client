import { View, Text, ScrollView, RefreshControl } from "react-native";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Request } from "@/types";
import Loader from "@/components/loader";
import Title from "@/components/title";
import Header from "@/components/header";
import { router } from "expo-router";
import Button from "@/components/button";
import QuestionBox from "@/components/QuestionBox";

export default function Questions() {
  const route = useRoute();
  const { articleId } = route.params as {
    articleId: string;
  };

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/articles/${articleId}/questions`
      );

      if (!response.ok) {
        console.error("Failed to fetch questions");
      }

      const data: Request[] = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
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
          <View className="border-b-2 p-5 border-slate-50 flex gap-y-5">
            <Text className="text-base dark:text-gray-300">
              Have any questions about this conference? Don't hesitate and reach
              out!
            </Text>
            <View>
              <Button
                title="Request information"
                onPress={() =>
                  router.push({
                    pathname: "questionForm",
                    params: { articleId: articleId },
                  })
                }
              />
            </View>
          </View>
          <View className="p-5">
            <QuestionBox
              questions={questions}
              title="Questions"
              parentId={articleId}
              path="articleRequest"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
