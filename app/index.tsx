import React, { useCallback } from "react";
import { Link, useRouter } from "expo-router";
import { Text, View, ScrollView, Image, RefreshControl } from "react-native";
import { Conference } from "@/types";
import { truncateTrackList, formatDate } from "@/core/utils";
import { useFetchData } from "@/core/hooks";
import Loader from "@/components/loader";
import Button from "@/components/button";

export default function FeedScreen() {
  const {
    data: conferences,
    loading,
    error,
    refresh,
  } = useFetchData<Conference[]>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences`
  );

  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const router = useRouter();

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
    <View className="relative h-full">
      <ScrollView
        className="bg-white relative"
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
                    pathname: "/(tabs)",
                    params: { confId: conference.id },
                  }}
                  className="border-b-2 border-slate-50"
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
                            <Text className="text-xs font-semibold">
                              {track}
                            </Text>
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
      <View className="absolute bottom-10 justify-center flex items-center w-full px-10">
        <Button title="Join us today!" onPress={() => router.push("/auth")} />
      </View>
    </View>
  );
}
