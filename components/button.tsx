import React from "react";
import { TouchableOpacity, Text } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export default function Button({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      className="bg-sky-700 py-2 px-4 rounded-xl border-4 border-white active:border-sky-200"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text className="text-white text-lg text-center font-bold">{title}</Text>
    </TouchableOpacity>
  );
}
