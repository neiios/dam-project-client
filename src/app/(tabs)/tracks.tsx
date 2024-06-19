import React, { useCallback } from "react";
import { Link, router } from "expo-router";
import {
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Track } from "@/types";
import { useFetchData } from "@/core/hooks";
import { useRoute } from "@react-navigation/native";
import Loader from "@/components/loader";
import Header from "@/components/header";
import Title from "@/components/title";
import Error from "@/components/error";
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";

export default function Tracks() {
  const route = useRoute();

  const { isAuthenticated, userRole } = useAuth();

  const { confId } = route.params as { confId: string };

  const {
    data: tracks,
    loading,
    error,
    refresh,
  } = useFetchData<Track[]>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${confId}/tracks`
  );

  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <View className="h-full">
      <ScrollView
        className="bg-white dark:bg-neutral-900"
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
                    className="bg-sky-50 dark:bg-neutral-800 rounded-md"
                  >
                    <View className="p-2 flex-row items-center justify-between">
                      <View className="flex">
                        <Text className="text-lg font-bold text-slate-800 dark:text-slate-100">
                          {track.name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          className="text-xs text-slate-800 dark:text-slate-100 w-full"
                        >
                          {track?.room}
                        </Text>
                        <View className="flex flex-wrap w-72">
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className="text-xs text-slate-800 dark:text-slate-100 w-full"
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
                  <Text className="text-lg text-center text-slate-800 dark:text-slate-100">
                    No tracks available
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {isAuthenticated && userRole === "admin" ? (
        <View className="absolute bottom-8 right-8 flex items-center">
          <TouchableOpacity
            className="bg-sky-700 p-4 rounded-full w-full"
            activeOpacity={0.8}
            onPress={() => router.push(`/admin/conferences/${confId}/tracks`)}
          >
            <AntDesign color="white" name="plus" size={25} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
