import { createStackNavigator } from '@react-navigation/stack'
import Home from '../screens/Home'

const { Navigator, Screen } = createStackNavigator()

export default function AuthStack() {
    return (
        <Navigator>
            <Screen options={{
                headerShown: false  
            }}
                name='Home' component={Home}
            />
        </Navigator>
    )
}