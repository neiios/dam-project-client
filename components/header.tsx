import { View } from "react-native";
import { HeaderProps } from "@/types";

export default function Header({ children }: HeaderProps) {
  return (
    <View className="p-5 border-b-2 border-slate-50 dark:border-gray-800">
      {children}
    </View>
  );
}
