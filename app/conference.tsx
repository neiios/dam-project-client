import { View, Text, Image, ScrollView } from "react-native";

const conference = {
  key: 1,
  title: "THE Conference",
  date: "2024-05-30",
  location: "Lisbon",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis labore nisi asperiores commodi distinctio odio nobis accusantium dicta, perspiciatis tempore.",
};

export default function ConferencePage() {
  return (
    <ScrollView>
      <View className="flex gap-4 bg-white items-center pt-4">
        <View>
          <Text className="text-xl">WELCOME TO</Text>
          <Text className="text-4xl font-bold">{conference.title}</Text>
        </View>
        <View>
          <Text className="bg-gray-200 p-2 text-lg font-bold w-screen">
            About
          </Text>
          <Text className="p-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit eaque
            incidunt facilis est tempore dicta asperiores, esse eum, laboriosam
            ipsam numquam dolores iure? Ipsa ex dicta dolorum atque? Libero
            laudantium quis, possimus repellat nobis ad minima iure voluptatum
            illum molestias sit rem eius deserunt dolores nam animi quae nulla
            sapiente.
          </Text>
        </View>
        <View>
          <Text className="bg-gray-200 p-2 text-lg font-bold w-screen">
            Featured Articles
          </Text>
        </View>
        <View>
          <View className="bg-gray-100 rounded-2xl p-4 mx-4">
            <Text className="text-xl">Article Title</Text>
            <Text>Author 1, Author 2</Text>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit,
              rem.
            </Text>
          </View>
        </View>
        <View>
          <Text className="bg-gray-200 p-2 text-lg font-bold">
            Where to find us
          </Text>
          <Image
            className="max-h-60 max-w-full"
            source={require("@/assets/images/example-map.png")}
          />
        </View>
      </View>
    </ScrollView>
  );
}
