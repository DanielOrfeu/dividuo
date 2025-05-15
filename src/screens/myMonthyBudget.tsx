import moment from "moment";
import { COLOR } from "@enums/colors";
import { ptBR } from "@utils/localeCalendar";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
// import MonthlyBudgetService from "@services/monthlyBudget";
import { useMonthlyBudgetStore } from "@store/monthlyBudget";
import Loading from "@components/loading";
import * as utils from "@utils/index";
import { ReserveType } from "@interfaces/monthlyBudget";
// import Button from "@components/button";
import { DayProps } from "react-native-calendars/src/calendar/day";

LocaleConfig.locales["pt-br"] = ptBR;
LocaleConfig.defaultLocale = "pt-br";
export default function MyMonthyBudget() {
	const [
		loading,
		// monthlyBudgets,
		selectedMonthlyBudget,
		getBudgetByMonthYear
	] = useMonthlyBudgetStore((state) => [
		state.loadingMonthlyBudget,
		// state.monthlyBudgets,
		state.selectedMonthlyBudget,
		state.getBudgetByMonthYear
	]);
	const [day, setday] = useState<DateData | null>(null);
	const [otherValues, setotherValues] = useState<{
		netSalary: number;
		monthlySpendingLimit: number;
		dailySpendingLimit: number;
		reserveAmount: number
	}>({
		netSalary: 0,
		monthlySpendingLimit: 0,
		dailySpendingLimit: 0,
		reserveAmount: 0
	});

	const currentMonthYear = moment(new Date()).format('MM/YYYY')

	useEffect(() => {
		getBudgetByMonthYear(currentMonthYear)
	}, []);


	useEffect(() => {
		if (!selectedMonthlyBudget) return
		const { grossSalary, deductions, fixedExpenses, reserveType, monthYear, reserveValue } = selectedMonthlyBudget

		const netSalary = grossSalary - deductions - fixedExpenses
		let reserveAmount = 0
		if (reserveType === ReserveType.percentage) {
			reserveAmount = grossSalary * (reserveValue / 100)
		} else {
			reserveAmount = reserveValue
		}
		const monthlySpendingLimit = netSalary - reserveAmount

		setotherValues({
			netSalary,
			reserveAmount,
			monthlySpendingLimit,
			dailySpendingLimit: monthlySpendingLimit / moment(monthYear, "MM/YYYY").daysInMonth()
		})

	}, [selectedMonthlyBudget]);


	const renderLine = (label: string, value: string | number) => {
		const val = typeof value === 'number' ? utils.NumberToBRL(value) : value
		return (
			<View className="w-full justify-between flex-row">
				<Text className={`text-lg`}>{label}</Text>
				<Text className={`text-lg font-semibold`}>{val}</Text>
			</View>
		)
	}



	return (
		<View className="flex-1 w-screen  items-center p-4">
			{
				loading ? <Loading /> : (
					<>
						{
							selectedMonthlyBudget ? (
								<>
									{renderLine('Salário bruto', selectedMonthlyBudget?.grossSalary)}
									{renderLine('Descontos (impostos etc.)', selectedMonthlyBudget?.deductions)}
									{renderLine('Despesas fixas', selectedMonthlyBudget?.fixedExpenses)}
									{renderLine('Reserva planejada para o mês', otherValues.reserveAmount)}
								</>
							) :
								<Text className="text-2xl text-center font-bold text-primary">Sem informações de orçamento para o mês escolhido!
								</Text>
						}

						<Calendar className="w-screen border-2 border-gray-300 rounded-xl bg-transparent p-4"
							headerStyle={{
								borderBottomWidth: 2,
								borderBottomColor: COLOR.primary,
								marginBottom: 10,
							}}
							theme={{
								monthTextColor: COLOR.black,
								textSectionTitleColor: COLOR.primary,
								arrowColor: COLOR.primary,
								calendarBackground: 'transparent',
								textDisabledColor: COLOR.blue,
							}}
							current={new Date().toISOString()}
							enableSwipeMonths
							hideExtraDays
							markedDates={day && {
								[day.dateString]: {
									selected: true,
									selectedColor: COLOR.primary,
								},
							}}
							onDayPress={(day) => {
								setday(day);
							}}

							dayComponent={(props: DayProps & { date?: DateData }) => {
								const { date, state } = props;
								interface StyleDayProps {
									touch: {
										borderColor: string;
										backgroundColor: string
									},
									text: {
										color: string
									}
								}

								const style: StyleDayProps = {
									touch: {
										borderColor: '',
										backgroundColor: ''
									},
									text: {
										color: COLOR.black
									}
								}

								if (state === 'today') {
									style.touch.borderColor = COLOR.primary
									style.text.color = COLOR.primary
								}


								const foundDayReport = selectedMonthlyBudget?.daysReport.find((dr) => dr.day === date?.day)
								if (foundDayReport) {
									const amounts = foundDayReport.dailyExpenses.map(item => item.amount);
									const total = amounts.reduce((acc, val) => acc + val, 0);
									const exceededLimit = foundDayReport.budget < total

									if (exceededLimit) {
										style.touch.borderColor = COLOR.red
										style.text.color = COLOR.red
									} else {
										style.touch.borderColor = COLOR.blue
										style.text.color = COLOR.blue
									}

									if (state !== 'today') {
										style.text.color = COLOR.white
										style.touch.backgroundColor = style.touch.borderColor
										style.touch.borderColor = ''
									}
								}

								if (date?.dateString === day.dateString) {
									style.text.color = COLOR.white
									style.touch.backgroundColor = COLOR.primary
								}

								return (
									<TouchableOpacity
										className={`w-7 h-7 rounded-full flex-row justify-center items-center`}
										style={{
											...style.touch,
											borderWidth: state === 'today' ? 2 : 0,
										}}
										onPress={() => {
											setday(date);
										}}
									>
										<Text
											className={`text-sm font-semibold`}
											style={style.text}
										>
											{date.day}
										</Text>
									</TouchableOpacity>
								);
							}}
						/>
						{
							selectedMonthlyBudget && (
								<>
									{renderLine('Reserva acumulada', selectedMonthlyBudget?.totalAccumulatedReserve)}
									{renderLine('Limite de gastos do mês', otherValues.monthlySpendingLimit)}
									{renderLine('Limite de gastos diários', otherValues.dailySpendingLimit)}
								</>
							)
						}
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
												budget: otherValues.dailySpendingLimit,
												dailyExpenses: [{
													amount: 100,
													description: "Teste"
												}]
											},
											{
												day: 8,
												budget: otherValues.dailySpendingLimit,
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
				)
			}
		</View>
	);
}










