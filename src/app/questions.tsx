import { View, Text, ScrollView, RefreshControl } from "react-native";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Request } from "@/types";
import Loader from "@/components/loader";
import Title from "@/components/title";
import Header from "@/components/header";
import { router, useFocusEffect } from "expo-router";
import Button from "@/components/button";
import QuestionBox from "@/components/QuestionBox";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Questions() {
  const route = useRoute();
  const { articleId } = route.params as {
    articleId: string;
  };

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [allQuestions, setAllQuestions] = useState<Request[]>([]);
  const [pendingQuestions, setPendingQuestions] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);
    return token;
  };

  const fetchAllQuestions = async () => {
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/articles/${articleId}/questions`
      );

      if (!response.ok) {
        console.error("Failed to fetch questions");
      }

      const data: Request[] = await response.json();
      setAllQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchPendingQuestions = async (token: string) => {
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/articles/${articleId}/questions/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch questions");
      }

      const data: Request[] = await response.json();
      setPendingQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkLoginStatus().then((token) => {
        fetchAllQuestions();
        if (token) {
          fetchPendingQuestions(token);
        }
      });
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    checkLoginStatus().then((token) => {
      fetchAllQuestions();
      if (token) {
        fetchPendingQuestions(token);
      }
    });
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
            {isLoggedIn && (
              <QuestionBox
                questions={pendingQuestions}
                title="Pending"
                parentId={articleId}
                path="articleRequest"
              />
            )}
            <QuestionBox
              questions={allQuestions}
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
