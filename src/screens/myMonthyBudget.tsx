import moment from "moment";
import { useEffect } from "react";
import { View, Text } from "react-native";

import { useBudgetDetails } from "@hooks/useMonthyBudgetDetails";

// import MonthlyBudgetService from "@services/monthlyBudget";

import { useMonthlyBudgetStore } from "@store/monthlyBudget";

import Loading from "@components/loading";
import MonthlyCalendar from "@components/monthlyCalendar";
// import Button from "@components/button";

import * as utils from "@utils/index";

export default function MyMonthyBudget() {
  const [
    loading,
    // monthlyBudgets,
    selectedMonthlyBudget,
    getBudgetByMonthYear,
    monthYearReference,
    setMonthYearReference,
  ] = useMonthlyBudgetStore((state) => [
    state.loadingMonthlyBudget,
    // state.monthlyBudgets,
    state.selectedMonthlyBudget,
    state.getBudgetByMonthYear,
    state.monthYearReference,
    state.setMonthYearReference,
  ]);
  const {
    reserveAmount,
    monthlySpendingLimit,
    dailySpendingLimit,
    totalAvaliableToSpend,
    totalSpending,
    averageDailySpending,
  } = useBudgetDetails(selectedMonthlyBudget);

  useEffect(() => {
    if (!monthYearReference) {
      setMonthYearReference(moment(new Date()).format("MM/YYYY"));
    }
  }, []);

  useEffect(() => {
    getBudgetByMonthYear(monthYearReference);
  }, [monthYearReference]);

  const renderLine = (label: string, value: string | number) => {
    const val = typeof value === "number" ? utils.NumberToBRL(value) : value;
    return (
      <View className="w-full justify-between flex-row">
        <Text className={`text-lg`}>{label}</Text>
        <Text className={`text-lg font-semibold`}>{val}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 w-screen items-center p-4">
      {loading ? (
        <Loading />
      ) : (
        <>
          <MonthlyCalendar />

          {selectedMonthlyBudget ? (
            <>
              {renderLine("Salário bruto", selectedMonthlyBudget?.grossSalary)}
              {renderLine(
                "Descontos (impostos etc.)",
                selectedMonthlyBudget?.deductions
              )}
              {renderLine(
                "Despesas fixas",
                selectedMonthlyBudget?.fixedExpenses
              )}
              {renderLine(
                "Reserva acumulada",
                selectedMonthlyBudget?.totalAccumulatedReserve
              )}
              {renderLine("Reserva planejada para o mês", reserveAmount)}
              {renderLine("Limite de gastos do mês", monthlySpendingLimit)}
              {renderLine("Limite de gastos diários", dailySpendingLimit)}
              {renderLine("Valor disponível para gasto", totalAvaliableToSpend)}
              {renderLine("Total gasto até o momento", totalSpending)}
              {renderLine("Média diária de gastos", averageDailySpending)}
              {/* <View className="">
							<Button
								text="Adicionar despesa"
								type="info"
								onPress={function (): void {
									throw new Error("Function not implemented.");
								}} />
							<Button
								text="Adicionar Entrada"

								onPress={function (): void {
									throw new Error("Function not implemented.");
								}} />
							<Button
								text="Adicionar na reserva"

								onPress={function (): void {
									throw new Error("Function not implemented.");
								}} />
							<Button
								text="Editar orçamento mensal"
								type="warning"
								onPress={() => {
									MonthlyBudgetService.EditMonthlyBudgetByID({
										...selectedMonthlyBudget,
										daysReport: [
											{
												day: 11,
												budget: dailySpendingLimit,
												dailyExpenses: [{
													amount: 100,
													description: "Teste"
												}]
											},
											{
												day: 8,
												budget: dailySpendingLimit,
												dailyExpenses: [{
													amount: 20,
													description: "Teste2"
												},
												{
													amount: 31,
													description: "Teste3"
												}]
											}
										]
									})
								}} />
						</View> */}
            </>
          ) : (
            <>
              <Text className="text-2xl text-center font-bold text-primary">
                Sem informações de orçamento para o mês escolhido!
              </Text>
            </>
          )}
        </>
      )}
    </View>
  );
}
