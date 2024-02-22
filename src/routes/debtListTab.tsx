import clsx from 'clsx'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TouchableOpacity, Text, VirtualizedList, View } from 'react-native'

import DebtList from '@screens/DebtList'

const { Navigator, Screen } = createBottomTabNavigator();



const TabButton = (props) => {
    return (
        <TouchableOpacity 
            className='flex flex-1 items-center'
            onPress={() => {props.onPress()}}
        >
            <View className={clsx('flex flex-row flex-1 justify-center items-center mx-12 my-2', {
                'border-b-2 border-white': props.accessibilityState.selected
            })}>
                <MaterialCommunityIcons name={`cash-${props.name == 'A receber' ? 'plus' : 'minus'}`} size={24} color="white" />
                <Text className='text-white pl-1'>{props.name}</Text>
            </View>
        </TouchableOpacity>    
    )
}

export default function DebtListTab(){
    return (
        <Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#00ab8c',
                    height: 70
                }
            }}
        >
            <Screen 
                name='DebtListToReceive' 
                component={DebtList}
                options={{
                    headerShown: false,
                    title: 'Despesas a receber',
                    tabBarButton: (props) => (
                        <TabButton {...props} name={'A receber'}/>
                    )
                }}
            />
            <Screen 
                name='DebtListToPay' 
                component={DebtList}
                options={{
                    headerShown: false,
                    title: 'Despesas a pagar',
                    tabBarButton: (props) => (
                        <TabButton {...props} name={'A pagar'}/>
                    )
                }}
            />
        </Navigator>  
    )
}