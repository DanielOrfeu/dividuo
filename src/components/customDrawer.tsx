import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import UserService from "@services/user";
import { useUserStore } from "@store/user";
import { COLOR } from "@enums/colors";

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const [user] = useUserStore((state) => [state.user]);
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1">
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: COLOR.primary,
        }}
      >
        <View className="p-4">
          {user.displayName ? (
            <Text className="text-white text-xl font-semibold self-left">
              Olá, {user.displayName}
            </Text>
          ) : (
            <Text className="text-white text-2xl font-semibold self-center">
              DiviDUO
            </Text>
          )}
        </View>
        <View className="bg-white">
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View className="p-6 border-t-2 border-gray-200 justify-center">
        <TouchableOpacity
          className="flex-row gap-2 items-center"
          onPress={async () => {
            navigation.navigate("About");
          }}
        >
          <Feather name="info" size={24} color={COLOR.primary} />
          <Text className="text-primary">Sobre</Text>
        </TouchableOpacity>
        <View className="p-2" />
        <TouchableOpacity
          className="flex-row gap-2 items-center"
          onPress={async () => {
            await UserService.Logout();
          }}
        >
          <MaterialIcons name="logout" size={24} color={COLOR.primary} />
          <Text className="text-primary">Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
