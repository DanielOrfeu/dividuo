import { ReactNode } from "react";
import Modal from "react-native-modal";
import { Text, View } from "react-native";

import Button from "@components/button";
import OutlinedButton from "@components/outlinedButton";

import { COLOR } from "@enums/colors";

interface OwnProps {
  title: string;
  type?: "default" | "alert" | "disabled" | "info" | "warning";
  actionText: string;
  isVisible: boolean;
  content: ReactNode;
  disableAction?: boolean;
  closeModal(): void;
  startAction(): void;
  hideCancelButton?: boolean;
  cancelButtonText?: string;
}

type ActionModalProps = OwnProps;

export default function ActionModal({
  title,
  type,
  actionText,
  isVisible,
  content,
  disableAction = false,
  closeModal,
  startAction,
  hideCancelButton = false,
  cancelButtonText,
}: ActionModalProps) {
  return (
    <Modal
      className="flex-1"
      isVisible={isVisible}
      backdropColor={COLOR.primary}
      backdropOpacity={0.6}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={200}
      animationOutTiming={200}
      backdropTransitionInTiming={200}
      backdropTransitionOutTiming={200}
    >
      <View className="flex-1 w-full items-center justify-center">
        <View className="bg-white rounded-xl w-11/12 items-center justify-center p-5">
          <Text className="text-xl text-primary font-semibold">{title}</Text>
          <View className="py-2 w-full justify-center items-center">
            {content}
          </View>
          <Button
            type={type}
            disabled={disableAction}
            text={actionText}
            onPress={() => {
              startAction();
            }}
          />
          <View className="p-1" />
          {!hideCancelButton && (
            <OutlinedButton
              text={cancelButtonText || "Cancelar"}
              onPress={() => {
                closeModal();
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
