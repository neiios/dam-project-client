import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { Request } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/button";

export default function Page() {
  const { isAuthenticated, userRole } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      router.replace("/auth");
    }
  }, [isAuthenticated, userRole]);

  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    async function fetchRequests() {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/requests`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await AsyncStorage.getItem("jwtToken")),
          },
        }
      );

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    }

    fetchRequests();
  }, []);

  async function handleRemove(requestId: number) {
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    const response = await fetch(
      `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/requests/${requestId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (response.ok) {
      const updatedRequests = requests.filter((r) => r.id !== requestId);
      setRequests(updatedRequests);
    }
  }

  return (
    <View className="bg-white min-h-full flex items-center">
      <Text className="text-4xl font-bold mb-12 mt-20">Requests</Text>
      <ScrollView>
        <View className="flex items-center">
          {requests.map((request) => (
            <View
              key={request.id}
              className="border border-neutral-300 p-4 rounded-lg shadow-md w-full mb-4"
            >
              <Text className="text-xl text-center font-bold">
                {request.question}
              </Text>

              {request.status === "answered" ? (
                <Text className="text-lg mt-4 text-center">
                  Answer: {request.answer}
                </Text>
              ) : null}

              <View className="mt-8">
                <Button
                  title="Answer"
                  onPress={() => router.push(`/admin/requests/${request.id}`)}
                />
              </View>

              <View className="mt-4">
                <Button
                  title="Remove"
                  bgColor="bg-red-500"
                  onPress={() => handleRemove(request.id)}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
