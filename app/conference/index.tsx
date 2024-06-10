import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";

import { conference } from "@/assets/data";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

export default function Conference() {
  const route = useRoute();
  const { id } = route.params;

  return (
    <ScrollView className="bg-white">
      <View>
        <View className="p-5 flex gap-y-5">
          <Text className="text-2xl capitalize font-bold">
            {conference.title}
          </Text>
          <Image
            className="w-full h-52 rounded-md"
            source={{
              uri: conference.coverImgUrl,
            }}
          />
          <View>
            <Text className="text-lg font-bold mb-2">Date and time</Text>
            <Text className="text-lg">
              <AntDesign name="clockcircleo" size={20} />
            </Text>
          </View>
          <View>
            <Text className="text-lg font-bold mb-2">Location</Text>
            <Text className="text-lg">{conference.description}</Text>
          </View>
          <View>
            <Text className="text-lg font-bold mb-2">About this event</Text>
            <Text className="text-lg">{conference.description}</Text>
          </View>
          <View>
            <Text className="text-lg font-bold mb-2">Tracks</Text>
            <Text className="text-lg">{conference.description}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
