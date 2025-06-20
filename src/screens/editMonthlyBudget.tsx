import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

import Input from "@components/input";
import Button from "@components/button";
import Loading from "@components/loading";

import MonthlyBudgetService from "@services/monthlyBudget";

import { useMonthlyBudgetStore } from "@store/monthlyBudget";

import { MonthlyBudget, ReserveType } from "@interfaces/monthlyBudget";

import { COLOR } from "@enums/colors";
import { FIREBASE_ERROR } from "@enums/firebase";

import * as utils from "@utils/index";

export default function EditMonthlyBudget({ navigation }) {
  const [editLoading, seteditLoading] = useState<boolean>(false);

  const [
    loading,
    setSelectedMonthlyBudget,
    selectedMonthlyBudget,
    setMonthYearReference,
  ] = useMonthlyBudgetStore((state) => [
    state.loadingMonthlyBudget,
    state.setSelectedMonthlyBudget,
    state.selectedMonthlyBudget,
    state.setMonthYearReference,
  ]);
  const [monthlyBudget, setmonthlyBudget] = useState<MonthlyBudget>(
    selectedMonthlyBudget
  );

  return (
    <View className="flex-1 items-center p-4 bg-white w-screen">
      {loading ? (
        <View className="h-full justify-center">
          <Loading size={80} />
        </View>
      ) : (
        <>
          <Text className="text-3xl text-primary font-semibold">
            Novo orçamento mensal
          </Text>
          <Input
            title="Salário bruto"
            placeholder="Seu salário sem descontos"
            value={
              monthlyBudget.grossSalary
                ? utils.NumberToBRL(monthlyBudget.grossSalary)
                : null
            }
            numeric
            onChangeText={(txt) => {
              const value = +txt.replace(/[^0-9]/g, "") / 100;
              setmonthlyBudget({
                ...monthlyBudget,
                grossSalary: value,
              });
            }}
          />
          <Input
            title="Descontos"
            placeholder="Imposto de renda, inss, etc"
            value={
              monthlyBudget.deductions
                ? utils.NumberToBRL(monthlyBudget.deductions)
                : null
            }
            numeric
            onChangeText={(txt) => {
              const value = +txt.replace(/[^0-9]/g, "") / 100;
              setmonthlyBudget({
                ...monthlyBudget,
                deductions: value,
              });
            }}
          />
          <Input
            title="Despesas fixas"
            placeholder="Aluguel, luz, agua, etc"
            value={
              monthlyBudget.fixedExpenses
                ? utils.NumberToBRL(monthlyBudget.fixedExpenses)
                : null
            }
            numeric
            onChangeText={(txt) => {
              const value = +txt.replace(/[^0-9]/g, "") / 100;
              setmonthlyBudget({
                ...monthlyBudget,
                fixedExpenses: value,
              });
            }}
          />
          {monthlyBudget.reserveType === ReserveType.percentage ? (
            <Input
              title="Reserva (%)"
              placeholder="Porcentagem do salário bruto"
              value={
                monthlyBudget.reserveValue
                  ? `${monthlyBudget.reserveValue}`
                  : null
              }
              numeric
              onChangeText={(txt) => {
                const value = +txt.replace(/[^0-9]/g, "") / 100;
                setmonthlyBudget({
                  ...monthlyBudget,
                  reserveValue: value,
                });
              }}
            />
          ) : (
            <Input
              title="Reserva"
              placeholder="Valor fixo da reserva"
              value={
                monthlyBudget.reserveValue
                  ? utils.NumberToBRL(monthlyBudget.reserveValue)
                  : null
              }
              numeric
              onChangeText={(txt) => {
                const value = +txt.replace(/[^0-9]/g, "") / 100;
                setmonthlyBudget({
                  ...monthlyBudget,
                  reserveValue: value,
                });
              }}
            />
          )}
          <Text className="text-sm self-start text-primary font-semibold">
            Tipo de reserva
          </Text>
          <View className="flex-row p-2 w-full justify-center">
            <RadioButtonGroup
              selected={monthlyBudget.reserveType}
              size={22}
              containerStyle={{ gap: 10, with: "100%", flexDirection: "row" }}
              onSelected={(value) =>
                setmonthlyBudget({
                  ...monthlyBudget,
                  reserveType: value,
                })
              }
              radioBackground={COLOR.primary}
            >
              <RadioButtonItem
                value={ReserveType.percentage}
                label={<Text className="text-primary">Porcentagem</Text>}
              />
              <RadioButtonItem
                value={ReserveType.amount}
                label={<Text className="text-primary">Valor fixo</Text>}
              />
            </RadioButtonGroup>
          </View>
          <View className="flex-row w-full items-center">
            <Text className="text-sm text-primary font-semibold mr-1">
              Tipo de controle diário
            </Text>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Tipo de controle diário",
                  `Após o a criação do orçamento, o sistema calcula quantos reais por dia você pode gastar, para alcaçar o objetivo da reserva do mês. O controle diário pode ser feito de duas formas:\n\n1 - Fixado: No fixado, o sistema leva em conta o valor diário fixo o mês inteiro.\n\n2 - Baseado nos dias remanescentes: Com essa escolha, o sistema recalcula todo dia os valores disponíveis para gastar nos dias que faltam no mês\n\nOBS: Toda vez que houver a troca do tipo de controle diário, o sistema irá travar os dias anteriores ao atual.`,
                  [
                    {
                      text: "OK",
                      onPress: () => {},
                    },
                  ]
                );
              }}
              children={
                <Feather name="help-circle" size={24} color={COLOR.primary} />
              }
            />
          </View>
          <View className="flex-row p-2 w-full justify-center">
            <RadioButtonGroup
              selected={monthlyBudget.reserveType}
              size={22}
              containerStyle={{ gap: 10, with: "100%", flexDirection: "row" }}
              onSelected={(value) =>
                setmonthlyBudget({
                  ...monthlyBudget,
                  reserveType: value,
                })
              }
              radioBackground={COLOR.primary}
            >
              <RadioButtonItem
                value={ReserveType.percentage}
                label={<Text className="text-primary">Fixado</Text>}
              />
              <RadioButtonItem
                value={ReserveType.amount}
                label={
                  <Text className="text-primary">
                    Baseado nos dias restantes
                  </Text>
                }
              />
            </RadioButtonGroup>
          </View>
          <Input
            title="Reserva acumulada até o momento"
            disabled
            value={utils.NumberToBRL(monthlyBudget.totalAccumulatedReserve)}
            numeric
            onChangeText={(txt) => {
              const value = +txt.replace(/[^0-9]/g, "") / 100;
              setmonthlyBudget({
                ...monthlyBudget,
                reserveValue: value,
              });
            }}
          />

          <View className="m-4 w-full">
            <Button
              disabled={
                !monthlyBudget.grossSalary ||
                !monthlyBudget.deductions ||
                !monthlyBudget.fixedExpenses ||
                !monthlyBudget.reserveValue
              }
              loading={editLoading}
              text={"Editar orçamento mensal"}
              onPress={() => {
                seteditLoading(true);
                MonthlyBudgetService.EditMonthlyBudgetByID(monthlyBudget)
                  .then(() => {
                    setSelectedMonthlyBudget(monthlyBudget);
                    setMonthYearReference(monthlyBudget.monthYear);
                    Alert.alert(
                      "Sucesso!",
                      "Orçamento mensal editado com sucesso!",
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            navigation.goBack();
                          },
                        },
                      ]
                    );
                  })
                  .catch((err) => {
                    Alert.alert("Erro!", FIREBASE_ERROR[err.code] || err.code);
                  })
                  .finally(() => {
                    seteditLoading(false);
                  });
              }}
            />
          </View>
        </>
      )}
    </View>
  );
}
