import moment from "moment";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import {
	Text,
	View,
	FlatList,
	TouchableOpacity,
	RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Loading from "@components/loading";
import Button from "@components/button";
import DropdownInput from "@components/dropdownInput";

import { useDebtStore } from "@store/debt";
import { usePersonStore } from "@store/person";

import { Debt } from "@interfaces/debt";

import { COLOR } from "@enums/colors";

import * as utils from "@utils/index";

export default function Home({ navigation, route }) {
	const [getDebtsToPay, getDebtsToReceive] = useDebtStore((state) => [
		state.getDebtsToPay,
		state.getDebtsToReceive,
	]);
	const [debtsToPay, debtsToReceive] = useDebtStore((state) => [
		state.debtsToPay,
		state.debtsToReceive,
	]);
	const [
		getDebtByID,
		loadDebtToPay,
		loadDebtToReceive,
		showPaidDebts,
		setShowPaidDebts,
	] = useDebtStore((state) => [
		state.getDebtByID,
		state.loadDebtToPay,
		state.loadDebtToReceive,
		state.showPaidDebts,
		state.setShowPaidDebts,
	]);
	const [persons, selectedPersonID, getPersonsByCreator, setSelectedPersonID] =
		usePersonStore((state) => [
			state.persons,
			state.selectedPersonID,
			state.getPersonsByCreator,
			state.setSelectedPersonID,
		]);
	const [totalToReceive, settotalToReceive] = useState<number>(0);
	const [totalToPay, settotalToPay] = useState<number>(0);

	const [totalPaid, settotalPaid] = useState<number>(0);
	const [totalReceived, settotalReceived] = useState<number>(0);

	const getDebts = async () => {
		getDebtsToPay();
		getDebtsToReceive();
	};

	useEffect(() => {
		settotalToPay(
			debtsToPay.reduce((acc, crr) => {
				return crr.valueRemaning > 0 ? acc + crr.valueRemaning : acc;
			}, 0)
		);

		settotalPaid(
			debtsToPay.reduce((acc, crr) => {
				return acc + crr.valuePaid;
			}, 0)
		);
	}, [debtsToPay]);

	useEffect(() => {
		settotalToReceive(
			debtsToReceive.reduce((acc, crr) => {
				return crr.valueRemaning > 0 ? acc + crr.valueRemaning : acc;
			}, 0)
		);

		settotalReceived(
			debtsToReceive.reduce((acc, crr) => {
				return acc + crr.valuePaid;
			}, 0)
		);
	}, [debtsToReceive]);

	useEffect(() => {
		getDebts();
	}, [showPaidDebts, selectedPersonID]);

	useEffect(() => {
		getPersonsByCreator();
		getDebts();
	}, []);

	const debtItem = (debt: Debt, personType: string) => {
		const color = !debt.active
			? "gray-500"
			: personType === "receiverID"
				? "primary"
				: "red-600";

		return (
			<TouchableOpacity
				className={`border-2 m-1 px-1 pb-3 rounded-xl items-center`}
				style={{
					borderColor: !debt.active
						? COLOR.gray
						: personType === "receiverID"
							? COLOR.primary
							: COLOR.red,
				}}
				onPress={() => {
					getDebtByID(debt.id);
					navigation.navigate("DebtDetail");
				}}
			>
				<Text className={`text-${color} font-semibold text-lg text-center`}>
					{debt.description}
				</Text>
				<Text className={`font-medium`}>
					Valor: {utils.NumberToBRL(debt.value)}
				</Text>
				<Text className={`font-medium`}>
					Pago: {utils.NumberToBRL(debt.valuePaid)}
				</Text>
				<Text className={`font-medium`}>
					Restante: {utils.NumberToBRL(debt.valueRemaning)}
				</Text>
				<Text className={`font-medium`}>
					Criado em: {utils.NormalizeDate(debt.createDate)}
				</Text>
				<Text
					className={`font-medium`}
					style={{
						color: !debt.active
							? COLOR.gray
							: moment().isAfter(moment(new Date(debt.dueDate)))
								? COLOR.red
								: COLOR.black,
					}}
				>
					Vencimento {utils.NormalizeDate(debt.dueDate)}
				</Text>
				{debt.settleDate && (
					<Text className={`font-medium`}>
						Quitado em: {utils.NormalizeDate(debt.settleDate)}
					</Text>
				)}
			</TouchableOpacity>
		);
	};

	const listToPay = () => {
		return (
			<View className="flex-1 items-center">
				<View className="flex-row w-full justify-center">
					<Text className={`text-red-600 text-lg font-semibold pb-1`}>
						A pagar
					</Text>
					<View className="w-12 flex absolute right-1 -top-5">
						<Button
							text={"Criar Débito"}
							onPress={() => {
								navigation.navigate("CreateDebt", { persontype: "debtor" });
							}}
							icon={
								<Ionicons name="add-circle" size={18} color={COLOR.white} />
							}
						/>
					</View>
				</View>
				{loadDebtToPay ? (
					<Loading />
				) : (
					<FlatList
						className="w-full"
						data={debtsToPay}
						renderItem={({ item }) => debtItem(item, "debtorID")}
						keyExtractor={(item) => item.id || item.description}
						refreshControl={
							<RefreshControl
								refreshing={loadDebtToPay}
								onRefresh={() => {
									getDebtsToPay();
								}}
							/>
						}
						ListEmptyComponent={
							<View className="items-center">
								<Text className="text-md">Sem débitos a pagar</Text>
							</View>
						}
					/>
				)}
			</View>
		);
	};

	const listToReceive = () => {
		return (
			<View className="flex-1 items-center">
				<View className="flex-row w-full justify-center">
					<Text className={`text-primary text-lg font-semibold pb-1`}>
						A receber
					</Text>
					<View className="w-12 flex absolute right-1 -top-5">
						<Button
							text={"Criar Débito"}
							onPress={() => {
								navigation.navigate("CreateDebt", { persontype: "receiver" });
							}}
							icon={
								<Ionicons name="add-circle" size={18} color={COLOR.white} />
							}
						/>
					</View>
				</View>
				{loadDebtToReceive ? (
					<Loading />
				) : (
					<FlatList
						className="w-full"
						data={debtsToReceive.sort((a, b) => {
							return Number(b.active) - Number(a.active);
						})}
						renderItem={({ item }) => debtItem(item, "receiverID")}
						keyExtractor={(item) => item.id || item.description}
						refreshControl={
							<RefreshControl
								refreshing={loadDebtToReceive}
								onRefresh={() => {
									getDebtsToReceive();
								}}
							/>
						}
						ListEmptyComponent={
							<View className="items-center">
								<Text className="text-md">Sem débitos a receber</Text>
							</View>
						}
					/>
				)}
			</View>
		);
	};

	return (
		<View className="flex-1 w-full p-4 pb-0">
			<View className="flex-1 w-full">
				<DropdownInput
					title={"Filtro por pessoa"}
					firstOptionLabel="Todos"
					firstOptionIsValid
					data={
						persons?.map((ps) => {
							return {
								label: ps.name,
								value: ps.id,
							};
						}) || []
					}
					selectedItem={selectedPersonID}
					setSelectedItem={setSelectedPersonID}
				/>
				<TouchableOpacity
					className="flex-row gap-2 items-center justify-center m-2"
					onPress={() => {
						setShowPaidDebts(!showPaidDebts);
					}}
				>
					<Checkbox
						value={showPaidDebts}
						color={showPaidDebts ? COLOR.primary : undefined}
						onValueChange={(v) => {
							setShowPaidDebts(v);
						}}
					/>
					<Text className="text-primary font-bold-">
						Exibir dívidas quitadas
					</Text>
				</TouchableOpacity>
				<View className="flex-1 flex-row w-full mt-2">
					{route.name === "DebtListToReceive" && listToReceive()}
					{route.name === "DebtListToPay" && listToPay()}
				</View>
			</View>
			<View className="w-full pt-2 mt-2">
				<View className="w-full items-center">
					{route.name === "DebtListToReceive" && (
						<View className="items-center">
							<Text>Total a receber: {utils.NumberToBRL(totalToReceive)}</Text>
							{showPaidDebts && (
								<Text>Total recebido: {utils.NumberToBRL(totalReceived)}</Text>
							)}
						</View>
					)}
					{route.name === "DebtListToPay" && (
						<View className="items-center">
							<Text>Total a pagar: {utils.NumberToBRL(totalToPay)}</Text>
							{showPaidDebts && (
								<Text>Total pago: {utils.NumberToBRL(totalPaid)}</Text>
							)}
						</View>
					)}
				</View>
			</View>
		</View>
	);
}
