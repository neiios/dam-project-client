import { useRouter } from "expo-router";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { conferenceData } from "@/assets/data";

export default function FeedScreen() {
  const router = useRouter();
  return (
    <ScrollView>
      <View className="mt-10">
        <View className="flex w-full">
          {conferenceData.map((conference) => (
            <TouchableOpacity
              key={conference.key}
              onPress={() => router.push(`../conference/`)}
              className="border-b-2 border-slate-200"
              activeOpacity={1}
            >
              <View className="p-5 flex-row items-center justify-between">
                <View className="flex gap-y-2">
                  <Text className="text-lg font-bold">{conference.title}</Text>
                  <View className="flex flex-row gap-x-2">
                    {conference.tracks.map((track) => {
                      return (
                        <View className="bg-slate-200 rounded-md p-1">
                          <Text className="text-xs font-semibold">{track}</Text>
                        </View>
                      );
                    })}
                  </View>
                  <Text className="text-xs text-slate-500">
                    {conference.date} • {conference.location}
                  </Text>
                </View>
                <Image
                  className="w-32 h-20 rounded-md"
                  source={{
                    uri: conference.converImgUrl,
                  }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
