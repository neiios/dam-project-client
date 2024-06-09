import { useRouter } from "expo-router";
import { Button, Text, View, ScrollView } from "react-native";

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
    <ScrollView>
      <View className="p-5 flex gap-y-5">
        <Text className="text-2xl font-bold">
          Choose the conference you are interested in...
        </Text>
        <View className="flex gap-y-5 w-full">
          {conferenceData.map((conference) => (
            <View
              className="bg-gray-200 p-4 rounded-xl flex gap-y-2"
              key={conference.key}
            >
              <Text className="text-xl font-bold">{conference.title}</Text>
              <View className="flex-row gap-x-2">
                <Text>{conference.date}</Text>
                <Text>{conference.location}</Text>
              </View>
              <Text>{conference.description}</Text>
              <View>
                <Button
                  title="Go to Details"
                  onPress={() => router.push("/conference")}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
