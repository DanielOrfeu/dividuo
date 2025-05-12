import { Text, TouchableOpacity, View } from "react-native";

import { useCategoryStore } from "@store/category";

import { DebtCategory } from "@interfaces/debt";

export default function SelectCategory({ navigation }) {
	const [setCategory] = useCategoryStore((state) => [state.setCategory]);

	return (
		<View className="flex-1 items-center justify-center w-full p-8 bg-primary">
			<Text className="text-center text-3xl text-white font-bold p-2">
				Selecione o tipo de uso
			</Text>
			<View className="flex-1 gap-16 justify-center">
				<TouchableOpacity
					onPress={() => {
						setCategory(DebtCategory.individual);
						navigation.navigate("MainMenuStack");
					}}
				>
					<View className="bg-white rounded-xl items-center justify-center p-4">
						<Text className="text-xl font-bold p-2 text-primary">
							Individual
						</Text>
						<Text className="text-sm font-medium p-2 text-center text-primary">
							No modo individual, você cria e gerencia todos os débitos a
							receber e a pagar. Adicione pessoas aos seus débitos para melhor
							organização.
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					disabled
					onPress={() => {
						setCategory(DebtCategory.coletivo);
						navigation.navigate("MainMenuStack");
					}}
				>
					<View className="bg-white rounded-xl items-center justify-center p-4">
						<Text className="text-xl font-bold p-2 text-gray-500">
							Coletivo (em desenvolvimento)
						</Text>
						<Text className="text-sm font-medium p-2 text-center text-gray-500">
							No modo coletivo, você tem as funcionalidades do modo individual
							com o acréscimo de vincular outras pessoas cadastradas no
							aplicativo, podendo ambas pessoas editarem os débitos em tempo
							real.
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}
