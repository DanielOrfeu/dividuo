import { FontAwesome } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";

import CustomDrawer from "@components/customDrawer";

import Profile from "@screens/profile";
import EditPersons from "@screens/editPersons";
import MyMonthyBudget from "@screens/myMonthyBudget";

import DebtListTab from "@routes/debtListTab";

import { COLOR } from "@enums/colors";
import React from "react";

const { Navigator, Screen } = createDrawerNavigator();

const DebtListTabMemo = React.memo(DebtListTab);
const MyMonthyBudgetMemo = React.memo(MyMonthyBudget);
const ProfileMemo = React.memo(Profile);
const EditPersonsMemo = React.memo(EditPersons);

export default function MainMenuStack() {
  return (
    <Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        unmountOnBlur: false,
        drawerType: "slide",
        drawerLabelStyle: {
          marginLeft: -25,
        },
        drawerActiveBackgroundColor: COLOR.primary,
        drawerActiveTintColor: COLOR.white,
        drawerInactiveTintColor: COLOR.primary,
        headerTintColor: COLOR.white,
        headerStyle: {
          backgroundColor: COLOR.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Screen
        name="DebtListTab"
        component={DebtListTabMemo}
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
        component={MyMonthyBudgetMemo}
        options={{
          title: "Meu orçamento mensal",
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
        component={EditPersonsMemo}
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
