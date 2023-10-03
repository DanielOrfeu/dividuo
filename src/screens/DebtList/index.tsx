import { useEffect, useState } from 'react';
import { Alert, Text, View, FlatList,  TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Debt, DebtCategory } from '../../@types/Debt';
import DebtService from '../../services/Debt';
import UserService from '../../services/User';
import * as Utils from '../../Utils';

import { useCategoryStore } from '../../store/CategoryStore';
import Button from '../../components/Button';
import InvertedButton from '../../components/InvertedButton';

export default function Home({ navigation }) {
    const [category] = useCategoryStore((state) => [
        state.category
    ])
    const [debts, setdebts] = useState<Debt[]>([]);
    
    useEffect(() => {
        const subscribe = 
            firestore()
            .collection('Debts')
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map((d) => {
                    return {
                        id: d.id,
                        ...d.data()
                    }
                }) as Debt[]
                setdebts(data)
            })
            return () => subscribe();
    }, []);

    const debtItem = (debt: Debt, personType: string) => {
        const color = personType === 'receiverID' ? 'primary' : 'red-600'
        const bgColor = personType === 'receiverID' ? 'primary' : 'red-500'

        const dateExpired = new Date(debt.dueDate).getTime() <= new Date().getTime() ? `text-red-600` : ''

        return (
            <View className={`border-2 border-${bgColor} m-1 px-3 pb-3 rounded-xl items-center`}>
                <Text className={`text-${color} font-semibold text-lg`}>{debt.description}</Text>
                <Text className={`font-medium`}>Valor: {Utils.NumberToBRL(debt.value)}</Text>
                <Text className={`font-medium`}>Pago: {Utils.NumberToBRL(debt.valuePaid)}</Text>
                <Text className={`font-medium`}>Restante: {Utils.NumberToBRL(debt.valueRemaning)}</Text>
                {
                    debt.createDate &&
                    <Text className={`font-medium`}>Criado em {Utils.NormalizeDate(debt.createDate)}</Text>
                }
                {
                    debt.dueDate &&
                    <Text className={`${dateExpired} font-medium`}>Vencimento {Utils.NormalizeDate(debt.dueDate)}</Text>
                }
            </View>
        )
    }

    const debtlist = (personType: string) => {
        const color = personType === 'receiverID' ? 'primary' : 'red-600'

        return (
            <View className='flex-1 items-center'>
                <Text className={`text-${color} text-lg font-semibold`}>{personType === 'receiverID' ? 'A receber' : 'A pagar'}</Text>
                <FlatList
                    className='w-full'
                    data={debts}
                    renderItem={({item}) => debtItem(item, personType)}
                    keyExtractor={item => item.id || item.description}
                />
            </View>
        )
    }

    return (
        <View className='flex-1 w-full p-4'>
            <View className='flex-1 w-full mb-4'>
                <View className='flex-row w-full'>
                    {
                        debtlist('receiverID')
                    }
                    {
                        debtlist('debtorID')
                    }
                </View>
            </View>
            <View className='w-full pt-2 mt-2'>
                <Button 
                    text={'Criar Débito'} 
                    onPress={() => {
                        navigation.navigate('CreateDebit')
                    }}            
                />
            </View>
        </View>
    );
}