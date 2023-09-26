import { createStackNavigator } from '@react-navigation/stack'
import Login from '../screens/Login'
import SignUp from '../screens/SignUp'

const { Navigator, Screen } = createStackNavigator()

export default function NonAuthStack() {
    return (
        <Navigator>
            <Screen options={{
                headerShown: false  
            }}
                name='Login' component={Login}
            />
            <Screen options={{
                headerShown: false  
            }}
                name='SignUp' component={SignUp}
            />
        </Navigator>
    )
}