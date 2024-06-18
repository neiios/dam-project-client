import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { Request } from "@/types";

interface QuestionBoxProps {
  questions: Request[];
  title: string;
  confId: string;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({
  questions,
  title,
  confId,
}) => {
  const router = useRouter();

  return (
    <View className="w-full">
      {questions.length > 0 && (
        <>
          <Text className="text-sm font-bold mb-3">{title}</Text>
          <View className="flex w-full rounded-md border-2 border-neutral-100 bg-neutral-50 mb-5">
            {questions.map((question, index) => (
              <Link
                asChild
                key={question.id}
                href={{
                  pathname: `conferenceRequest`,
                  params: { requestId: question.id, confId: confId },
                }}
              >
                <Pressable>
                  <View
                    className={`p-4 border-slate-100 justify-between flex flex-row items-center ${
                      index === questions.length - 1 ? "" : "border-b-2"
                    }`}
                  >
                    <Text
                      className="text-sm dark:text-gray-200 font-semibold w-[85%]"
                      numberOfLines={1}
                    >
                      {question.question}
                    </Text>
                    <Entypo
                      className="color-black dark:color-white text-4xl"
                      name="chevron-right"
                      size={17}
                    />
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default QuestionBox;
