import { Feather, FontAwesome } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";

import CustomDrawer from "@components/customDrawer";

import Profile from "@screens/profile";
import EditPersons from "@screens/editPersons";
import MyMonthyBudget from "@screens/myMonthyBudget";

import DebtListTab from "@routes/debtListTab";

import { COLOR } from "@enums/colors";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useMonthlyBudgetStore } from "@store/monthlyBudget";

const { Navigator, Screen } = createDrawerNavigator();

export default function MainMenuStack() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const [loading, monthYearReference, monthlyBudgets] = useMonthlyBudgetStore(
    (state) => [
      state.loadingMonthlyBudget,
      state.monthYearReference,
      state.monthlyBudgets,
    ]
  );
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
        name="MonthlyBudget"
        component={MyMonthyBudget}
        options={{
          title: "Meu orçamento mensal",
          headerRight: () => {
            const monthHasData = monthlyBudgets.some(
              (mb) => mb.monthYear === monthYearReference
            );

            let action = null;

            if (monthHasData) {
              const monthIsLastWithData =
                monthlyBudgets.findIndex(
                  (mb) => mb.monthYear === monthYearReference
                ) ===
                monthlyBudgets.length - 1;

              action = monthIsLastWithData ? "edit" : null;
            } else {
              const monthYearList = monthlyBudgets.map((mb) => mb.monthYear);

              monthYearList.push(monthYearReference);

              monthYearList.sort((a, b) => {
                const [monthA, yearA] = a.split("/").map(Number);
                const [monthB, yearB] = b.split("/").map(Number);

                if (yearA !== yearB) return yearA - yearB;
                return monthA - monthB;
              });

              const selectWillBeLast =
                monthYearList.findIndex((mb) => mb === monthYearReference) ===
                monthYearList.length - 1;
              action = selectWillBeLast ? "create" : null;
            }

            return (
              <View className="p-4 flex-row gap-3">
                {action && !loading && (
                  <TouchableOpacity
                    onPress={() =>
                      action === "edit"
                        ? navigation.navigate("EditMonthlyBudget")
                        : navigation.navigate("CreateMonthlyBudget")
                    }
                  >
                    <Feather
                      name={action === "edit" ? "edit-3" : "plus-circle"}
                      size={24}
                      color={COLOR.white}
                    />
                  </TouchableOpacity>
                )}
              </View>
            );
          },
          drawerIcon: ({ color, size }) => (
            <SimpleLineIcons name="calendar" size={size} color={color} />
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
