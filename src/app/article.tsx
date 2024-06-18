import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useFetchData } from "@/core/hooks";
import { Article } from "@/types";
import { formatDate } from "@/core/utils";
import Loader from "@/components/loader";
import Title from "@/components/title";
import Header from "@/components/header";
import { useAuth } from "@/app/context/AuthContext";
import { router } from "expo-router";

export default function ArticleDetails() {
  const route = useRoute();
  const { articleId, confId } = route.params as {
    articleId: string;
    confId: string;
  };

  const { isAuthenticated, userRole } = useAuth();

  const {
    data: article,
    loading,
    error,
  } = useFetchData<Article>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${confId}/articles/${articleId}`
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <View className="min-h-full bg-white">
      <ScrollView>
        <View>
          <View>
            <Header>
              <Title>{article?.title}</Title>
            </Header>
            <View className="p-5 flex gap-y-5">
              <View>
                <Text className="text-lg font-bold mb-2">Abstract</Text>
                <Text className="text-lg">{article?.abstract}</Text>
              </View>
              <View>
                <Text className="text-lg font-bold mb-2">Date and time</Text>
                <View className="flex flex-row gap-x-2">
                  <AntDesign name="calendar" size={20} />
                  <Text className="font-semibold">
                    {formatDate(article!.startDate, article!.endDate)}
                  </Text>
                </View>
              </View>
              <View>
                <Text className="text-lg font-bold mb-2">Speakers</Text>
                <View className="flex flex-row gap-x-2">
                  <AntDesign name="user" size={20} />
                  <Text className="font-semibold">{article?.authors}</Text>
                </View>
              </View>

              <View>
                <Text className="text-lg font-bold mb-2">Room</Text>
                <View className="flex flex-row gap-x-2">
                  <AntDesign name="find" size={20} />
                  <Text className="font-semibold">{article?.track.room}</Text>
                </View>
              </View>

              <View>
                <Text className="text-lg font-bold mb-2">Track</Text>
                <View className="flex flex-row gap-x-2">
                  <AntDesign name="paperclip" size={20} />
                  <Text className="font-semibold">{article?.track.name}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {isAuthenticated && userRole === "admin" ? (
        <View className="absolute bottom-8 right-8 flex items-center">
          <TouchableOpacity
            className="bg-sky-700 py-4 px-4 rounded-xl w-full"
            activeOpacity={0.8}
            onPress={() =>
              router.push(`/admin/conferences/${confId}/articles/${articleId}`)
            }
          >
            <MaterialIcons color="white" name="edit" size={32} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
