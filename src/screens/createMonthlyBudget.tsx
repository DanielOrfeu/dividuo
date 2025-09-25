import moment from "moment";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

import { useBudgetDetails } from "@hooks/useMonthyBudgetDetails";

import Input from "@components/input";
import Button from "@components/button";
import Loading from "@components/loading";
import ActionModal from "@components/actionModal";
import OutlinedButton from "@components/outlinedButton";

import MonthlyBudgetService from "@services/monthlyBudget";

import { useUserStore } from "@store/user";
import { useMonthlyBudgetStore } from "@store/monthlyBudget";

import { MonthlyBudget, ReserveType } from "@interfaces/monthlyBudget";

import { COLOR } from "@enums/colors";
import { FIREBASE_ERROR } from "@enums/firebase";

import * as utils from "@utils/index";

export default function CreateMonthlyBudget({ navigation }) {
  const [createLoading, setcreateLoading] = useState<boolean>(false);
  const [openPrevModal, setopenPrevModal] = useState<boolean>(false);
  const [openEconomyModal, setopenEconomyModal] = useState<boolean>(false);
  const [previousMb, setpreviousMb] = useState<MonthlyBudget | null>(null);

  const previousMonthYear = moment(new Date(), "MM/YYYY")
    .subtract(1, "month")
    .format("MM/YYYY");
  const [user] = useUserStore((state) => [state.user]);
  const [
    loading,
    monthlyBudgets,
    setSelectedMonthlyBudget,
    getBudgetByMonthYear,
    monthYearReference,
    setMonthYearReference,
  ] = useMonthlyBudgetStore((state) => [
    state.loadingMonthlyBudget,
    state.monthlyBudgets,
    state.setSelectedMonthlyBudget,
    state.getBudgetByMonthYear,
    state.monthYearReference,
    state.setMonthYearReference,
  ]);
  const [monthlyBudget, setmonthlyBudget] = useState<MonthlyBudget>({
    creatorID: user.uid,
    monthYear: monthYearReference,
    grossSalary: 0,
    deductions: 0,
    fixedExpenses: 0,
    extraValuesToSpend: 0,
    extraValuesToReserve: 0,
    reserveValue: 0,
    reserveType: 0,
    totalAccumulatedReserve: 0,
    daysReport: [],
    hasPreviousMonthBudget: false,
    customDailySpendingLimit: 0,
  });

  const { totalAvaliableToSpend } = useBudgetDetails(previousMb);

  const checkPreviousMonthBudget = () => {
    const prev = monthlyBudgets.find(
      (mb) => mb?.monthYear === previousMonthYear
    );
    if (prev) {
      setpreviousMb(prev);
      setmonthlyBudget({
        ...monthlyBudget,
        hasPreviousMonthBudget: true,
        totalAccumulatedReserve: prev.totalAccumulatedReserve,
      });
      setopenPrevModal(true);
    }
  };

  useEffect(() => {
    checkPreviousMonthBudget();

    if (!previousMb) {
      getBudgetByMonthYear(previousMonthYear);
    }
  }, []);

  useEffect(() => {
    checkPreviousMonthBudget();
  }, [monthlyBudgets]);

  useEffect(() => {
    if (!openPrevModal && totalAvaliableToSpend) setopenEconomyModal(true);
  }, [openPrevModal]);

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
          <Input
            title="Reserva acumulada até o momento"
            disabled
            value={utils.NumberToBRL(monthlyBudget.totalAccumulatedReserve)}
            numeric
            onChangeText={(txt) => {
              const value = +txt.replace(/[^0-9]/g, "") / 100;
              setmonthlyBudget({
                ...monthlyBudget,
                totalAccumulatedReserve: value,
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
              loading={createLoading}
              text={"Criar orçamento mensal"}
              onPress={() => {
                setcreateLoading(true);
                MonthlyBudgetService.CreateMonthlyBudget(monthlyBudget)
                  .then(() => {
                    setSelectedMonthlyBudget(monthlyBudget);
                    setMonthYearReference(monthlyBudget.monthYear);
                    Alert.alert(
                      "Sucesso!",
                      "Orçamento mensal criado com sucesso!",
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
                    setcreateLoading(false);
                  });
              }}
            />
          </View>

          {openPrevModal && (
            <ActionModal
              title={"Orçamento anterior encontrado"}
              actionText={"Sim, usar"}
              isVisible={openPrevModal}
              content={
                <View>
                  <Text className="text-base text-center">
                    Usar informações básicas do orçamento anterior como base
                    para criação desse novo orçamento?
                  </Text>
                </View>
              }
              disableAction={false}
              closeModal={() => setopenPrevModal(false)}
              startAction={() => {
                setmonthlyBudget((prev) => {
                  const {
                    creatorID,
                    extraValuesToReserve,
                    extraValuesToSpend,
                    daysReport,
                    monthYear,
                  } = prev;
                  return {
                    ...previousMb,
                    creatorID,
                    extraValuesToReserve,
                    extraValuesToSpend,
                    daysReport,
                    monthYear,
                  };
                });
                setopenPrevModal(false);
              }}
            />
          )}

          {openEconomyModal && (
            <ActionModal
              hideCancelButton
              title={"Você economizou!"}
              actionText={"Colocar na reserva"}
              isVisible={openEconomyModal}
              content={
                <View className="w-full">
                  <Text className="text-base text-center">
                    Como você terminou o mês anterior com saldo positivo de{" "}
                    {utils.NumberToBRL(totalAvaliableToSpend)} sobre o quanto
                    podia gastar, agora você decide o que fazer com esse valor
                    extra:
                  </Text>
                  <OutlinedButton
                    type="info"
                    text="Colocar no saldo disponível para uso"
                    onPress={() => {
                      setmonthlyBudget({
                        ...monthlyBudget,
                        extraValuesToSpend: totalAvaliableToSpend,
                      });
                      setopenEconomyModal(false);
                    }}
                  />
                </View>
              }
              disableAction={false}
              closeModal={() => setopenEconomyModal(false)}
              startAction={() => {
                setmonthlyBudget({
                  ...monthlyBudget,
                  totalAccumulatedReserve:
                    totalAvaliableToSpend +
                    monthlyBudget.totalAccumulatedReserve,
                });
                setopenEconomyModal(false);
              }}
            />
          )}
        </>
      )}
    </View>
  );
}
