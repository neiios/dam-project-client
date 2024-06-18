import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { Request } from "@/types";

export default function Page() {
  const { isAuthenticated, userRole } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      router.replace("/auth");
    }
  }, [isAuthenticated, userRole]);

  const params = useLocalSearchParams();
  const requestId = params.requestId;

  const [request, setRequest] = useState<Request>();

  useEffect(() => {
    async function fetchRequest() {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/requests/${requestId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        setRequest(data);
      }
    }

    fetchRequest();
  }, [requestId]);

  const handleSubmit = async () => {
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    const response = await fetch(
      `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/requests/${requestId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(request),
      }
    );

    if (response.ok) {
      router.push("/admin/requests");
    }
  };

  return (
    <ScrollView className="bg-white h-full pt-20 gap-y-4 px-6">
      <View className="flex">
        <Text className="text-4xl font-bold mb-12 text-center">
          Answer Conference Question
        </Text>

        <View className="gap-y-8">
          <Text className="text-2xl text-center">{request?.question}</Text>

          <TextInput
            className="w-full border border-gray-300 p-2 rounded-md mb-3 h-24"
            placeholder="Description"
            onChangeText={(text) =>
              request ? setRequest({ ...request, answer: text }) : null
            }
            multiline
          />

          <Button title="Submit" onPress={handleSubmit} />
        </View>
      </View>
    </ScrollView>
  );
}
