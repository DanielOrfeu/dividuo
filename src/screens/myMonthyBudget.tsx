import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment";

import { MonthlyBudget } from "@interfaces/monthlyBudget";

import { useMonthlyBudgetStore } from "@store/monthlyBudget";
import { useUserLastBudgetStore } from "@store/userLastBudget";

import Button from "@components/button";
import MonthlyCalendar from "@components/monthlyCalendar";
import Loading from "@components/loading";

import { COLOR } from "@enums/colors";

import * as utils from "@utils/index";

import { useBudgetDetails } from "@hooks/useMonthyBudgetDetails";

export default function MyMonthlyBudget({ navigation }) {
  const {
    monthYearReference,
    setMonthYearReference,
    getMonthyBudgetByMonthYear,
    setSelectedMonthlyBudget,
    loadingMonthlyBudget,
    setLoadingMonthlyBudget,
  } = useMonthlyBudgetStore();
  const { userLastBudget, getUserLastBudgetByCreator } =
    useUserLastBudgetStore();

  const [monthlyBudget, setmonthlyBudget] = useState<MonthlyBudget | null>(
    null
  );
  const [isError, setisError] = useState<boolean>(false);
  const { reserveAmount, remainingDaysAverageSpending, totalAvaliableToSpend } =
    useBudgetDetails(monthlyBudget);

  const { isAbleToCreate = false, isAbleToEdit = false } = useMemo(() => {
    if (isError) {
      return {
        isAbleToCreate: false,
        isAbleToEdit: false,
      };
    }

    const today = moment().format("MM/YYYY");
    const selectedMonthYear = moment(monthYearReference, "MM/YYYY");
    const lastBudgetCreated = userLastBudget?.reference
      ? moment(userLastBudget.reference, "MM/YYYY")
      : null;

    let isAbleToCreate =
      !monthlyBudget &&
      (!userLastBudget?.reference ||
        (selectedMonthYear.isAfter(lastBudgetCreated) &&
          selectedMonthYear.isSameOrBefore(today)));

    let isAbleToEdit =
      monthlyBudget && selectedMonthYear.isSame(lastBudgetCreated);

    return {
      isAbleToCreate,
      isAbleToEdit,
    };
  }, [monthlyBudget, monthYearReference, userLastBudget, isError]);

  const getBudget = () => {
    setLoadingMonthlyBudget(true);
    getMonthyBudgetByMonthYear(monthYearReference)
      .then((budget) => {
        setisError(false);
        setmonthlyBudget(budget);
        setSelectedMonthlyBudget(budget);
      })
      .catch((err) => {
        setisError(true);
        setmonthlyBudget(null);
        setSelectedMonthlyBudget(null);
      })
      .finally(() => {
        setLoadingMonthlyBudget(false);
      });
  };

  useEffect(() => {
    getBudget();
  }, [monthYearReference]);

  useEffect(() => {
    setLoadingMonthlyBudget(true);
    if (!monthYearReference) {
      setMonthYearReference(moment(new Date()).format("MM/YYYY"));
    }
    getUserLastBudgetByCreator();
  }, []);

  return (
    <View className="flex-1 w-screen justify-evenly items-center py-4">
      {loadingMonthlyBudget ? (
        <Loading size={50} />
      ) : (
        <>
          <View className="mid flex-col items-center">
            {monthYearReference && (
              <MonthlyCalendar
                monthlyBudget={monthlyBudget}
                monthYearReference={monthYearReference}
                setmonthlyBudget={setmonthlyBudget}
                setMonthYearReference={(my) => {
                  setMonthYearReference(my);
                }}
              />
            )}
          </View>
          <View className="actions p-4 flex-1 items-center justify-evenly w-full">
            {monthlyBudget && (
              <>
                <Text className="text-lg text-center text-black">
                  Você ainda pode gastar{" "}
                  <Text className="px-4 font-semibold color-primary">
                    {utils.NumberToBRL(totalAvaliableToSpend)}
                  </Text>{" "}
                  esse mês ({utils.NumberToBRL(remainingDaysAverageSpending)}{" "}
                  por dia contando a partir de hoje) se quiser adicionar os{" "}
                  {utils.NumberToBRL(reserveAmount)} planejados à sua reserva.
                </Text>
                <Text className="text-lg text-center text-black">
                  Até o momento você juntou{" "}
                  <Text className="px-4 font-semibold color-primary">
                    {utils.NumberToBRL(monthlyBudget.totalAccumulatedReserve)}
                  </Text>{" "}
                  parabéns!
                </Text>
                <View className="flex-col items-center w-full">
                  <Button
                    type="default"
                    text="Ver mais detalhes"
                    onPress={() => {}}
                  />
                  {isAbleToEdit && (
                    <>
                      <Button
                        type="info"
                        text="Editar orçamento"
                        onPress={() => {}}
                      />
                      <Button
                        type="alert"
                        text="Deletar orçamento"
                        onPress={() => {}}
                      />
                    </>
                  )}
                </View>
              </>
            )}

            {isAbleToCreate && (
              <>
                <Text className="text-lg text-center text-gray-500 mb-4">
                  Sem informações de orçamento para o mês escolhido
                </Text>

                <Button
                  text="Criar orçamento"
                  w="w-1/2"
                  icon={
                    <Feather
                      name={"plus-circle"}
                      size={20}
                      color={COLOR.white}
                    />
                  }
                  onPress={() => {
                    navigation.navigate("CreateMonthlyBudget");
                  }}
                ></Button>
              </>
            )}

            {!isAbleToCreate && !monthlyBudget && (
              <>
                {moment(monthYearReference, "MM/YYYY").isBefore(
                  moment(new Date(), "MM/YYYY")
                ) ? (
                  <Text className="text-lg text-center">
                    Não é possível criar o orçamento de {monthYearReference}{" "}
                    pois já existe um ou mais orçamentos a frente desse mês
                  </Text>
                ) : (
                  <Text className="text-lg text-center">
                    É possível apenas criar orçamentos passados ou presente
                  </Text>
                )}
              </>
            )}

            {isError && (
              <Text className="text-lg text-center text-red-500">
                Ocorreu um erro ao carregar o orçamento
              </Text>
            )}
          </View>
        </>
      )}
    </View>
  );
}
