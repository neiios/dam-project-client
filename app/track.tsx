import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { useFetchData } from "@/core/hooks";
import { Article, Track } from "@/types";
import { formatDate } from "@/core/utils";
import { useRoute } from "@react-navigation/native";
import Loader from "@/components/loader";

function formatDate1(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

export default function TrackDetails() {
  const route = useRoute();
  const { trackId, confId } = route.params as {
    trackId: string;
    confId: string;
  };

  const {
    data: track,
    loading,
    error,
  } = useFetchData<Track>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}:8080/api/v1/conferences/${confId}/tracks/${trackId}`
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

  // Group articles by start date (formatted to "June 9, 2024")
  const articlesByDate = track?.articles.reduce((acc, article) => {
    const date = formatDate1(new Date(article.startDate));
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(article);
    return acc;
  }, {});

  return (
    <ScrollView className="bg-white">
      <View>
        <View>
          <View className="p-5 flex gap-y-4 border-b-2 border-slate-100">
            <Text className="text-2xl font-bold">Track agenda</Text>
          </View>

          <View className=" border-b-2 border-slate-100 p-5">
            <Text className="text-xl font-bold ">Description</Text>
            <Text className="text-lg">{track?.description}</Text>
          </View>
          <View className="flex w-full p-5 ">
            <View className="flex w-full gap-y-5">
              {Object.keys(articlesByDate).map((date) => (
                <View key={date}>
                  <Text className="text-lg font-bold mb-2">{date}</Text>
                  <View className="flex w-full gap-y-4">
                    {articlesByDate[date].map((article: Article) => (
                      <Link
                        key={article.id}
                        href={{
                          pathname: "article",
                          params: { articleId: article.id, confId: confId },
                        }}
                        className="bg-sky-50 rounded-md"
                      >
                        <View className="flex w-full p-2">
                          <View className="flex flex-row gap-x-a2"></View>
                          <Text className="text-lg font-bold mb-2">
                            {article.title}
                          </Text>
                          <Text className="text-xs text-slate-500">
                            {formatDate(article.startDate, article.endDate)}
                          </Text>
                        </View>
                      </Link>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}