import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { Request } from "@/types";
import Form from "@/components/form"; // Import the Form component

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
    <ScrollView className="bg-white ">
      <View className="flex">
        <Form
          message={request?.answer || ""}
          setMessage={(text: string) =>
            setRequest((prev) => (prev ? { ...prev, answer: text } : prev))
          }
          handleSubmit={handleSubmit}
          MAX_MESSAGE_LENGTH={200}
          statement={request?.question || ""}
          placeholder="Your response"
          header="Respond to request"
        />
      </View>
    </ScrollView>
  );
}
