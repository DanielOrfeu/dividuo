import { useState } from "react";
import DatePicker from "react-native-date-picker";
import { Text, View, TouchableOpacity } from "react-native";
import * as utils from "@utils/index";

interface OwnProps {
  title: string;
  value: Date;
  onPickDate(d: Date): void;
  w?: string;
}

type DatepickerInputProps = OwnProps;

export default function DatepickerInput({
  w,
  title,
  value,
  onPickDate,
}: DatepickerInputProps) {
  const [openDatePicker, setopenDatePicker] = useState<boolean>(false);
  const className = `my-2 w-${w ? w : "full"}`;

  return (
    <View className={className}>
      <Text className="text-primary font-medium text-sm">{title}</Text>

      <TouchableOpacity
        className="w-full h-10 justify-center rounded-xl px-4 border-2 border-gray-300 focus:border-primary"
        onPress={() => {
          setopenDatePicker(true);
        }}
      >
        {value ? (
          <Text>{utils.NormalizeDate(value)}</Text>
        ) : (
          <Text className="text-gray-400">{title}</Text>
        )}
      </TouchableOpacity>

      <DatePicker
        theme="light"
        modal
        title={title}
        mode="date"
        locale="pt-br"
        open={openDatePicker}
        date={value ? new Date(value) : new Date()}
        onConfirm={(date) => {
          onPickDate(date);
          setopenDatePicker(false);
        }}
        onCancel={() => {
          setopenDatePicker(false);
        }}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </View>
  );
}
