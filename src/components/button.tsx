import React from "react";
import { TouchableOpacity, Text } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  bgColor?: string;
};

export default function Button({
  title,
  onPress,
  bgColor = "bg-sky-700",
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`${bgColor} py-2 px-4 rounded-xl w-full`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text className="text-white text-lg text-center font-bold">{title}</Text>
    </TouchableOpacity>
  );
}
