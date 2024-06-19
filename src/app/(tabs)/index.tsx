import {
  View,
  Text,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
  Share,
} from "react-native";
import { AntDesign, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Conference } from "@/types";
import { calculateDuration, formatDateRange } from "@/core/utils";
import { useFetchData } from "@/core/hooks";
import Map from "@/components/map";
import Loader from "@/components/loader";
import Header from "@/components/header";
import Title from "@/components/title";
import { useTheme } from "@/app/context/ThemeContext";
import Error from "@/components/error";
import { useAuth } from "@/app/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";

export default function ConferenceDetails() {
  const route = useRoute();
  const { confId } = route.params as { confId: string };

  const { isAuthenticated, userRole } = useAuth();

  const { colorScheme } = useTheme();

  const {
    data: conference,
    loading,
    error,
    refresh,
  } = useFetchData<Conference>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${confId}`
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this conference: ${
          conference?.name
        }\n\nDescription: ${conference?.description}\n\nDate: ${formatDateRange(
          conference!.startDate,
          conference!.endDate
        )}\n\nLocation: ${conference?.city}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with activity type: ${result.activityType}`);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <View>
      <ScrollView
        className="bg-white dark:bg-neutral-900"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        <View>
          <View>
            <Header>
              <View className="flex flex-row justify-between items-center">
                <Title> {conference?.name}</Title>
                <TouchableOpacity activeOpacity={0.7} onPress={onShare}>
                  <View className="flex flex-row items-center gap-x-2 bg-sky-100  py-1 rounded-md">
                    <View className="pl-1">
                      <Octicons name="share-android" size={13} />
                    </View>
                    <Text className="font-bold text-xs pr-2">Share </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Header>
            <View className="p-5 flex gap-y-5">
              {conference?.imageUrl && (
                <ImageWithFallback imageUrl={conference.imageUrl} />
              )}
              <View>
                <Text className="text-lg font-bold mb-2 text-black dark:text-gray-300">
                  About this event
                </Text>
                <Text className="text-lg text-black dark:text-gray-300 ">
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
                      calculateDuration(
                        conference.startDate,
                        conference.endDate
                      )}
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
                      key={track.id}
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

      {isAuthenticated && userRole === "admin" ? (
        <View className="absolute bottom-8 right-8 flex items-center">
          <TouchableOpacity
            className="bg-sky-700 p-4 rounded-full w-full"
            activeOpacity={0.8}
            onPress={() => router.push(`/admin/conferences/${confId}`)}
          >
            <AntDesign name="form" color="white" size={25} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const ImageWithFallback = ({ imageUrl }: { imageUrl: string }) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <Image
      className="w-full h-52 rounded-md mt-5"
      source={
        imageLoaded
          ? { uri: imageUrl }
          : require("../../assets/images/fallback-light.png")
      }
      onError={() => setImageLoaded(false)}
    />
  );
};
