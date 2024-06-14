import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ToastAndroid } from "react-native";
import { router } from "expo-router";
import { useAuth } from "./context/AuthContext";
import Button from "@/components/button";
import Logo from "@/components/logo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    (async () => {
      const isAuthenticated = await AsyncStorage.getItem("jwtToken");
      if (isAuthenticated) {
        router.replace("/");
      }
    })();
  }, []);

  async function handleRegistration() {
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        ToastAndroid.show(
          "Registration request failed. Please try again!",
          ToastAndroid.SHORT
        );
        return;
      }

      const result: { token: string } = await response.json();
      await login(result.token);
      router.navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

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
      await login(result.token);
      router.navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View className="bg-white h-full items-center pt-20 gap-y-4">
      <Logo />
      <Text className="text-lg">
        {isRegister ? "Create your account" : "Login to your account"}
      </Text>
      <View className="flex flex-col gap-y-6 w-full px-5">
        {isRegister && (
          <TextInput
            className="text-slate-400 min-w-[200px] border-2 border-slate-100 focus:border-sky-200 rounded-lg px-4 py-2"
            placeholder="Name"
            onChangeText={setName}
          />
        )}
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
          <Button
            title={isRegister ? "Create account" : "Login"}
            onPress={isRegister ? handleRegistration : handleLogin}
          />
        </View>
        <View className="flex flex-row gap-x-1 justify-center">
          <Text>
            {isRegister ? "Already have an account?" : "Don't have an account?"}
          </Text>
          <Text
            className="text-sky-500"
            onPress={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Log in" : "Register"}
          </Text>
        </View>
      </View>
    </View>
  );
}
