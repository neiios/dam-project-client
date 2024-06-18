import React from "react";
import { Pressable, Text, View } from "react-native";

interface RadioButtonProps {
  label: string;
  value: string;
  checked: boolean;
  onPress: () => void;
}

function RadioButton({ label, value, checked, onPress }: RadioButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
    >
      <View
        style={{
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: checked ? "#000" : "#ccc",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked ? (
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: "#000",
            }}
          />
        ) : null}
      </View>
      <Text style={{ marginLeft: 10 }}>{label}</Text>
    </Pressable>
  );
}

export default RadioButton;
