import clsx from "clsx";
import moment from "moment";
import { useEffect, useState } from "react";
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

interface OwnProps {
  monthlyBudget: MonthlyBudget | null;
  monthYearReference: string;
  setmonthlyBudget(monthlyBudget: MonthlyBudget): void;
  setMonthYearReference(myr: string): void;
}

interface StyleDayProps {
  touch: {
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
  };
  text: {
    color: string;
  };
}

type Props = OwnProps;

export default function MonthlyCalendar({
  monthlyBudget,
  monthYearReference,
  setmonthlyBudget,
  setMonthYearReference,
}: Props) {
  const { dailySpendingLimit } = useBudgetDetails(monthlyBudget);
  const [setLoadingMonthlyBudget] = useMonthlyBudgetStore((state) => [
    state.setLoadingMonthlyBudget,
  ]);
  const [day, setday] = useState<DateData | null>(null);
  const [expense, setexpense] = useState<DailyExpense | null>(null);
  const [action, setaction] = useState<ACTIONS>(ACTIONS.none);
  const [indexToModify, setindexToModify] = useState<number>(-1);
  const [expensesListModalOpen, setexpensesListModalOpen] =
    useState<boolean>(false);
  const [expenseDetailModalOpen, setexpenseDetailModalOpen] =
    useState<boolean>(false);
  const [deleteExpenseIndex, setdeleteExpenseIndex] = useState<number>(-1);

  const month = moment(monthYearReference, "MM/YYYY").format("MMMM");
  const year = moment(monthYearReference, "MM/YYYY").format("YYYY");
  const todayMYRef = moment(new Date()).format("MM/YYYY");
  const disabledFuture = moment(monthYearReference, "MM/YYYY").isSameOrAfter(
    moment(todayMYRef, "MM/YYYY")
  );

  return (
    <>
      <Calendar
        className="w-screen rounded-xl bg-transparent px-3"
        headerStyle={{
          borderBottomWidth: 2,
          borderBottomColor: COLOR.primary,
          marginBottom: 10,
        }}
        theme={{
          textSectionTitleColor: COLOR.primary,
          calendarBackground: "transparent",
          textDisabledColor: COLOR.gray,
          todayButtonTextColor: COLOR.primary,
          monthTextColor: "transparent",
          dayTextColor: monthlyBudget ? COLOR.black : COLOR.lightGray,
        }}
        current={moment(monthYearReference, "MM/YYYY").toISOString()}
        hideExtraDays
        hideArrows
        disabledByDefault={!monthlyBudget}
        renderHeader={() => {
          return (
            <View className="flex-row w-full justify-evenly items-center pb-4 gap-2">
              <TouchableOpacity
                className=" bg-primary rounded-full p-2"
                onPress={() => {
                  setLoadingMonthlyBudget(true);
                  const newMYRef = moment(monthYearReference, "MM/YYYY")
                    .subtract(1, "month")
                    .format("MM/YYYY");
                  setMonthYearReference(newMYRef);
                }}
              >
                <Feather name={"arrow-left"} size={20} color={COLOR.white} />
              </TouchableOpacity>
              <View className="flex-col justify-between items-center">
                <Text className="text-2xl text-primary font-bold pt-3">
                  {month.charAt(0).toUpperCase() + month.slice(1)}
                </Text>
                <Text className="text-lg text-primary">{year}</Text>
              </View>
              <TouchableOpacity
                disabled={disabledFuture}
                className={clsx(
                  "rounded-full p-2",
                  disabledFuture ? "bg-gray-500" : "bg-primary"
                )}
                onPress={() => {
                  setLoadingMonthlyBudget(true);
                  const newMYRef = moment(monthYearReference, "MM/YYYY")
                    .add(1, "month")
                    .format("MM/YYYY");
                  setMonthYearReference(newMYRef);
                }}
              >
                <Feather name={"arrow-right"} size={20} color={COLOR.white} />
              </TouchableOpacity>
            </View>
          );
        }}
        markedDates={
          day && {
            [day.dateString]: {
              selected: true,
              selectedColor: COLOR.primary,
            },
          }
        }
        dayComponent={(props: DayProps & { date?: DateData }) => {
          const { date, state } = props;
          const disabled = !monthlyBudget;
          const today = state === "today";

          let baseColor = disabled ? COLOR.gray : COLOR.primary;

          const foundDayReport = monthlyBudget?.daysReport.find(
            (dr) => dr.day === date?.day
          );

          if (!disabled) {
            if (foundDayReport && foundDayReport.dailyExpenses.length > 0) {
              const amounts = foundDayReport.dailyExpenses.map(
                (item) => item.amount
              );
              const total = amounts.reduce((acc, val) => acc + val, 0);
              const exceededLimit = total > dailySpendingLimit;

              if (exceededLimit) {
                baseColor = COLOR.red;
              } else {
                baseColor = COLOR.blue;
              }
            }
          }

          const style: StyleDayProps = {
            touch: {
              borderWidth: today ? 2 : 0,
              borderColor: today ? baseColor : "transparent",
              backgroundColor:
                today || disabled || !foundDayReport
                  ? "transparent"
                  : baseColor,
            },
            text: {
              color:
                today || disabled || !foundDayReport ? baseColor : COLOR.white,
            },
          };

          return (
            <TouchableOpacity
              className={`w-7 h-7 rounded-full flex-row justify-center items-center`}
              style={style.touch}
              disabled={disabled}
              onPress={() => {
                if (!disabled) {
                  setday(date);
                  if (
                    !monthlyBudget?.daysReport.find(
                      (dr) => dr.day === date?.day
                    )
                  ) {
                    setaction(ACTIONS.add);
                    setexpenseDetailModalOpen(true);
                  } else {
                    setexpensesListModalOpen(true);
                  }
                }
              }}
            >
              <Text className={`text-sm font-semibold`} style={style.text}>
                {date?.day}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <ActionModal
        title={`${action === ACTIONS.edit ? "Editar" : "Criar"} despesa`}
        actionText={action === ACTIONS.edit ? "Editar" : "Criar"}
        isVisible={expenseDetailModalOpen}
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
          setexpenseDetailModalOpen(false);
          setaction(ACTIONS.none);
          setexpense(null);
        }}
        startAction={() => {
          const dayHasReport = monthlyBudget?.daysReport.find(
            (dr) => dr.day === day?.day
          );

          if (!dayHasReport) {
            setmonthlyBudget({
              ...monthlyBudget,
              daysReport: [
                ...(monthlyBudget?.daysReport || []),
                {
                  day: day?.day,
                  dailyExpenses: [
                    {
                      description: expense?.description,
                      amount: expense?.amount,
                    },
                  ],
                },
              ],
            });
          } else {
            const reportIndex =
              monthlyBudget?.daysReport.findIndex(
                (dr) => dr.day === day?.day
              ) || -1;

            const dayReport = {
              day: day?.day,
              dailyExpenses: [
                ...(monthlyBudget?.daysReport[reportIndex]?.dailyExpenses ||
                  []),
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
          }

          setexpenseDetailModalOpen(false);
          setaction(ACTIONS.none);
          setexpense(null);
        }}
      />

      <ActionModal
        title={`Despesas dia ${day?.day}`}
        actionText={"Criar despesa"}
        isVisible={expensesListModalOpen}
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
                          setexpenseDetailModalOpen(true);
                          setindexToModify(index);
                        }}
                      >
                        <Feather name="edit-3" size={24} color={COLOR.black} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
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
          setexpensesListModalOpen(false);
        }}
        startAction={() => {
          setaction(ACTIONS.add);
          setindexToModify(-1);
          setexpenseDetailModalOpen(true);
        }}
        cancelButtonText="Fechar"
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
              if (dr.day !== day?.day) {
                return dr;
              }
              return {
                ...dr,
                dailyExpenses: dr.dailyExpenses.filter(
                  (_, i) => i !== deleteExpenseIndex
                ),
              };
            }),
          });
          setdeleteExpenseIndex(-1);
        }}
      />
    </>
  );
}
