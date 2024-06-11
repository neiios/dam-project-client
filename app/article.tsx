import { View, Text, ScrollView } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useFetchData } from "@/core/hooks";
import { Article } from "@/types";
import { formatDate } from "@/core/utils";
import Loader from "@/components/loader";
import Title from "@/components/title";
import Header from "@/components/header";

export default function ArticleDetails() {
  const route = useRoute();
  const { articleId, confId } = route.params as {
    articleId: string;
    confId: string;
  };

  const {
    data: article,
    loading,
    error,
  } = useFetchData<Article>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}:8080/api/v1/conferences/${confId}/articles/${articleId}`
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
    <ScrollView className="bg-white">
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
  );
}
