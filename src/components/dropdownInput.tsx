import { Picker } from "@react-native-picker/picker";
import { COLOR } from "@enums/colors";
import { Text, View, TouchableOpacity } from "react-native";

interface Item {
	label: string;
	value: string;
}

interface OwnProps {
	data: Item[];
	title: string;
	selectedItem: string;
	setSelectedItem(s: string): void;
	w?: string;
	firstOptionLabel?: string;
	firstOptionIsValid?: boolean;
}

type DropdownInputProps = OwnProps;

export default function DropdownInput({
	data,
	title,
	selectedItem,
	setSelectedItem,
	w,
	firstOptionLabel,
	firstOptionIsValid,
}: DropdownInputProps) {
	const className = `w-${w ? w : "full"}`;

	const buildList = () => {
		const list = [
			<Picker.Item
				key={firstOptionLabel || `Selecione...`}
				label={firstOptionLabel || `Selecione...`}
				value={null}
				style={{
					color: firstOptionIsValid ? COLOR.black : COLOR.lightGray,
				}}
			/>,
		];
		if (data?.length > 0) {
			data.forEach((d) => {
				list.push(
					<Picker.Item
						key={d.value}
						label={d.label}
						value={d.value}
						style={{
							color: COLOR.black,
						}}
					/>
				);
			});
		}
		return list;
	};

	return (
		<View className={className}>
			<Text className="text-primary font-medium text-sm">{title}</Text>
			<TouchableOpacity className="w-full h-10 justify-center rounded-xl border-2 border-gray-300 focus:border-primary">
				<Picker
					placeholder=""
					selectedValue={selectedItem}
					onValueChange={(itemValue) => {
						setSelectedItem(itemValue);
					}}
					enabled={data?.length > 0}
				>
					{data?.length > 0 ? (
						buildList()
					) : (
						<Picker.Item
							enabled={false}
							label={`Sem resultados para ${title}`}
							value={""}
							style={{
								color: COLOR.lightGray,
							}}
						/>
					)}
				</Picker>
			</TouchableOpacity>
		</View>
	);
}
