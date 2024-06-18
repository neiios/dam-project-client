import React, { useState } from "react";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import Form from "@/components/form";
import { useRoute } from "@react-navigation/native";

const MAX_MESSAGE_LENGTH = 250;

export default function QuestionForm() {
  const route = useRoute();
  const { articleId } = route.params as {
    articleId: string;
  };

  const [message, setMessage] = useState<string>("");
  const { isAuthenticated } = useAuth();

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      ToastAndroid.show(
        "You need to be logged in to send a message",
        ToastAndroid.SHORT
      );
      return;
    }

    if (message.trim() === "") {
      ToastAndroid.show("Message cannot be empty", ToastAndroid.SHORT);
      return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      ToastAndroid.show("Your message is too long", ToastAndroid.SHORT);
      return;
    }

    const token = await AsyncStorage.getItem("jwtToken");
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/articles/${articleId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question: "message" }),
        }
      );
      console.log(response);
      if (response.ok) {
        ToastAndroid.show(
          "Your message has been sent successfully",
          ToastAndroid.SHORT
        );
        router.navigate("..");
      } else {
        ToastAndroid.show("Failed to send your message", ToastAndroid.SHORT);
      }
    } catch (error) {
      if (error instanceof Error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("An unknown error occurred.", ToastAndroid.SHORT);
      }
    }
  };

  return (
    <Form
      message={message}
      setMessage={setMessage}
      handleSubmit={handleSubmit}
      MAX_MESSAGE_LENGTH={MAX_MESSAGE_LENGTH}
    />
  );
}
