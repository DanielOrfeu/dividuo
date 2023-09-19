import { createStackNavigator } from '@react-navigation/stack'
import Login from '../screens/Login'

const { Navigator, Screen } = createStackNavigator()

export default function NonAuthStack() {
    return (
        <Navigator>
            <Screen options={{
                headerShown: false  
            }}
                name='Login' component={Login}
            />
        </Navigator>
    )
}