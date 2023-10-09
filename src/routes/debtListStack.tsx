import { createDrawerNavigator } from '@react-navigation/drawer'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import CustomDrawer from '../components/CustomDrawer'
import DebtList from '../screens/DebtList'
import Profile from '../screens/Profile'
import EditPersons from '../screens/EditPersons';

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
                name='DebtList' 
                component={DebtList}
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