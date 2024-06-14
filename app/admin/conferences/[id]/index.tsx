import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function ProfilePage() {
  const params = useLocalSearchParams();
  const conferenceId = params.id;

  return (
    <View>
      <Text>Form for: {conferenceId}</Text>
    </View>
  );
}
