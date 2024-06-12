import Button from "@/components/button";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ToastAndroid, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function checkAuth() {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      if (!jwtToken) {
        return;
      }

      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/users/verify`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 200) {
        router.replace("/profile");
      } else {
        await AsyncStorage.removeItem("jwtToken");
      }
    }

    checkAuth();
  }, []);

  async function handleLogin() {
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.status !== 200) {
        ToastAndroid.show("Invalid email or password", ToastAndroid.SHORT);
        return;
      }

      const result: { token: string } = await response.json();
      await AsyncStorage.setItem("jwtToken", result.token);
      router.replace("/profile");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View className="bg-white flex-1 items-center justify-center gap-y-8">
      <Text className="text-4xl font-bold">Login</Text>
      <View className="flex flex-col gap-y-6">
        <TextInput
          className="text-slate-400 min-w-[200px] border-2 border-slate-100 focus:border-sky-200 rounded-lg px-4 py-2"
          placeholder="Email"
          onChangeText={setEmail}
        />
        <TextInput
          className="text-slate-400 min-w-[200px] border-2 border-slate-100 focus:border-sky-200 rounded-lg px-4 py-2"
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <View>
          <Button title="Login" onPress={handleLogin} />
        </View>

        <View>
          <Text>Don't have an account?</Text>
          <Link className="text-sky-500" href="/register">
            Register
          </Link>
        </View>
      </View>
    </View>
  );
}
