import { View } from "react-native";
import { HeaderProps } from "@/types";

export function Header({ children }: HeaderProps) {
  return <View className="p-5 border-b-2 border-slate-50">{children}</View>;
}
