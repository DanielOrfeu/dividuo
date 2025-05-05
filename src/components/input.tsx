import { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { COLOR } from "@enums/colors";

interface OwnProps {
  title: string;
  placeholder?: string;
  value: string;
  isPassword?: boolean;
  numeric?: boolean;
  email?: boolean;
  disabled?: boolean;
  onChangeText(s: string): void;
  w?: string;
  hideTitle?: boolean;
  hasClearInput?: boolean;
  handleClearInput?: () => void;
}

type InputProps = OwnProps;

export default function Input({
  title,
  placeholder,
  value,
  isPassword,
  numeric,
  email,
  disabled,
  onChangeText,
  w,
  hideTitle,
  hasClearInput,
  handleClearInput,
}: InputProps) {
  const [hidePassword, sethidePassword] = useState<boolean>(isPassword);
  const width = `w-${w?.length > 0 ? w : "full"}`;

  return (
    <View className={`my-2 ${width}`}>
      {!hideTitle && (
        <Text className="text-primary font-medium text-sm pl-1">{title}</Text>
      )}
      <TextInput
        className={`w-full h-10 rounded-xl px-4 border-2 border-gray-300 focus:border-primary`}
        placeholder={placeholder ? placeholder : title}
        value={value}
        keyboardType={numeric ? "numeric" : email ? "email-address" : "default"}
        onChangeText={(txt) => {
          onChangeText(txt);
        }}
        secureTextEntry={hidePassword}
        editable={!disabled}
      />
      {(isPassword || hasClearInput) && (
        <View className="absolute right-3 bottom-2">
          <TouchableOpacity
            onPress={() => {
              if (isPassword) {
                sethidePassword(!hidePassword);
              } else {
                handleClearInput();
              }
            }}
          >
            {isPassword ? (
              hidePassword ? (
                <Entypo name="eye" size={20} color={COLOR.primary} />
              ) : (
                <Entypo name="eye-with-line" size={20} color={COLOR.primary} />
              )
            ) : (
              <AntDesign name="closecircle" size={24} color={COLOR.primary} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
