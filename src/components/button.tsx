import { Text, TouchableOpacity, View } from "react-native";
import { Fragment, ReactNode, useMemo } from "react";
import { BUTTON_BG_COLOR, BUTTON_COLOR, COLOR } from "@enums/colors";
import Loading from "./loading";

interface OwnProps {
  w?: string;
  text?: string;
  icon?: ReactNode;
  type?: "default" | "info" | "alert" | "warning" | "disabled";
  disabled?: boolean;
  loading?: boolean;
  onPress(): void;
}

interface colorPallet {
  bgColor: string;
  color: string;
}

type ButtonProps = OwnProps;

export default function Button({
  w,
  text,
  icon,
  type = "default",
  disabled,
  loading = false,
  onPress,
}: ButtonProps) {
  const pallet = useMemo((): colorPallet => {
    if (disabled || loading) {
      return {
        bgColor: BUTTON_BG_COLOR.disabled,
        color: BUTTON_COLOR.disabled,
      };
    }

    return {
      bgColor: BUTTON_BG_COLOR[type],
      color: BUTTON_COLOR[type],
    };
  }, [type, disabled, loading]);

  const className = `w-${w ? w : "full"} rounded-xl p-3 my-1 justify-center items-center`;
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      className={className}
      style={{
        backgroundColor: pallet.bgColor,
        borderColor: pallet.bgColor,
        borderWidth: 2,
      }}
    >
      {loading ? (
        <Loading size={20} color={COLOR.white} />
      ) : (
        <View className="flex-row gap-1 justify-center items-center">
          {icon && <View>{icon}</View>}
          {text && !loading && (
            <Text
              className="font-bold"
              style={{
                color: pallet.color,
              }}
            >
              {text}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
