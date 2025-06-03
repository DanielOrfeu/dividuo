import moment from "moment";
import { useEffect, useState } from "react";
import { Direction } from "react-native-modal";
import { DayProps } from "react-native-calendars/src/calendar/day";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { Feather } from "@expo/vector-icons";

import { useMonthlyBudgetStore } from "@store/monthlyBudget";

import Input from "@components/input";
import ActionModal from "@components/actionModal";

import { DailyExpense, MonthlyBudget } from "@interfaces/monthlyBudget";

import { COLOR } from "@enums/colors";
import { ACTIONS } from "@enums/actions";

import * as utils from "@utils/index";
import { ptBR } from "@utils/localeCalendar";

import { useBudgetDetails } from "@hooks/useMonthyBudgetDetails";

LocaleConfig.locales["pt-br"] = ptBR;
LocaleConfig.defaultLocale = "pt-br";

export default function MonthlyCalendar() {
  const [
    loading,
    selectedMonthlyBudget,
    monthYearReference,
    setMonthYearReference,
    getBudgetByMonthYear,
  ] = useMonthlyBudgetStore((state) => [
    state.loadingMonthlyBudget,
    state.selectedMonthlyBudget,
    state.monthYearReference,
    state.setMonthYearReference,
    state.getBudgetByMonthYear,
  ]);
  const { dailySpendingLimit } = useBudgetDetails(selectedMonthlyBudget);

  const [day, setday] = useState<DateData | null>(null);
  const [monthlyBudget, setmonthlyBudget] = useState<MonthlyBudget | null>(
    null
  );
  const [expense, setexpense] = useState<DailyExpense | null>(null);
  const [action, setaction] = useState<ACTIONS>(ACTIONS.none);
  const [indexToModify, setindexToModify] = useState<number>(-1);
  const [expenseModalOpen, setexpenseModalOpen] = useState<boolean>(false);
  const [deleteExpenseIndex, setdeleteExpenseIndex] = useState<number>(-1);

  useEffect(() => {
    setmonthlyBudget(selectedMonthlyBudget);
  }, [selectedMonthlyBudget]);

  return (
    <>
      {monthYearReference && (
        <Calendar
          className="w-screen rounded-xl bg-transparent p-4"
          headerStyle={{
            borderBottomWidth: 2,
            borderBottomColor: COLOR.primary,
            marginBottom: 10,
          }}
          theme={{
            monthTextColor: COLOR.black,
            textSectionTitleColor: COLOR.primary,
            arrowColor: COLOR.primary,
            calendarBackground: "transparent",
            textDisabledColor: COLOR.blue,
          }}
          current={moment(monthYearReference, "MM/YYYY").toISOString()}
          enableSwipeMonths
          hideExtraDays
          disabledByDefault={!monthlyBudget}
          markedDates={
            day && {
              [day.dateString]: {
                selected: true,
                selectedColor: COLOR.primary,
              },
            }
          }
          renderArrow={(direction: Direction) => {
            return (
              <Feather
                name={direction === "left" ? "arrow-left" : "arrow-right"}
                size={24}
                color={COLOR.primary}
                onPress={() => {
                  if (!loading) {
                    const newMYRef = moment(monthYearReference, "MM/YYYY");
                    if (direction === "left") {
                      newMYRef.subtract(1, "month");
                    } else {
                      newMYRef.add(1, "month");
                    }
                    getBudgetByMonthYear(newMYRef.format("MM/YYYY"));
                    setMonthYearReference(newMYRef.format("MM/YYYY"));
                    setday(null);
                  }
                }}
              />
            );
          }}
          dayComponent={(props: DayProps & { date?: DateData }) => {
            const { date, state } = props;
            interface StyleDayProps {
              touch: {
                borderColor: string;
                backgroundColor: string;
              };
              text: {
                color: string;
              };
            }

            const style: StyleDayProps = {
              touch: {
                borderColor: "",
                backgroundColor: "",
              },
              text: {
                color: monthlyBudget ? COLOR.black : COLOR.gray,
              },
            };

            if (!monthlyBudget) {
              return (
                <TouchableOpacity
                  className={`w-7 h-7 rounded-full flex-row justify-center items-center`}
                  style={{
                    ...style.touch,
                    borderWidth: 0,
                  }}
                >
                  <Text className={`text-sm font-semibold`} style={style.text}>
                    {date.day}
                  </Text>
                </TouchableOpacity>
              );
            }

            if (state === "today") {
              style.touch.borderColor = COLOR.primary;
              style.text.color = COLOR.primary;
            }

            const foundDayReport = monthlyBudget?.daysReport.find(
              (dr) => dr.day === date?.day
            );

            if (foundDayReport && foundDayReport.dailyExpenses.length > 0) {
              const amounts = foundDayReport.dailyExpenses.map(
                (item) => item.amount
              );
              const total = amounts.reduce((acc, val) => acc + val, 0);
              const exceededLimit = foundDayReport.budget < total;

              if (exceededLimit) {
                style.touch.borderColor = COLOR.red;
                style.text.color = COLOR.red;
              } else {
                style.touch.borderColor = COLOR.blue;
                style.text.color = COLOR.blue;
              }

              if (state !== "today") {
                style.text.color = COLOR.white;
                style.touch.backgroundColor = style.touch.borderColor;
                style.touch.borderColor = "";
              }
            }

            if (date?.dateString === day?.dateString) {
              style.text.color = COLOR.white;
              style.touch.backgroundColor = COLOR.primary;
            }

            return (
              <TouchableOpacity
                className={`w-7 h-7 rounded-full flex-row justify-center items-center`}
                style={{
                  ...style.touch,
                  borderWidth: state === "today" ? 2 : 0,
                }}
                onPress={() => {
                  setday(date);
                  if (
                    !monthlyBudget.daysReport.find((dr) => dr.day === date?.day)
                  ) {
                    setaction(ACTIONS.add);
                    setexpenseModalOpen(true);
                  }
                }}
              >
                <Text className={`text-sm font-semibold`} style={style.text}>
                  {date.day}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <ActionModal
        title={`Despesas dia ${day?.day}`}
        actionText={"Criar despesa"}
        isVisible={monthlyBudget?.daysReport.some((dr) => dr.day === day?.day)}
        content={
          <FlatList
            className="w-full"
            data={
              monthlyBudget?.daysReport.find((dr) => dr.day === day?.day)
                ?.dailyExpenses || []
            }
            renderItem={({ item, index }) => {
              return (
                <View className="flex-row w-full justify-between bg-gray-200 rounded-3xl px-4 my-1">
                  <View className="flex-row flex-1 gap-2">
                    <Text className="self-center text-md font-semibold">
                      {item.description || "Sem descrição"}
                    </Text>
                    <View className="items-center justify">
                      <Text className="text-md font-semibold my-5">
                        {utils.NumberToBRL(item.amount)}
                      </Text>
                    </View>
                  </View>
                  <View className="items-center justify-evenly flex-row gap-1">
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          const { description, amount } = item;
                          setexpense({
                            description,
                            amount,
                          });
                          setaction(ACTIONS.edit);
                          setexpenseModalOpen(true);
                          setindexToModify(index);
                        }}
                      >
                        <Feather name="edit-3" size={24} color={COLOR.black} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setindexToModify(index);
                          setaction(ACTIONS.remove);
                          setdeleteExpenseIndex(index);
                        }}
                      >
                        <Feather name="trash-2" size={24} color={COLOR.red} />
                      </TouchableOpacity>
                    </>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item, i) => item.description + i}
            ListEmptyComponent={
              <View className="items-center">
                <Text className="text-md">Sem despesesas registradas</Text>
              </View>
            }
          />
        }
        disableAction={false}
        closeModal={() => {
          setday(null);
        }}
        startAction={() => {
          setaction(ACTIONS.add);
          setindexToModify(-1);
          setexpenseModalOpen(true);
        }}
        cancelButtonText="Fechar"
      />

      <ActionModal
        title={`${action === ACTIONS.edit ? "Editar" : "Criar"} despesa`}
        actionText={action === ACTIONS.edit ? "Editar" : "Criar"}
        isVisible={expenseModalOpen}
        content={
          <View className="w-full">
            <Input
              title="Descrição"
              value={expense?.description}
              onChangeText={(description) => {
                setexpense({
                  ...expense,
                  description,
                });
              }}
            />
            <Input
              numeric
              title={"Valor"}
              value={
                expense?.amount ? utils.NumberToBRL(expense?.amount) : null
              }
              onChangeText={(txt) => {
                const value = +txt.replace(/[^0-9]/g, "") / 100;
                setexpense({
                  ...expense,
                  amount: value,
                });
              }}
            />
          </View>
        }
        disableAction={false}
        closeModal={() => {
          if (action === ACTIONS.add) {
            setday(null);
          }
          setexpenseModalOpen(false);
          setaction(ACTIONS.none);
          setexpense(null);
        }}
        startAction={() => {
          const dayHasReport = monthlyBudget?.daysReport.find(
            (dr) => dr.day === day?.day
          );

          const reportIndex =
            monthlyBudget?.daysReport.findIndex((dr) => dr.day === day?.day) ||
            -1;

          const dayReport = {
            day: day?.day,
            budget: dayHasReport ? dayHasReport.budget : dailySpendingLimit,
            dailyExpenses: [
              ...(monthlyBudget?.daysReport[reportIndex]?.dailyExpenses || []),
            ],
          };

          if (indexToModify !== -1) {
            dayReport.dailyExpenses[indexToModify] = {
              description: expense?.description,
              amount: expense?.amount,
            };
          } else {
            dayReport.dailyExpenses.push({
              description: expense?.description,
              amount: expense?.amount,
            });
          }

          setmonthlyBudget({
            ...monthlyBudget,
            daysReport: [
              ...monthlyBudget.daysReport.filter((dr) => dr.day !== day?.day),
              dayReport,
            ],
          });

          setexpenseModalOpen(false);
          setaction(ACTIONS.none);
          setexpense(null);
        }}
      />

      <ActionModal
        title="Remover despesa"
        actionText="Remover"
        type="alert"
        isVisible={deleteExpenseIndex !== -1}
        content={
          <View className="w-full ">
            <Text className="text-md text-center">
              Tem certeza que deseja remover essa despesa?
            </Text>
          </View>
        }
        closeModal={() => {
          setdeleteExpenseIndex(-1);
          setexpense(null);
        }}
        startAction={() => {
          setexpense(null);
          setmonthlyBudget({
            ...monthlyBudget,
            daysReport: monthlyBudget.daysReport.map((dr) => {
              if (dr.day === day?.day) {
                return {
                  ...dr,
                  dailyExpenses: dr.dailyExpenses.filter(
                    (_, i) => i !== deleteExpenseIndex
                  ),
                };
              }
              return dr;
            }),
          });
          setdeleteExpenseIndex(-1);
        }}
      />
    </>
  );
}
