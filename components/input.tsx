import { TextInput } from "react-native";

type InputProps = {
  length: number;
  placeholder: string;
  lines?: number;
};

export default function Input({ length, placeholder, lines }: InputProps) {
  return (
    <TextInput
      multiline
      numberOfLines={lines ? lines : 1}
      maxLength={length}
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      style={{ textAlignVertical: "top" }}
      className="text-slate-400 flex box-content border-2 border-slate-100 focus:border-sky-200 rounded-md p-2"
    />
  );
}
