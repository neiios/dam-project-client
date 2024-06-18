import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { FC, useCallback, useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useFetchData } from "@/core/hooks";
import { Question } from "@/types";
import { formatDate } from "@/core/utils";
import Loader from "@/components/loader";
import Title from "@/components/title";
import Header from "@/components/header";
import { useAuth } from "@/app/context/AuthContext";
import { Link, router } from "expo-router";
import Button from "@/components/button";
import Error from "@/components/error";

export default function Questions() {
  const route = useRoute();
  const { articleId } = route.params as {
    articleId: string;
  };

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    data: questions,
    loading,
    error,
    refresh,
  } = useFetchData<Question[]>(
    `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/articles/${articleId}/questions`
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
    <View className="min-h-full bg-white">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Header>
            <Title>Contact us</Title>
          </Header>

          <View className="p-5">
            <View className="border-b-2 border-slate-50 flex gap-y-5 mb-5">
              <Text className="text-base dark:text-gray-300 mb-5">
                Have any questions about this article? Don't hesitate and reach
                out!
              </Text>
              <View>
                <Button
                  title="Ask a question"
                  onPress={() =>
                    router.push({
                      pathname: "questionForm",
                      params: { articleId: articleId },
                    })
                  }
                />
              </View>
            </View>
          </View>
          {questions && questions.length > 0 ? (
            questions.map((question, index) => <Text>{question.question}</Text>)
          ) : (
            <View className="p-5">
              <Text className="text-lg text-center text-slate-500">
                No questions available
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
