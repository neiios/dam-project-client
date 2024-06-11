import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useCallback } from "react";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Article } from "@/types";
import { useFetchData } from "@/core/hooks";
import { useRoute } from "@react-navigation/native";
import { formatDate } from "@/core/utils";

export default function Articles() {
  const route = useRoute();
  const { id } = route.params as { id: string };

  const [searchQuery, onChangeQuery] = React.useState<string>("");

  const {
    data: articles,
    loading,
    error,
    refresh,
  } = useFetchData<Article[]>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}:8080/api/v1/conferences/${id}/articles`
  );

  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const router = useRouter();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="bg-white"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <View>
        <View className="p-5 flex gap-y-4 border-b-2 border-slate-100">
          <Text className="text-2xl font-bold">Featured articles</Text>
          <View className="relative flex justify-center items-left">
            <TextInput
              onChangeText={onChangeQuery}
              placeholder="Search Articles"
              placeholderTextColor="#94a3b8"
              editable={articles!.length > 0}
              className="text-slate-400 w-full box-content border-2 border-slate-100 focus:border-sky-200 rounded-md pl-10 py-2 "
            />
            <View className="absolute left-2">
              <AntDesign color="#94a3b8" name="search1" size={20} />
            </View>
          </View>
        </View>
        <View className="flex w-full ">
          {articles && articles.length > 0 ? (
            articles.map((article, index) => (
              <TouchableOpacity
                key={article.id}
                onPress={() => router.push(`/article`)}
                className={`border-b-2 border-slate-100 ${
                  index === articles.length - 1 ? "border-b-0" : ""
                }`}
                activeOpacity={1}
              >
                <View className="flex w-full px-5 py-2">
                  <View className="flex flex-row gap-x-2"></View>
                  <Text className="text-lg font-bold mb-2">
                    {article.title}
                  </Text>

                  <Text className="text-xs text-slate-500">
                    {formatDate(article.startDate, article.endDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="p-5">
              <Text className="text-lg text-center text-slate-500">
                No articles available
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
