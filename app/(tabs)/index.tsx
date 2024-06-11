import React, { useCallback } from "react";
import { Link } from "expo-router";
import {
  Text,
  View,
  ScrollView,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Conference } from "@/types";
import { truncateTrackList, formatDate } from "@/core/utils";
import { useFetchData } from "@/core/hooks";

export default function FeedScreen() {
  const {
    data: conferences,
    loading,
    error,
    refresh,
  } = useFetchData<Conference[]>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}:8080/api/v1/conferences`
  );

  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

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
        <View className="flex w-full">
          {conferences && conferences.length > 0 ? (
            conferences.map((conference, index) => (
              <Link
                key={conference.id}
                href={{
                  pathname: "/conference",
                  params: { id: conference.id },
                }}
                className={`border-b-2 border-slate-100 ${
                  index === conferences.length - 1 ? "border-b-0" : ""
                }`}
              >
                <View className="p-5 flex-row items-center justify-between">
                  <View className="flex gap-y-2 w-52">
                    <Text className="text-lg font-bold capitalize">
                      {conference.name}
                    </Text>
                    <View className="flex flex-row gap-x-2">
                      {truncateTrackList(conference.tracks!).map((track) => (
                        <View
                          className="bg-sky-100 rounded-md py-1 px-2"
                          key={track}
                        >
                          <Text className="text-xs font-semibold">{track}</Text>
                        </View>
                      ))}
                    </View>
                    <Text className="text-xs text-slate-500">
                      {formatDate(conference.startDate)}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      {conference.city}
                    </Text>
                  </View>
                  <Image
                    className="w-32 h-20 rounded-md"
                    source={{
                      uri: conference.imageUrl,
                    }}
                  />
                </View>
              </Link>
            ))
          ) : (
            <View className="p-5">
              <Text className="text-lg text-center text-slate-500">
                No conferences available
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
