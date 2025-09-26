import React, { useEffect, useMemo, useState } from "react";
import { Alert, Text, View, Image } from "react-native";
import moment from "moment";

import Input from "@components/input";
import Button from "@components/button";
import Loading from "@components/loading";
import DatepickerInput from "@components/datepickerInput";

import DebtService from "@services/debt";

import { useDebtStore } from "@store/debt";
import { useUserStore } from "@store/user";

import { FIREBASE_ERROR } from "@enums/firebase";

import { Debt, EditHistory, HistoryItem } from "@interfaces/debt";

import * as utils from "@utils/index";

export default function EditDebt({ navigation }) {
  const { user } = useUserStore();
  const {
    debt: debtCopy,
    getDebtByID,
    getDebtsToPay,
    getDebtsToReceive,
  } = useDebtStore();

  const [loading, setloading] = useState<boolean>(false);

  const [debt, setDebt] = useState<Debt | null>(debtCopy);

  const oldInfo = useMemo(
    () => ({
      description: debtCopy?.description || "",
      dueDate: debtCopy?.dueDate || "",
      value: debtCopy?.value || 0,
    }),
    [debtCopy]
  );

  const sameInfos = useMemo(() => {
    if (!debt) return true;

    return (
      oldInfo.description === debt.description &&
      oldInfo.dueDate === debt.dueDate &&
      oldInfo.value === debt.value
    );
  }, [debt, oldInfo]);

  useEffect(() => {
    setDebt(debtCopy);
  }, [debtCopy]);

  return (
    <View className="flex-1 items-center p-4 bg-white w-screen justify-center">
      <Image
        className="m-2"
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require("../../assets/images/transparent-icon.png")}
        style={{ width: 75, height: 75 }}
      />
      <Text className="text-3xl text-primary font-semibold">Editar débito</Text>
      <Input
        title="Descrição"
        value={debt.description}
        onChangeText={(description) => {
          setDebt({
            ...debt,
            description,
          });
        }}
      />
      <Input
        title="Valor do débito"
        value={debt.value ? utils.NumberToBRL(debt.value) : null}
        numeric
        onChangeText={(txt) => {
          const value = +txt.replace(/[^0-9]/g, "") / 100;
          setDebt({
            ...debt,
            value,
            valueRemaning: value,
          });
        }}
      />
      <DatepickerInput
        title="Data de vencimento"
        value={new Date(debt.dueDate)}
        onPickDate={(date) => {
          setDebt({
            ...debt,
            dueDate: date.toString(),
          });
        }}
      />
      <View className="w-full py-2">
        {loading ? (
          <Loading />
        ) : (
          <>
            <Button
              disabled={
                !debt.description || !debt.value || !debt.dueDate || sameInfos
              }
              text={"Editar débito"}
              onPress={async () => {
                setloading(true);
                const editHistory: EditHistory[] =
                  debt.editHistory?.length > 0 ? debt.editHistory : [];
                editHistory.push({
                  editDate: moment().format(),
                  editorID: user.uid,
                  oldInfo,
                  newInfo: {
                    description: debt.description,
                    value: debt.value,
                    dueDate: debt.dueDate,
                  },
                });

                const valueRemaning = debt.value - debt.valuePaid;
                await DebtService.EditDebtByID({
                  ...debt,
                  valueRemaning,
                  editHistory,
                  active: debt.valuePaid < debt.value,
                  settleDate:
                    debt.valuePaid < debt.value ? null : moment().format(),
                })
                  .then(() => {
                    if (user.uid === debt.receiverID) {
                      getDebtsToReceive();
                    } else {
                      getDebtsToPay();
                    }

                    let message = "Débito editado com sucesso!";
                    if (debt.valuePaid >= debt.value) {
                      message = `${message} \nNota: O valor pago é maior ou igual ao valor da dívida. Dívida automaticamente configurada como quitada.`;
                    }

                    Alert.alert("Sucesso!", message, [
                      {
                        text: "OK",
                        onPress: () => {
                          getDebtByID(debt.id);
                          navigation.goBack();
                        },
                      },
                    ]);
                  })
                  .catch((err) => {
                    Alert.alert(
                      `Erro ao editar débito`,
                      FIREBASE_ERROR[err.code] || err.code
                    );
                    setloading(false);
                  });
              }}
            />
          </>
        )}
      </View>
    </View>
  );
}
