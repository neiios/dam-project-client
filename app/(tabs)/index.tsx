import React, { useEffect, useState, useCallback } from "react";
import { Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Text, View, ScrollView, Image, RefreshControl } from "react-native";
import { Conference, Track } from "@/types";
import { truncateTrackList } from "@/core/utils";

const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const startDay = start.getDate();
  const endDay = end.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    start
  );

  return `${month} ${startDay}-${endDay} ${end.getFullYear()}`;
};

export default function FeedScreen() {
  const navigation = useNavigation();
  const [conferenceData, setConferenceData] = useState<Conference[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConferenceData = async () => {
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}:8080/api/v1/conferences`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Conference[] = await response.json();

      const extractedTracks: Track[] = data.flatMap(
        (conference) => conference.tracks!
      );
      setTracks(extractedTracks);

      // Fetch city names for each conference
      const dataWithCityNames = await Promise.all(
        data.map(async (conference) => {
          return conference;
        })
      );

      setConferenceData(dataWithCityNames);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchConferenceData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConferenceData().finally(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      className="bg-white"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <View className="flex w-full">
          {conferenceData.map((conference, index) => (
            <Link
              key={conference.id}
              href={{
                pathname: "/conference",
                params: { id: conference.id },
              }}
              className={`border-b-2 border-slate-100 ${
                index === conferenceData.length - 1 ? "border-b-0" : ""
              }`}
            >
              <View className="p-5 flex-row items-center justify-between">
                <View className="flex gap-y-2 w-44">
                  <Text className="text-lg font-bold">{conference.name}</Text>
                  <View className="flex flex-row gap-x-2">
                    {truncateTrackList(tracks).map((track) => (
                      <View className="bg-sky-100 rounded-md p-1" key={track}>
                        <Text className="text-xs font-semibold">{track}</Text>
                      </View>
                    ))}
                  </View>
                  <Text className="text-xs text-slate-500">
                    {formatDateRange(conference.startDate, conference.endDate)}{" "}
                    • {conference.city}
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
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
