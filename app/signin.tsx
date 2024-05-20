import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

export default function SigninPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = () => {
    Alert.alert("Sign In", `Username: ${username}\nPassword: ${password}`);
  };

  const handleForgotPassword = () => {
    router.push("/resetPassword");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-2xl font-bold mb-6 text-center">Sign In</Text>
      <TextInput
        className="h-10 border border-gray-300 mb-3 px-2"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="h-10 border border-gray-300 mb-3 px-2"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text className="text-blue-500 text-right mb-3">Forgot Password?</Text>
      </TouchableOpacity>
      <Button title="Sign In" onPress={handleSignin} />
      <TouchableOpacity onPress={handleSignup}>
        <Text className="text-blue-500 text-center mt-3">
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
