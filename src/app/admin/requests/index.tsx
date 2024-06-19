import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { FatRequest } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "@/components/header";
import Title from "@/components/title";
import Loader from "@/components/loader";
import { AntDesign } from "@expo/vector-icons";

export default function Page() {
  const { isAuthenticated, userRole } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") {
      router.replace("/auth");
    }
  }, [isAuthenticated, userRole]);

  const [requests, setRequests] = useState<FatRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
        setLoading(false);
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

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView className="bg-white">
      <Header>
        <Title>Requests</Title>
      </Header>

      <View className="p-5">
        <Text className="text-lg font-bold mb-5">Pending Requests</Text>

        {pendingRequests.length === 0 ? (
          <Text className="text-base w-full mb-5">No pending requests</Text>
        ) : null}

        <View className="flex gap-y-5">
          {pendingRequests.map((request) => (
            <View
              key={request.id}
              className="rounded-lg shadow-md flex items-center w-full border-red-200 border-2 bg-neutral-50"
            >
              <View className="border-b border-neutral-100 w-full flex ">
                <Text className="text-xl font-bold border-b w-full border-neutral-100 p-5">
                  {request.question}
                </Text>
                <View className="p-5 w-full flex gap-y-3">
                  <Text className="leading-6">
                    Submitted by user{" "}
                    <Text className="font-bold">{request.user.name}</Text> under
                    conference{" "}
                    <Link
                      href={{
                        pathname: "/(tabs)",
                        params: { confId: request.conferenceId },
                      }}
                      className="font-bold text-blue-600"
                    >
                      {request.conference.name}
                    </Link>
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-x-4 p-4 bg w-full items-center justify-end">
                <View>
                  <TouchableOpacity
                    onPress={() => handleRemove(request.id)}
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
                    onPress={() => router.push(`/admin/requests/${request.id}`)}
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

        <Text className="text-lg font-bold my-5">Answered Requests</Text>

        {answeredRequests.length === 0 ? (
          <Text className="text-base w-full mb-5">No answered requests</Text>
        ) : null}

        <View className="flex gap-y-5">
          {answeredRequests.map((request) => (
            <View
              key={request.id}
              className="rounded-lg shadow-md flex items-center w-full border-green-200 border-2 bg-neutral-50"
            >
              <View className="border-b border-neutral-100 w-full flex ">
                <Text className="text-xl font-bold border-b w-full border-neutral-100 p-5">
                  {request.question}
                </Text>
                <View className="p-5 w-full flex gap-y-3">
                  <Text className="leading-6">
                    Submitted by user{" "}
                    <Text className="font-bold">{request.user.name}</Text> under
                    conference{" "}
                    <Link
                      href={{
                        pathname: "/(tabs)",
                        params: { confId: request.conferenceId },
                      }}
                      className="font-bold text-blue-600"
                    >
                      {request.conference.name}
                    </Link>
                  </Text>
                  <View className="border-neutral-100 border-2 bg-neutral-50 p-2 rounded-md">
                    <Text className="text-sm font-bold mb-1">Answer</Text>
                    <Text className="leading-5">{request.answer}</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-x-4 p-4 bg w-full items-center justify-end">
                <View>
                  <TouchableOpacity
                    onPress={() => handleRemove(request.id)}
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
