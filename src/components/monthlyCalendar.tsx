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

import { DailyExpense } from "@interfaces/monthlyBudget";

import { COLOR } from "@enums/colors";

import * as utils from "@utils/index";
import { ptBR } from "@utils/localeCalendar";

LocaleConfig.locales["pt-br"] = ptBR;
LocaleConfig.defaultLocale = "pt-br";

export default function MonthlyCalendar() {
  const [
    loading,
    selectedMonthlyBudget,
    monthYearReference,
    setMonthYearReference,
  ] = useMonthlyBudgetStore((state) => [
    state.loadingMonthlyBudget,
    state.selectedMonthlyBudget,
    state.monthYearReference,
    state.setMonthYearReference,
  ]);

  const [day, setday] = useState<DateData | null>(null);
  const [onEditing, setonEditing] = useState<boolean>(false);
  const [dailyExpenses, setdailyExpenses] = useState<DailyExpense[] | null[]>(
    []
  );

  useEffect(() => {
    setday(null);
    setdailyExpenses([]);
  }, [monthYearReference]);

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
          disabledByDefault={!selectedMonthlyBudget}
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
                    setMonthYearReference(newMYRef.format("MM/YYYY"));
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
                color: selectedMonthlyBudget ? COLOR.black : COLOR.gray,
              },
            };

            if (!selectedMonthlyBudget) {
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

            const foundDayReport = selectedMonthlyBudget?.daysReport.find(
              (dr) => dr.day === date?.day
            );

            if (foundDayReport) {
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
                  setdailyExpenses(
                    selectedMonthlyBudget?.daysReport.find(
                      (dr) => dr.day === date.day
                    )?.dailyExpenses || []
                  );
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
      {/* TODO: Editar lógica de criação de despesa */}
      {day && (
        <ActionModal
          title={`Despesas dia ${day?.day}`}
          actionText={"Criar despesa"}
          isVisible={!!day?.day}
          content={
            <FlatList
              className="w-full"
              data={dailyExpenses}
              renderItem={({ item, index }) => {
                return (
                  <View className="flex-row w-full justify-between bg-gray-200 rounded-3xl px-4 my-1">
                    <View className="flex-row flex-1 gap-2">
                      <Text className="self-center text-md font-semibold">
                        {item.description || "Sem descrição"}
                      </Text>
                      <View className="items-center justify">
                        {onEditing ? (
                          <Input
                            hideTitle
                            title={""}
                            value={
                              item.amount
                                ? utils.NumberToBRL(item.amount)
                                : null
                            }
                            onChangeText={(txt) => {
                              const value = +txt.replace(/[^0-9]/g, "") / 100;
                              setdailyExpenses((prev) => {
                                return prev.map((de, i) => {
                                  if (i === index) {
                                    return {
                                      ...de,
                                      amount: value,
                                    };
                                  }
                                });
                              });
                            }}
                          />
                        ) : (
                          <Text className="text-md font-semibold my-5">
                            {utils.NumberToBRL(item.amount)}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View className="items-center justify-evenly flex-row gap-1">
                      {!onEditing ? (
                        <>
                          <TouchableOpacity
                            onPress={() => {
                              setonEditing(true);
                            }}
                          >
                            <Feather
                              name="edit-3"
                              size={24}
                              color={COLOR.black}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setdailyExpenses(
                                dailyExpenses.filter((de, i) => i !== index)
                              );
                            }}
                          >
                            <Feather
                              name="trash-2"
                              size={24}
                              color={COLOR.red}
                            />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <TouchableOpacity
                            onPress={() => {
                              setdailyExpenses(
                                dailyExpenses.filter((de, i) => i !== index)
                              );
                            }}
                          >
                            <Feather
                              name="save"
                              size={24}
                              color={COLOR.primary}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setonEditing(false);
                            }}
                          >
                            <Feather
                              name="x-circle"
                              size={24}
                              color={COLOR.red}
                            />
                          </TouchableOpacity>
                        </>
                      )}
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
            setdailyExpenses([
              ...dailyExpenses,
              {
                amount: 2,
                description: `teste ${(Math.random() * 10).toFixed(2)}`,
              },
            ]);
          }}
        />
      )}
    </>
  );
}
