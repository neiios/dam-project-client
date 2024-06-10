import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import { articles } from "@/assets/data";

export default function Articles() {
  const [searchQuery, onChangeQuery] = React.useState(null);

  const router = useRouter();
  return (
    <ScrollView className="bg-white">
      <View>
        <View className="p-5 flex gap-y-4 border-b-2 border-slate-100">
          <Text className="text-2xl font-bold">Featured articles</Text>
          <View className="relative flex justify-center items-left">
            <TextInput
              onChangeText={onChangeQuery}
              placeholder="Search Articles"
              placeholderTextColor="#94a3b8"
              className="text-slate-400 w-full box-content border-2 border-slate-100 focus:border-sky-200 rounded-md pl-10 py-2 "
            />
            <View className="absolute left-2">
              {/* #94a3b8 is slate-400 */}
              <AntDesign color="#94a3b8" name="search1" size={20} />
            </View>
          </View>
        </View>
        <View className="flex w-full ">
          {articles.map((article, index) => (
            <TouchableOpacity
              key={article.key}
              onPress={() => router.push(`/article`)}
              className={`border-b-2 border-slate-100 ${
                index === articles.length - 1 ? "border-b-0" : ""
              }`}
              activeOpacity={1}
            >
              <View className="p-5 flex-row items-center justify-between">
                <View className="flex gap-y-2 w-44">
                  <View className="flex flex-row gap-x-2">
                    <Text className="text-xs">
                      {article.authors
                        .map((author) => `${author.name} ${author.surname[0]}.`)
                        .join(", ")}
                    </Text>
                  </View>
                  <Text className="text-lg font-bold">{article.title}</Text>
                  <View className="flex flex-row gap-x-2">
                    {article.tracks.map((track) => (
                      <View className="bg-sky-100 rounded-md p-1" key={track}>
                        <Text className="text-xs font-semibold">{track}</Text>
                      </View>
                    ))}
                  </View>
                  <Text className="text-xs text-slate-500">
                    {article.date} • 7 min read
                  </Text>
                </View>
                <Image
                  className="w-32 h-20 rounded-md"
                  source={{
                    uri: article.coverImgUrl,
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
