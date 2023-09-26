import { createStackNavigator } from '@react-navigation/stack'
import DebtList from '../screens/DebtList'
import SelectCategory from '../screens/SelectCategory'
import CreateDebit from '../screens/CreateDebit'

const { Navigator, Screen } = createStackNavigator()

export default function AuthStack() {
    return (
        <Navigator>
            <Screen options={{
                headerShown: false
            }}
                name='SelectCategory' component={SelectCategory}
            />
            <Screen options={{
                headerShown: false
            }}
                name='DebtList' component={DebtList}
            />
            <Screen options={{
                headerShown: false
            }}
                name='CreateDebit' component={CreateDebit}
            />
        </Navigator>
    )
}