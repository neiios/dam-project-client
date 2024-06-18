import React, { FC } from "react";
import { View, ScrollView, Text } from "react-native";
import Header from "@/components/header";
import Title from "@/components/title";
import Input from "@/components/input";
import Button from "@/components/button";

interface FormProps {
  message: string;
  setMessage: (text: string) => void;
  handleSubmit: () => void;
  MAX_MESSAGE_LENGTH: number;
}

const Form: FC<FormProps> = ({
  message,
  setMessage,
  handleSubmit,
  MAX_MESSAGE_LENGTH,
}) => {
  return (
    <ScrollView className="bg-white dark:bg-neutral-900">
      <View>
        <Header>
          <Title>Contact us</Title>
        </Header>
        <View className="p-5">
          <View className="mb-4">
            <Text className="text-base dark:text-gray-300">
              Hi! We're here to help you get the most out of this conference. If
              you have any questions or thoughts, please don't hesitate to reach
              out. Your curiosity is welcome!
            </Text>
          </View>
          <Input
            lines={10}
            length={MAX_MESSAGE_LENGTH}
            placeholder="Your questions, wishes, or criticisms"
            value={message}
            onChangeText={setMessage}
            style={{ textAlignVertical: "top" }}
            className="mb-5"
          />
          <Button title="Submit" onPress={handleSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Form;
