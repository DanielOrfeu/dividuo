import { createStackNavigator } from '@react-navigation/stack'
import Home from '../screens/Home'
import SelectUseType from '../screens/SelectUseType'
import CreateDebit from '../screens/CreateDebit'

const { Navigator, Screen } = createStackNavigator()

export default function AuthStack() {
    return (
        <Navigator>
            <Screen options={{
                headerShown: false  
            }}
                name='SelectUseType' component={SelectUseType}
            />
            <Screen options={{
                headerShown: false  
            }}
                name='Home' component={Home}
            />
            <Screen options={{
                headerShown: false  
            }}
                name='CreateDebit' component={CreateDebit}
            />
        </Navigator>
    )
}