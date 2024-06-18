import { View } from "react-native";
import { ReactNode } from "react";

export default function Wrapper({ children }: { children: ReactNode }) {
  return (
    <View className="relative h-full bg-white dark:bg-neutral-900">
      {children}
    </View>
  );
}
