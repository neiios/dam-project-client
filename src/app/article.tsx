import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useFetchData } from "@/core/hooks";
import { Article } from "@/types";
import { formatDate } from "@/core/utils";
import Loader from "@/components/loader";
import Title from "@/components/title";
import Header from "@/components/header";
import { useAuth } from "@/app/context/AuthContext";
import { router } from "expo-router";

interface SectionProps {
  title?: string;
  icon?: any;
  content?: string;
}

const Section: FC<SectionProps> = ({ title, icon, content }) => {
  return (
    <View className="mt-5">
      <Text className="text-lg font-bold mb-2">{title}</Text>
      <View className="flex flex-row gap-x-2 items-center pr-5">
        {icon && <AntDesign name={icon} size={20} />}
        <Text className="font-semibold">{content}</Text>
      </View>
    </View>
  );
};

export default function ArticleDetails() {
  const route = useRoute();
  const { articleId, confId } = route.params as {
    articleId: string;
    confId: string;
  };

  const { isAuthenticated, userRole } = useAuth();

  const {
    data: article,
    loading,
    error,
  } = useFetchData<Article>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/conferences/${confId}/articles/${articleId}`
  );

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

  const date = formatDate(article!.startDate, article!.endDate);

  return (
    <View className="min-h-full bg-white">
      <ScrollView>
        <View>
          <View>
            <Header>
              <Title>{article?.title}</Title>
            </Header>
            <View className="p-5 flex gap-y-5">
              <Section title="Abstract" content={article?.abstract} />
              <Section title="Date and time" content={date} icon="calendar" />
              <Section
                title="Speakers"
                content={article?.authors} // Assuming authors is an array
                icon="user"
              />
              <Section title="Room" content={article?.track.room} icon="find" />
              <Section
                title="Track"
                content={article?.track.name}
                icon="paperclip"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {isAuthenticated && userRole === "admin" ? (
        <View className="absolute bottom-8 right-8 flex items-center">
          <TouchableOpacity
            className="bg-sky-700 py-4 px-4 rounded-xl w-full"
            activeOpacity={0.8}
            onPress={() =>
              router.push(`/admin/conferences/${confId}/articles/${articleId}`)
            }
          >
            <MaterialIcons color="white" name="edit" size={32} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
