import { View } from "react-native";
import { ReactNode } from "react";

export interface WrapperProps {
  children: ReactNode;
}

export default function Wrapper({ children }: WrapperProps) {
  return (
    <View className="relative h-full bg-white dark:bg-neutral-900">
      {children}
    </View>
  );
}
