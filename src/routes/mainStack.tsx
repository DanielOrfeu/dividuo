import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as IconS from 'react-native-heroicons/solid'
import * as IconO from 'react-native-heroicons/outline'
import Inventory from '../screens/Inventory'
import Profile from '../screens/Profile'
import Product from '../screens/Product'
import Main from '../screens/Main'
import Sale from '../screens/Sale'
import { View } from 'react-native'

const Tab = createBottomTabNavigator();

export default function MainStack() {

    return (
        <Tab.Navigator 
            initialRouteName='Main'
            screenOptions={({route}) => ({
            headerShown: false ,
            tabBarShowLabel: false,
            tabBarIcon: ({focused, color, size}) => menuIcon(route, focused),
            tabBarStyle: {
                backgroundColor: '#0085FF',
                marginHorizontal: 10,
                marginBottom: 10,
                borderRadius: 50,
                height: 70,
            }
        })}>
            <Tab.Screen
                name='Profile'
                component={Profile}
            />
            <Tab.Screen
                name='Sale'
                component={Sale}
            />
            <Tab.Screen
                name='Main'
                component={Main}
            />
            <Tab.Screen
                name='Product'
                component={Product}
            />
            <Tab.Screen
                name='Inventory'
                component={Inventory}
            />
        </Tab.Navigator>    
    )
}

const menuIcon = (route, focused) => {
    let icon:any;
    let color = 'white'

    switch (route.name) {
        case 'Main':
            icon = focused 
                ? <IconO.HomeIcon color={color} size={30}/>
                : <IconS.HomeIcon color={color} size={30}/>
        break;
        case 'Profile':
            icon = focused 
                ? <IconO.UserIcon color={color} size={30}/>
                : <IconS.UserIcon color={color} size={30}/>
        break;
        case 'Sale':
            icon = focused 
                ? <IconO.CurrencyDollarIcon color={color} size={30}/>
                : <IconS.CurrencyDollarIcon color={color} size={30}/>
        break;
        case 'Product':
            icon = focused 
                ? <IconO.ShoppingBagIcon color={color} size={30}/>
                : <IconS.ShoppingBagIcon color={color} size={30}/>
        break;
        case 'Inventory':
            icon = focused 
                ? <IconO.ArchiveBoxIcon color={color} size={30}/>
                : <IconS.ArchiveBoxIcon color={color} size={30}/>
        break;
    }

  return (
    <>
        {icon}
    </>
  )

}