import React, { useCallback, useEffect, useState } from "react";
import { Text, ScrollView, View, RefreshControl } from "react-native";
import { Redirect, useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import { useRoute } from "@react-navigation/native";
import Loader from "@/components/loader";
import Header from "@/components/header";
import Title from "@/components/title";
import Button from "@/components/button";
import QuestionBox from "@/components/QuestionBox";
import { Request } from "@/types";

export interface ArticleQuestion {
  id: number;
  question: string;
  answer: string;
  status: "pending" | "answered";
  articleId: number;
}

export default function Reports() {
  const route = useRoute();
  const { confId } = route.params as {
    confId: string;
  };

  const [questions, setQuestions] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    fetchQuestions();
  }, [isAuthenticated]);

  const fetchQuestions = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${confId}/requests`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data: Request[] = await response.json();
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
      if (isAuthenticated) {
        fetchQuestions();
      }
    }, [isAuthenticated])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchQuestions();
  }, []);

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  if (loading) {
    return <Loader />;
  }

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
                    pathname: "requestForm",
                    params: { confId: confId },
                  })
                }
              />
            </View>
          </View>
          <View className="p-5">
            <QuestionBox
              questions={answeredQuestions}
              title="Answered"
              parentId={confId}
              path="conferenceRequest"
            />
            <QuestionBox
              questions={pendingQuestions}
              title="Pending"
              parentId={confId}
              path="conferenceRequest"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
