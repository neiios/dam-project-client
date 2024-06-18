import { Text } from "react-native";
import { HeaderProps } from "@/types";

export default function Title({ children }: HeaderProps) {
  return (
    <Text className="text-2xl font-bold dark:text-gray-300">{children}</Text>
  );
}
