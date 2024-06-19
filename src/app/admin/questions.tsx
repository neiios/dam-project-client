import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { FatQuestion } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/button";
import Header from "@/components/header";
import Title from "@/components/title";
import { AntDesign } from "@expo/vector-icons";
import Loader from "@/components/loader";

export default function Page() {
  const { isAuthenticated, userRole } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      router.replace("/auth");
    }
  }, [isAuthenticated, userRole]);

  const [questions, setQuestions] = useState<FatQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
        setLoading(false);
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

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView className="bg-white">
      <Header>
        <Title>Questions</Title>
      </Header>

      <View className="p-5">
        <Text className="text-lg font-bold mb-5">Pending Questions</Text>

        {pendingQuestions.length === 0 ? (
          <Text className="text-base w-full mb-5">No pending questions</Text>
        ) : null}

        <View className="flex gap-y-5">
          {pendingQuestions.map((question) => (
            <View
              key={question.id}
              className="rounded-lg shadow-md flex items-center w-full border-red-200 border-2 bg-neutral-50"
            >
              <View className="border-b border-neutral-100 w-full flex ">
                <Text className="text-xl font-bold border-b w-full border-neutral-100 p-5">
                  {question.question}
                </Text>
                <View className="p-5 w-full flex gap-y-3">
                  <Text className="leading-6">
                    Submittted by user{" "}
                    <Text className="font-bold">{question.user.name}</Text>{" "}
                    under article{" "}
                    <Link
                      href={{
                        pathname: "article",
                        params: {
                          articleId: question.articleId,
                          confId: question.article.conferenceId,
                        },
                      }}
                      className="font-bold text-blue-600"
                    >
                      {question.article.title}
                    </Link>
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-x-4 p-4 bg w-full items-center justify-end">
                <View>
                  <TouchableOpacity
                    onPress={() => handleRemove(question.id)}
                    activeOpacity={0.8}
                  >
                    <View className="flex flex-row items-center gap-x-1">
                      <AntDesign name="delete" size={20} />
                      <Text className=" text-base text-center font-bold">
                        Remove
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View>
                  <TouchableOpacity
                    onPress={() =>
                      router.push(
                        `/admin/articles/${question.articleId}/questions/${question.id}`
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <View className="flex flex-row items-center gap-x-1">
                      <AntDesign name="form" size={20} />
                      <Text className=" text-base text-center font-bold">
                        Answer
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Text className="text-lg font-bold my-5">Answered Questions</Text>

        {answeredQuestions.length === 0 ? (
          <Text className="text-base w-full mb-5">No answered questions</Text>
        ) : null}

        <View className="flex gap-y-5">
          {answeredQuestions.map((question) => (
            <View
              key={question.id}
              className="rounded-lg shadow-md flex items-center w-full border-green-200 border-2 bg-neutral-50"
            >
              <View className="border-b border-neutral-100 w-full flex ">
                <Text className="text-xl font-bold border-b w-full border-neutral-100 p-5">
                  {question.question}
                </Text>
                <View className="p-5 w-full flex gap-y-3">
                  <Text className="leading-6">
                    Submittted by user{" "}
                    <Text className="font-bold">{question.user.name}</Text>{" "}
                    under article{" "}
                    <Link
                      href={{
                        pathname: "article",
                        params: {
                          articleId: question.articleId,
                          confId: question.article.conferenceId,
                        },
                      }}
                      className="font-bold text-blue-600"
                    >
                      {question.article.title}
                    </Link>
                  </Text>
                  <View className="border-neutral-100 border-2 bg-neutral-50 p-2 rounded-md">
                    <Text className="text-sm font-bold mb-1">Answer</Text>
                    <Text className="leading-5">{question.answer}</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-x-4 p-4 bg w-full items-center justify-end">
                <View>
                  <TouchableOpacity
                    onPress={() => handleRemove(question.id)}
                    activeOpacity={0.8}
                  >
                    <View className="flex flex-row items-center gap-x-1">
                      <AntDesign name="delete" size={20} />
                      <Text className=" text-base text-center font-bold">
                        Remove
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
