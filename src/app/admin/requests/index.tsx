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
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const answeredRequests = requests.filter((r) => r.status === "answered");

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
    <ScrollView className="bg-white min-h-full px-10">
      <View className="flex-col items-center">
        <Text className="text-4xl font-bold mb-8 mt-10 text-center">
          Requests
        </Text>

        <Text className="text-2xl font-bold mb-4">Pending Requests</Text>

        <View className="flex items-center w-full">
          {pendingRequests.map((request) => (
            <View
              key={request.id}
              className="border border-neutral-300 p-4 rounded-lg shadow-md flex items-center w-full mb-4"
            >
              <View className="border-b border-neutral-300 w-full">
                <Text className="text-xl text-center font-bold mb-4">
                  {request.question}
                </Text>

                <Text className="text-lg mb-4 text-center ">
                  Status: Waiting for an answer
                </Text>
              </View>

              <View className="flex-row gap-x-4 p-4">
                <View>
                  <Button
                    title="Remove"
                    bgColor="bg-red-500"
                    onPress={() => handleRemove(request.id)}
                  />
                </View>

                <View>
                  <Button
                    title="Answer"
                    onPress={() => router.push(`/admin/requests/${request.id}`)}
                  />
                </View>
              </View>
            </View>
          ))}

          <Text className="text-2xl font-bold mb-4">Answered Requests</Text>

          {answeredRequests.map((request) => (
            <View
              key={request.id}
              className="border border-neutral-300 p-4 rounded-lg shadow-md flex items-center w-full mb-4"
            >
              <View className="border-b border-neutral-300 w-full">
                <Text className="text-xl text-center font-bold mb-4">
                  {request.question}
                </Text>

                {request.status === "answered" ? (
                  <Text className="text-lg mb-4 text-center ">
                    Answer: {request.answer}
                  </Text>
                ) : null}
              </View>

              <View className="flex-row gap-x-4 p-4">
                <View>
                  <Button
                    title="Remove"
                    bgColor="bg-red-500"
                    onPress={() => handleRemove(request.id)}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
