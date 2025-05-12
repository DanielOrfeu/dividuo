import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";

export default function About() {
	const linkedName = (name: string, url: string) => {
		return (
			<TouchableOpacity
				onPress={() => {
					Linking.openURL(url);
				}}
			>
				<Text className="text-lg">{name}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<ScrollView className="flex-1 w-screen p-4">
			<View className="w-full items-center">
				<View className="pb-4 items-center">
					<Text className="font-bold text-3xl text-primary">DiviDUO</Text>
					<Text className="font-bold text-lg text-primary">
						Descomplicando dívidas
					</Text>
				</View>

				<View className="pb-4 items-center">
					<Text className="font-semibold text-lg">Versão</Text>
					<Text className="text-lg">1.0.0</Text>
				</View>

				<View className="pb-4 items-center">
					<Text className="font-semibold text-lg">Criado em</Text>
					<Text className="text-lg">18/09/2023</Text>
				</View>

				<View className="pb-4 items-center">
					<Text className="font-semibold text-lg text-center">
						Idealização, desenvolvimento e manutenção
					</Text>
					{linkedName(
						"Daniel Orfeu",
						"https://www.linkedin.com/in/danielorfeu/"
					)}
				</View>

				<View className="pb-4 items-center">
					<Text className="font-semibold text-lg">Correções de design</Text>
					{linkedName(
						"Daniel Orfeu",
						"https://www.linkedin.com/in/danielorfeu/"
					)}
					{linkedName(
						"Cíntia Silveira",
						"https://www.linkedin.com/in/cintiasilveira/"
					)}
					{linkedName("Joice Paz", "https://www.linkedin.com/in/joicepaz")}
				</View>

				<View className="pb-4 items-center">
					<Text className="font-semibold text-lg">Beta Testers</Text>
					<Text className="text-lg">Amanda Moraes</Text>
					{linkedName(
						"Cíntia Silveira",
						"https://www.linkedin.com/in/cintiasilveira/"
					)}
					{linkedName(
						"Wellington Jorge",
						"https://www.linkedin.com/in/wellington-jorge/"
					)}
					{linkedName("Joice Paz", "https://www.linkedin.com/in/joicepaz")}
				</View>
			</View>
		</ScrollView>
	);
}
