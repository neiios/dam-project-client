import { View, Text, ScrollView, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import Loader from "@/components/loader";
import Header from "@/components/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Request } from "@/types";

export default function Answer() {
  const route = useRoute();
  const { requestId, parentId } = route.params as {
    requestId: string;
    parentId: string;
  };

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [request, setRequest] = useState<Request>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRequest = async () => {
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${parentId}/requests/${requestId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data: Request = await response.json();
      setRequest(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequest();
  }, [fetchRequest]);

  useEffect(() => {
    fetchRequest();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <View className="min-h-full bg-white">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Header>
            <View className="flex gap-y-2">
              <Text className="text-xl">{request!.question}</Text>
            </View>
          </Header>
          <View className="p-5  ">
            {request!.status === "answered" ? (
              <View className="border-neutral-100 border-2 bg-neutral-50 p-2 rounded-md">
                <Text className="text-lg font-bold mb-1">Answer</Text>
                <Text>{request!.answer}</Text>
              </View>
            ) : (
              <Text>Our team will soon get to your request.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
