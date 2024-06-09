import { Stack, router } from "expo-router";
import { Button, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen name="(tabs)/profile" /> */}
      {/* <Stack.Screen
        name="index"
        options={{
          headerTitle: (props) => <Text>SciGather</Text>,
          headerRight: () => (
            <Button onPress={() => router.push("/signin")} title="Sign In" />
          ),
        }}
      /> */}
    </Stack>
  );
}
