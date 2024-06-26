import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { useFetchData } from "@/core/hooks";
import { Article, Track } from "@/types";
import { formatDate, formatTrackDate } from "@/core/utils";
import { useRoute } from "@react-navigation/native";
import Loader from "@/components/loader";
import Header from "@/components/header";
import Title from "@/components/title";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";

export default function TrackDetails() {
  const route = useRoute();

  const { isAuthenticated, userRole } = useAuth();

  const { trackId, confId } = route.params as {
    trackId: string;
    confId: string;
  };

  const {
    data: track,
    loading,
    error,
  } = useFetchData<Track>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${confId}/tracks/${trackId}`
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

  const articlesByDate =
    track?.articles.reduce<Record<string, any[]>>((acc, article) => {
      const date = formatTrackDate(new Date(article.startDate));
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(article);
      return acc;
    }, {}) || {};

  return (
    <View className="h-full">
      <ScrollView className="bg-white dark:bg-neutral-900">
        <View>
          <View>
            <Header>
              <Title>Track agenda</Title>
            </Header>

            <View className=" border-b-2 border-slate-50 dark:border-gray-900 p-5 flex gap-y-5">
              <View>
                <Text className="text-xl font-bold text-black dark:text-gray-100">
                  Description
                </Text>
                <Text className="text-lg text-black dark:text-gray-100">
                  {track?.description}
                </Text>
              </View>
              <View>
                <Text className="text-xl font-bold text-black dark:text-gray-100">
                  Room
                </Text>
                <Text className="text-lg text-black dark:text-gray-100">
                  {track?.room}
                </Text>
              </View>
            </View>
            <View className="flex w-full p-5 ">
              <View className="flex w-full gap-y-5">
                {Object.keys(articlesByDate).map((date) => (
                  <View key={date}>
                    <Text className="text-sm font-bold mb-3 text-black dark:text-gray-100">
                      {date}
                    </Text>
                    <View className="flex w-full gap-y-4">
                      {articlesByDate[date].map((article: Article) => (
                        <Link
                          key={article.id}
                          href={{
                            pathname: "article",
                            params: {
                              articleId: article.id,
                              confId: confId,
                            },
                          }}
                          className="bg-sky-50 dark:bg-neutral-800 rounded-md"
                        >
                          <View className="flex w-full p-2">
                            <View className="flex flex-row gap-x-a2 text-black dark:text-gray-100"></View>
                            <Text
                              className="text-lg font-bold mb-2 flex w-72 text-black dark:text-gray-100"
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {article.title}
                            </Text>
                            <Text className="text-xs text-slate-500 dark:text-gray-100">
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

      {isAuthenticated && userRole === "admin" ? (
        <View className="absolute bottom-28 right-8 flex items-center">
          <TouchableOpacity
            className="bg-sky-700 p-4 rounded-full w-full"
            activeOpacity={0.8}
            onPress={() =>
              router.push(`/admin/conferences/${confId}/tracks/${trackId}`)
            }
          >
            <AntDesign name="form" color="white" size={25} />
          </TouchableOpacity>
        </View>
      ) : null}

      {isAuthenticated && userRole === "admin" ? (
        <View className="absolute bottom-8 right-8 flex items-center">
          <TouchableOpacity
            className="bg-sky-700 p-4 rounded-full w-full"
            activeOpacity={0.8}
            onPress={() =>
              router.push(
                `/admin/conferences/${confId}/tracks/${trackId}/articles`
              )
            }
          >
            <AntDesign color="white" name="plus" size={25} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
