import { createStackNavigator } from '@react-navigation/stack'
import DebtList from '../screens/DebtList'
import SelectCategory from '../screens/SelectCategory'
import CreateDebit from '../screens/CreateDebit'
import DebtListStack from './debtListStack'
import DebtDetail from '../screens/DebtDetail'

const { Navigator, Screen } = createStackNavigator()

export default function AuthStack() {
    return (
        <Navigator>
            <Screen options={{
                headerShown: false
            }}
                name='SelectCategory' 
                component={SelectCategory}
            />
            <Screen options={{
                headerShown: false
            }}
                name='DebtListStack' 
                component={DebtListStack}
            />
            <Screen 
                name='CreateDebit' 
                component={CreateDebit}
                options={{
                    title: 'Criar débito',
                    headerStyle: {
                        backgroundColor: '#00ab8c',
                    },
                    headerTintColor: '#fff'
                }}
            />
            <Screen 
                name='DebtDetail' 
                component={DebtDetail}
                options={{
                    title: 'Detalhes do débito',
                    headerStyle: {
                        backgroundColor: '#00ab8c',
                    },
                    headerTintColor: '#fff'
                }}
            />
        </Navigator>
    )
}