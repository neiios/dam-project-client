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
  placeholder: string;
  statement: string;
}

const Form: FC<FormProps> = ({
  message,
  setMessage,
  handleSubmit,
  MAX_MESSAGE_LENGTH,
  statement,
  placeholder,
}) => {
  return (
    <ScrollView className="bg-white dark:bg-neutral-900">
      <View>
        <Header>
          <Title>Contact us</Title>
        </Header>
        <View className="p-5">
          <View className="mb-4">
            <Text className="text-base dark:text-gray-300">{statement}</Text>
          </View>
          <Input
            lines={10}
            length={MAX_MESSAGE_LENGTH}
            placeholder={placeholder}
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
