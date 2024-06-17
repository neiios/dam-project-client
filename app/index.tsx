import { useFocusEffect, useRouter, Link } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

import { Conference, User } from "@/types";
import { truncateTrackList, formatDate } from "@/core/utils";
import { useFetchData } from "@/core/hooks";
import Loader from "@/components/loader";
import Button from "@/components/button";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./context/AuthContext";

export default function FeedScreen() {
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();

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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-slate-800">
        <Text className="text-lg text-red-500 dark:text-red-300">
          Error: {error}
        </Text>
      </View>
    );
  }

  return (
    <View className="h-full bg-white dark:bg-neutral-900">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {!isAuthenticated && (
          <View className="w-full px-10 my-4">
            <Button
              title="Join us today!"
              onPress={() => router.push("/auth")}
            />
          </View>
        )}

        <View className="flex w-full">
          {conferences && conferences.length > 0 ? (
            // TODO: AAAAAAA this really needs to be a separate component
            conferences.map((conference) => (
              <Link
                key={conference.id}
                href={{
                  pathname: "/(tabs)",
                  params: { confId: conference.id },
                }}
                className="border-b-2 border-slate-50 dark:border-neutral-800"
              >
                <View className="p-5 flex-row items-center justify-between">
                  <View className="flex gap-y-2 w-52">
                    <Text className="text-lg font-bold capitalize text-black dark:text-neutral-300">
                      {conference.name}
                    </Text>
                    <View className="flex flex-row gap-x-2">
                      {truncateTrackList(conference.tracks!).map((track) => (
                        <View
                          className="bg-sky-100 dark:bg-sky-900 rounded-md py-1 px-2"
                          key={track}
                        >
                          <Text className="text-xs font-semibold text-black dark:text-white">
                            {track}
                          </Text>
                        </View>
                      ))}
                    </View>
                    <Text className="text-xs text-slate-500 dark:text-neutral-300">
                      {formatDate(conference.startDate)}
                    </Text>
                    <Text className="text-xs text-slate-500 dark:text-neutral-300">
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
            <Text className="p-5 text-lg text-center text-slate-500 dark:text-slate-400">
              No conferences available yet, check back later!
            </Text>
          )}
        </View>
      </ScrollView>

      {isAuthenticated && userRole === "admin" ? (
        <View className="absolute bottom-8 right-8 flex items-center">
          <TouchableOpacity
            className="bg-sky-700 py-4 px-4 rounded-xl w-full"
            activeOpacity={0.8}
            onPress={() => router.push("/admin/conferences")}
          >
            <Ionicons color="white" name="add" size={32} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
