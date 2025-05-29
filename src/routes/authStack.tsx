import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";

import MainMenuStack from "@routes/mainMenuStack";

import About from "@screens/about";
import EditDebt from "@screens/editDebt";
import CreateDebt from "@screens/createDebt";
import DebtDetail from "@screens/debtDetail";
import SelectCategory from "@screens/selectCategory";
import EditDebtHistory from "@screens/editDebtHistory";
import CreateMonthlyBudget from "@screens/createMonthlyBudget";
import EditMonthlyBudget from "@screens/editMonthlyBudget";

import { COLOR } from "@enums/colors";

const { Navigator, Screen } = createStackNavigator();

export default function AuthStack() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();

  const defaultHeaderPattern = {
    headerStyle: {
      backgroundColor: COLOR.primary,
    },
    headerTintColor: COLOR.white,
    headerBackTitle: " ",
  };
  return (
    <Navigator>
      <Screen
        options={{
          headerShown: false,
        }}
        name="SelectCategory"
        component={SelectCategory}
      />
      <Screen
        options={{
          headerShown: false,
        }}
        name="MainMenuStack"
        component={MainMenuStack}
      />
      <Screen
        name="CreateDebt"
        component={CreateDebt}
        options={{
          title: "Criar débito",
          ...defaultHeaderPattern,
        }}
      />
      <Screen
        name="EditDebt"
        component={EditDebt}
        options={{
          title: "Editar débito",
          ...defaultHeaderPattern,
        }}
      />
      <Screen
        name="EditDebtHistory"
        component={EditDebtHistory}
        options={{
          title: "Histórico de edição",
          ...defaultHeaderPattern,
        }}
      />
      <Screen
        name="DebtDetail"
        component={DebtDetail}
        options={{
          title: "Detalhes do débito",
          ...defaultHeaderPattern,
          headerRight: () => {
            return (
              <View className="p-4 flex-row gap-3">
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("EditDebt");
                  }}
                >
                  <Feather name="edit-3" size={24} color={COLOR.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("EditDebtHistory");
                  }}
                >
                  <FontAwesome5 name="history" size={24} color={COLOR.white} />
                </TouchableOpacity>
              </View>
            );
          },
        }}
      />
      <Screen
        name="CreateMonthlyBudget"
        component={CreateMonthlyBudget}
        options={{
          title: "Criar orçamento diário",
          ...defaultHeaderPattern,
        }}
      />
      <Screen
        name="EditMonthlyBudget"
        component={EditMonthlyBudget}
        options={{
          title: "Editar orçamento diário",
          ...defaultHeaderPattern,
        }}
      />
      <Screen
        name="About"
        component={About}
        options={{
          title: "Sobre",
          ...defaultHeaderPattern,
        }}
      />
    </Navigator>
  );
}
