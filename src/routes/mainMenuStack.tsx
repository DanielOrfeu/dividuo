import { FontAwesome } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";

import CustomDrawer from "@components/customDrawer";

import Profile from "@screens/profile";
import EditPersons from "@screens/editPersons";

import DebtListTab from "@routes/debtListTab";

import { COLOR } from "@enums/colors";

const { Navigator, Screen } = createDrawerNavigator();

export default function MainMenuStack() {
	return (
		<Navigator
			drawerContent={(props) => <CustomDrawer {...props} />}
			screenOptions={{
				drawerLabelStyle: {
					marginLeft: -25,
				},
				drawerActiveBackgroundColor: COLOR.primary,
				drawerActiveTintColor: COLOR.white,
				drawerInactiveTintColor: COLOR.primary,
				headerTintColor: COLOR.white,
				headerStyle: {
					backgroundColor: COLOR.primary,
				},
			}}
		>
			<Screen
				name="DebtListTab"
				component={DebtListTab}
				options={{
					title: "Despesas",
					drawerIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="account-cash"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Screen
				name="Profile"
				component={Profile}
				options={{
					title: "Meu perfil",
					drawerIcon: ({ color, size }) => (
						<SimpleLineIcons name="user" size={size} color={color} />
					),
				}}
			/>
			<Screen
				name="EditPersons"
				component={EditPersons}
				options={{
					title: "Devedores/recebedores",
					drawerIcon: ({ color, size }) => (
						<FontAwesome name="users" size={size} color={color} />
					),
				}}
			/>
		</Navigator>
	);
}
