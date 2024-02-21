import { FontAwesome } from '@expo/vector-icons'
import CustomDrawer from '@components/CustomDrawer'
import { SimpleLineIcons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { createDrawerNavigator } from '@react-navigation/drawer'

import Profile from '@screens/Profile'
import EditPersons from '@screens/EditPersons'
import DebtListTab from '@routes/debtListTab'

const { Navigator, Screen } = createDrawerNavigator()

export default function DebtListStack() {    
    return (
        <Navigator 
            drawerContent={props => <CustomDrawer { ...props }/>}
            screenOptions={{
                drawerLabelStyle: {
                    marginLeft: -25
                },
                drawerActiveBackgroundColor: '#00ab8c',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#00ab8c',
                headerTintColor: '#fff',
                headerStyle: {
                    backgroundColor: '#00ab8c',
                },
            }}
        >
            <Screen 
                name='DebtListTab' 
                component={DebtListTab}
                options={{
                    title: 'Despesas',
                    drawerIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="account-cash" size={size} color={color} />
                    )
                }}
                
            />
            <Screen
                name='Profile'
                component={Profile}
                options={{
                    title: 'Meu perfil',
                    drawerIcon: ({color, size}) => (
                        <SimpleLineIcons name="user" size={size} color={color} />
                    )
                }}
            />
            <Screen
                name='EditPersons'
                component={EditPersons}
                options={{
                    title: 'Devedores/recebedores',
                    drawerIcon: ({color, size}) => (
                        <FontAwesome name="users" size={size} color={color} />
                    )
                }}
            />
        </Navigator>
    )
}