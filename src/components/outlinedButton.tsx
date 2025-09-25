import { Text, TouchableOpacity } from "react-native";
import { Fragment, ReactNode, useEffect, useMemo, useState } from "react";
import { INVERTED_BUTTON_BG_COLOR, INVERTED_BUTTON_COLOR } from "@enums/colors";

interface OwnProps {
  w?: string;
  text?: string;
  icon?: ReactNode;
  type?: "default" | "info" | "alert" | "warning" | "disabled";
  disabled?: boolean;
  onPress(): void;
}

interface colorPallet {
  bgColor: string;
  color: string;
}

type OutlinedButtonProps = OwnProps;

export default function OutlinedButton({
  w,
  text,
  icon,
  type = "default",
  disabled,
  onPress,
}: OutlinedButtonProps) {
  const pallet = useMemo((): colorPallet => {
    if (disabled) {
      return {
        bgColor: INVERTED_BUTTON_BG_COLOR.disabled,
        color: INVERTED_BUTTON_COLOR.disabled,
      };
    }

    return {
      bgColor: INVERTED_BUTTON_BG_COLOR[type],
      color: INVERTED_BUTTON_COLOR[type],
    };
  }, [type, disabled]);

  const className = `w-${w ? w : "full"} rounded-xl p-3 my-1 justify-center items-center`;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        onPress();
      }}
      className={className}
      style={{
        backgroundColor: pallet.bgColor,
        borderColor: pallet.color,
        borderWidth: 2,
      }}
    >
      {icon ? (
        <Fragment>{icon}</Fragment>
      ) : text ? (
        <Text
          className="font-bold"
          style={{
            color: pallet.color,
          }}
        >
          {text}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
