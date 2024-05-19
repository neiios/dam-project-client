import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

const conferenceData = [
  {
    key: 1,
    title: "Much Conference",
    date: "2024-05-30",
    location: "Lisbon",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis labore nisi asperiores commodi distinctio odio nobis accusantium dicta, perspiciatis tempore.",
  },
  {
    key: 2,
    title: "Much Conference",
    date: "2024-05-30",
    location: "Lisbon",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis labore nisi asperiores commodi distinctio odio nobis accusantium dicta, perspiciatis tempore.",
  },
];

export default function Index() {
  const router = useRouter();

  return (
    <View className="bg-white p-4 gap-8">
      <Text className="text-2xl font-bold">
        Choose the conference you are interested in...
      </Text>
      <View className="gap-4">
        {conferenceData.map((conference) => (
          <View className="bg-gray-100 p-4 rounded-xl" key={conference.key}>
            <Text className="text-2xl">{conference.title}</Text>
            <View className="flex-row justify-between">
              <Text>{conference.date}</Text>
              <Text>{conference.location}</Text>
            </View>
            <Text>{conference.description}</Text>
            <Button
              title="Go to Details"
              onPress={() => router.push("/conference")}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
