import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { Question } from "@/types";
import Form from "@/components/form";

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

  return (
    <ScrollView className="bg-white">
      <Form
        message={question?.answer || ""}
        setMessage={(text: string) =>
          setQuestion((prev) => (prev ? { ...prev, answer: text } : prev))
        }
        handleSubmit={handleSubmit}
        MAX_MESSAGE_LENGTH={200}
        statement={question?.question || ""}
        placeholder="Your response"
        header="Answer user question"
      />
    </ScrollView>
  );
}
