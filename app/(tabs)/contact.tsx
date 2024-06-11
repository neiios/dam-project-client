import React, { useState } from "react";
import { View, ScrollView, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "@/components/header";
import Title from "@/components/title";
import Input from "@/components/input";
import Button from "@/components/button";

export default function Contact() {
  const [message, setMessage] = useState<string>("");
  const route = useRoute();
  const { trackId } = route.params as { trackId: string };

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://your-api-endpoint.com/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackId,
          message,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Your message has been sent successfully");
      } else {
        Alert.alert("Error", "Failed to send your message");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while sending your message");
    }
  };

  return (
    <ScrollView className="bg-white">
      <View>
        <Header>
          <Title>Contact us</Title>
        </Header>

        <View className="p-5 gap-y-5 ">
          <View className="mb-5">
            <Text className="text-base">
              Hi! We're here to help you get the most out of this conference. If
              you have any questions or thoughts, please don't hesitate to reach
              out. Your curiosity is welcome!
            </Text>
          </View>
          <Input
            lines={10}
            length={40}
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
