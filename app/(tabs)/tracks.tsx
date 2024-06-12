import React, { useCallback } from "react";
import { Link } from "expo-router";
import { Text, View, ScrollView, RefreshControl } from "react-native";
import { Conference, Track } from "@/types";
import { useFetchData } from "@/core/hooks";
import { useRoute } from "@react-navigation/native";
import Loader from "@/components/loader";
import Header from "@/components/header";
import Title from "@/components/title";

export default function Tracks() {
  const route = useRoute();
  const { confId } = route.params as { confId: string };

  const {
    data: tracks,
    loading,
    error,
    refresh,
  } = useFetchData<Track[]>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/1/tracks`
  );

  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

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
    <ScrollView
      className="bg-white"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <View>
        <View>
          <Header>
            <Title>Conference tracks</Title>
          </Header>
          <View className="flex w-full gap-y-4 p-5">
            {tracks && tracks.length > 0 ? (
              tracks.map((track, index) => (
                <Link
                  key={track.id}
                  href={{
                    pathname: "track",
                    params: { trackId: track.id, confId: confId },
                  }}
                  className="bg-sky-50 rounded-md"
                >
                  <View className="p-2 flex-row items-center justify-between">
                    <View className="flex">
                      <Text className="text-lg font-bold capitalize">
                        {track.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="text-xs text-slate-500 w-full"
                      >
                        {track?.room}
                      </Text>
                      <View className="flex flex-wrap w-72">
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          className="text-xs text-slate-500 w-full"
                        >
                          {track.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Link>
              ))
            ) : (
              <View className="p-5">
                <Text className="text-lg text-center text-slate-500">
                  No tracks available
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
