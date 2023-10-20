import { createStackNavigator } from '@react-navigation/stack'
import DebtList from '../screens/DebtList'
import SelectCategory from '../screens/SelectCategory'
import CreateDebt from '../screens/CreateDebt'
import EditDebt from '../screens/EditDebt'
import DebtListStack from './debtListStack'
import DebtDetail from '../screens/DebtDetail'
import EditDebtHistory from '../screens/EditDebtHistory'

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
                name='CreateDebt' 
                component={CreateDebt}
                options={{
                    title: 'Criar débito',
                    headerStyle: {
                        backgroundColor: '#00ab8c',
                    },
                    headerTintColor: '#fff'
                }}
            />
            <Screen 
                name='EditDebt' 
                component={EditDebt}
                options={{
                    title: 'Editar débito',
                    headerStyle: {
                        backgroundColor: '#00ab8c',
                    },
                    headerTintColor: '#fff'
                }}
            />
            <Screen 
                name='EditDebtHistory' 
                component={EditDebtHistory}
                options={{
                    title: 'Histórico de edição',
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