import React, { useState } from "react";
import { View, ScrollView, Text, Alert } from "react-native";
import Header from "@/components/header";
import Title from "@/components/title";
import Input from "@/components/input";
import Button from "@/components/button";
import { useAuth } from "@/app/context/AuthContext"; // Import useAuth
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Contact() {
  const [message, setMessage] = useState<string>("");
  const { isAuthenticated } = useAuth();

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert("Error", "You need to be logged in to send a message");
      return;
    }
    const token = await AsyncStorage.getItem("jwtToken");
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/questions/conferences/1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question: message }),
        }
      );

      // debugging purposes
      // const res = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Your message has been sent successfully");
        router.navigate("/");
      } else {
        Alert.alert("Error", "Failed to send your message");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  return (
    <ScrollView className="bg-white dark:bg-neutral-900">
      <View>
        <Header>
          <Title>Contact us</Title>
        </Header>

        <View className="p-5 gap-y-5 ">
          <View className="mb-5">
            <Text className="text-base dark:text-gray-300">
              Hi! We're here to help you get the most out of this conference. If
              you have any questions or thoughts, please don't hesitate to reach
              out. Your curiosity is welcome!
            </Text>
          </View>
          <Input
            lines={10}
            length={150}
            placeholder="Your questions, wishes, or criticisms"
            value={message}
            onChangeText={setMessage}
            style={{ textAlignVertical: "top" }}
            className="mb-5"
          />
          <Button title="Submit" onPress={handleSubmit} />
        </View>
      </View>
    </ScrollView>
  );
}
