import { Text } from "react-native";
import { HeaderProps } from "@/types";

export function Title({ children }: HeaderProps) {
  return <Text className="text-2xl font-bold">{children}</Text>;
}
