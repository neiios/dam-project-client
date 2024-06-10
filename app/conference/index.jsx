import { View, Text, ScrollView, Image } from "react-native";
import React from "react";

import { conference } from "@/assets/data";

export default function Conference() {
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
            <Text className="text-lg font-bold mb-2">Expectations</Text>
            <Text className="text-lg">{conference.description}</Text>
          </View>
          <View>
            <Text className="text-lg font-bold mb-2">Our agenda</Text>
            <Text className="text-lg">{conference.description}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
