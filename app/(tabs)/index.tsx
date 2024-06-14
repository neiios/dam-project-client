import React from "react";
import { View, Text, ScrollView, Image, RefreshControl } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Conference } from "@/types";
import { calculateDuration, formatDateRange } from "@/core/utils";
import { useFetchData } from "@/core/hooks";
import Map from "../../components/map";
import Loader from "@/components/loader";
import Header from "@/components/header";
import Title from "@/components/title";
import { useTheme } from "../context/ThemeContext";
import Error from "@/components/error";

export default function ConferenceDetails() {
  const route = useRoute();
  const { confId } = route.params as { confId: string };

  const { colorScheme } = useTheme();

  const {
    data: conference,
    loading,
    error,
    refresh,
  } = useFetchData<Conference>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${confId}`
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <ScrollView
      className="bg-white dark:bg-neutral-900"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      <View>
        <View>
          <Header>
            <Title> {conference?.name}</Title>
          </Header>
          <View className="p-5 flex gap-y-5">
            {conference?.imageUrl && (
              <Image
                className="w-full h-52 rounded-md"
                source={{
                  uri: conference.imageUrl,
                }}
              />
            )}
            <View>
              <Text className="text-lg font-bold mb-2 text-black dark:text-gray-300">
                About this event
              </Text>
              <Text className="text-lg text-black dark:text-gray-300">
                {conference?.description}
              </Text>
            </View>
            <View>
              <Text className="text-lg font-bold mb-2 text-black dark:text-gray-300">
                Duration
              </Text>
              <View className="flex flex-row gap-x-2">
                <AntDesign
                  name="clockcircleo"
                  size={20}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
                <Text className="font-semibold text-black dark:text-gray-300">
                  {conference &&
                    calculateDuration(conference.startDate, conference.endDate)}
                </Text>
              </View>
            </View>

            <View>
              <Text className="text-lg font-bold mb-2 text-black dark:text-gray-300">
                Date and time
              </Text>
              <View className="flex flex-row gap-x-2">
                <AntDesign
                  name="calendar"
                  size={20}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
                <Text className="font-semibold text-black dark:text-gray-300">
                  {conference &&
                    formatDateRange(conference.startDate, conference.endDate)}
                </Text>
              </View>
            </View>

            <View>
              <Text className="text-lg font-bold mb-2 text-black dark:text-gray-300">
                Tracks
              </Text>
              <View className="flex flex-row flex-wrap gap-x-2 gap-y-2">
                {conference?.tracks?.map((track) => (
                  <View
                    className="bg-sky-100 dark:bg-sky-900 rounded-md py-1 px-2"
                    key={track.name}
                  >
                    <Text className="text-xs font-semibold text-black dark:text-gray-300">
                      {track.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View>
              <Text className="text-lg font-bold mb-2 text-black dark:text-gray-300">
                Where to find us
              </Text>
              <View className="flex flex-row gap-x-2">
                <AntDesign
                  name="find"
                  size={20}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
                <Text className="font-semibold text-black dark:text-gray-300">
                  {conference?.city}
                </Text>
              </View>
              <View className="h-52 mt-5">
                <Map
                  latitude={Number(conference!.latitude)}
                  longitude={Number(conference!.longitude)}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
