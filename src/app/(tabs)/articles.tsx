import {
  View,
  Text,
  ScrollView,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Article } from "@/types";
import { useRoute } from "@react-navigation/native";
import { formatDate } from "@/core/utils";
import Header from "@/components/header";
import Title from "@/components/title";

export default function Articles() {
  const route = useRoute();
  const { confId } = route.params as { confId: string };

  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, onChangeQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const pageSize = 8;

  const fetchArticles = useCallback(
    async (reset: boolean = false) => {
      if (reset) {
        setPage(1);
        setHasMore(true);
      }
      if (!hasMore && !reset) return;

      setLoading(true);
      try {
        const response = await fetch(
          `http://${
            process.env.EXPO_PUBLIC_API_BASE
          }/api/v1/conferences/${confId}/articles?pageSize=${pageSize}&page=${
            reset ? 1 : page
          }&searchTerm=${searchQuery}`
        );
        const data = await response.json();

        if (reset) {
          setArticles(data);
        } else {
          setArticles((prevArticles) => [...prevArticles, ...data]);
        }

        setHasMore(data.length === pageSize);
        setPage((prevPage) => (reset ? 2 : prevPage + 1));
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert("Error", error.message);
        } else {
          Alert.alert("Error", "An unknown error occurred.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [confId, page, searchQuery, hasMore]
  );

  useEffect(() => {
    fetchArticles(true);
  }, [confId, searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchArticles(true);
  }, [fetchArticles]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchArticles();
    }
  };

  return (
    <ScrollView
      className="bg-white dark:bg-neutral-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={({ nativeEvent }) => {
        if (
          nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
          nativeEvent.contentSize.height - 20
        ) {
          handleLoadMore();
        }
      }}
      scrollEventThrottle={10}
    >
      <View>
        <Header>
          <Title>Conference articles</Title>
          <View className="relative flex justify-center items-left mt-5">
            <TextInput
              onChangeText={onChangeQuery}
              placeholder="Search Articles"
              placeholderTextColor="#94a3b8"
              className="text-slate-400 w-full box-content border-2 border-slate-100 focus:border-sky-200 rounded-md pl-10 py-2"
              value={searchQuery}
              onSubmitEditing={() => fetchArticles(true)}
            />
            <View className="absolute left-2">
              <AntDesign color="#94a3b8" name="search1" size={20} />
            </View>
          </View>
        </Header>

        <View className="flex w-full gap-y-4 p-5">
          {articles && articles.length > 0
            ? articles.map((article) => (
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
                    <Text
                      className="text-lg font-bold mb-2 flex w-72 "
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {article.title}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      {formatDate(article.startDate, article.endDate)}
                    </Text>
                  </View>
                </Link>
              ))
            : !loading && (
                <View className="p-5">
                  <Text className="text-lg text-center text-slate-500">
                    No articles available
                  </Text>
                </View>
              )}
          {hasMore && (
            <View className="p-5 h-20">
              {loading && <ActivityIndicator size="large" color="#075985" />}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
