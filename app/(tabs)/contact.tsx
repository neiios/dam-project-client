import { View, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Header } from "@/components/header";
import { Title } from "@/components/title";

export default function Contact() {
  const route = useRoute();
  const { trackId } = route.params as {
    trackId: string;
  };

  return (
    <ScrollView className="bg-white">
      <View>
        <Header>
          <Title>Contact us</Title>
        </Header>
      </View>
    </ScrollView>
  );
}
