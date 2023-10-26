import { TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import { createStackNavigator } from '@react-navigation/stack'

import DebtListStack from '@routes/debtListStack'

import About from '@screens/About'
import EditDebt from '@screens/EditDebt'
import CreateDebt from '@screens/CreateDebt'
import DebtDetail from '@screens/DebtDetail'
import SelectCategory from '@screens/SelectCategory'
import EditDebtHistory from '@screens/EditDebtHistory'


const { Navigator, Screen } = createStackNavigator()

export default function AuthStack() {
    const navigation = useNavigation<any>();

    const defaultHeaderPattern = {
        headerStyle: {
            backgroundColor: '#00ab8c',
        },
        headerTintColor: '#fff'
    }                  
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
                    ...defaultHeaderPattern,
                }}
            />
            <Screen 
                name='EditDebt' 
                component={EditDebt}
                options={{
                    title: 'Editar débito',
                    ...defaultHeaderPattern,
                }}
            />
            <Screen 
                name='EditDebtHistory' 
                component={EditDebtHistory}
                options={{
                    title: 'Histórico de edição',
                    ...defaultHeaderPattern,
                }}
            />
            <Screen 
                name='DebtDetail' 
                component={DebtDetail}
                options={{
                    title: 'Detalhes do débito',
                    ...defaultHeaderPattern,
                    headerRight: () => {
                        return <View className='p-4 flex-row gap-3'>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('EditDebt')
                                }}
                            >
                                <Feather name="edit-3" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('EditDebtHistory')
                                }}
                            >
                                <FontAwesome5 name="history" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    }
                }}

            />
            <Screen 
                name='About' 
                component={About}
                options={{
                    title: 'Sobre',
                    ...defaultHeaderPattern
                }}
            />
        </Navigator>
    )
}