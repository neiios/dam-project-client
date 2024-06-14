import { Text, View } from "react-native";

interface ErrorProps {
  error: string;
}

export default function Error({ error }: ErrorProps) {
  return (
    <View className="flex-1 justify-center items-center  dark:bg-neutral-900">
      <Text className="text-lg text-red-500">Error: {error}</Text>
    </View>
  );
}
