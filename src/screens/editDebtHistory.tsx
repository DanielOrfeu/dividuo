import { Fragment } from "react";
import { FlatList, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { useDebtStore } from "@store/debt";
import { useUserStore } from "@store/user";
import { EditHistory } from "@interfaces/debt";

import { COLOR } from "@enums/colors";

import * as utils from "@utils/index";

export default function EditDebtHistory({ navigation }) {
  const [debt] = useDebtStore((state) => [state.debt]);
  const [user] = useUserStore((state) => [state.user]);

  const formatInfo = (prop: string, item: any): string => {
    switch (prop) {
      case "description":
        return `Nome: ${item}`;
      case "value":
        return `Valor: ${utils.NumberToBRL(item)}`;
      case "dueDate":
        return `Data de vencimento: ${utils.NormalizeDate(item)}`;
      default:
        return `${prop}: ${item}`;
    }
  };

  const historyItem = (item: EditHistory) => {
    let ajustedItems = Object.keys(item.newInfo).filter((prop) => {
      return item.newInfo[prop] != item.oldInfo[prop];
    });

    return (
      <View className="w-full bg-gray-200 rounded-3xl p-4 my-1 flex-row">
        <View className="w-full items-center justify-center">
          <View className="w-full flex-row justify-center items-center mb-2">
            <View className="w-6/12 items-center">
              <Text className="font-semibold text-lg self-center">De</Text>
              {ajustedItems.map((prop) => {
                return (
                  <Fragment key={`${item.editDate}-${item.oldInfo[prop]}`}>
                    <Text className="text-md font-semibold">
                      {formatInfo(prop, item.oldInfo[prop])}
                    </Text>
                  </Fragment>
                );
              })}
            </View>
            <View className="items-center">
              <AntDesign name="arrowright" size={24} color={COLOR.primary} />
            </View>
            <View className="w-6/12 items-center">
              <Text className="font-semibold text-lg self-center">Para</Text>
              {ajustedItems.map((prop) => {
                return (
                  <Fragment key={`${item.editDate}-${item.newInfo[prop]}`}>
                    <Text className="text-md font-semibold">
                      {formatInfo(prop, item.newInfo[prop])}
                    </Text>
                  </Fragment>
                );
              })}
            </View>
          </View>
          {debt.category == 1 && (
            <Text className="text-md font-semibold">
              {`Editor: ${item.editorID == user.uid ? user.displayName || user.email : item.editorID}`}
            </Text>
          )}
          <Text className="text-md font-semibold">
            Data da edição: {utils.NormalizeDateTime(item.editDate)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 w-screen justify-center items-center p-4">
      <View className="w-full items-center flex-1">
        <Text className="text-primary font-bold text-xl mb-1">
          {debt.description}
        </Text>
        {debt.editHistory?.length > 0 ? (
          <View className="flex-1 w-full">
            <FlatList
              data={debt.editHistory.sort((a, b) => {
                return (
                  new Date(b.editDate).getTime() -
                  new Date(a.editDate).getTime()
                );
              })}
              renderItem={({ item, index }) => historyItem(item)}
              keyExtractor={(item) => item.editDate}
            />
          </View>
        ) : (
          <View className="flex-1 justify-center">
            <Text className="text-gray-500">
              Não há histórico de edição para esse débito
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
