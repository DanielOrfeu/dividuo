import { useEffect, useState } from 'react';
import { Alert, Text, View, FlatList,  TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Debt, DebtCategory } from '../../@types/Debt';
import DebtService from '../../services/Debt';
import UserService from '../../services/User';
import * as Utils from '../../Utils';
import * as S from './styles'

import { useCategoryStore } from '../../store/CategoryStore';

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

    const debtItem = (debt: Debt) => {
        
        return (
            <View style={{borderColor: 'red', borderWidth: 3}}>
                <Text>Débito: {debt.description}</Text>
                <Text>Valor: {Utils.NumberToBRL(debt.value)}</Text>
                <Text>Valor pago: {Utils.NumberToBRL(debt.valuePaid)}</Text>
                <Text>Valor Restante: {Utils.NumberToBRL(debt.valueRemaning)}</Text>
                {
                    debt.createDate &&
                    <Text>Criado em {Utils.NormalizeDate(debt.createDate)}</Text>
                }
                {
                    debt.dueDate &&
                    <Text>Vencimento {Utils.NormalizeDate(debt.dueDate)}</Text>
                }
            </View>
        )
    }

    return (
        <S.Container>
            <TouchableOpacity
                onPress={async () => {
                    await UserService.Logout()
                }}
            >
                <Text>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={async () => {
                    navigation.navigate('CreateDebit')
                }}
            >
                <Text>Criar Débito</Text>
            </TouchableOpacity>
            <View className='flex flex-row'>
                <FlatList
                    data={debts}
                    renderItem={({item}) => debtItem(item)}
                    keyExtractor={item => item.id || item.description}
                />

                <FlatList
                    data={debts}
                    renderItem={({item}) => debtItem(item)}
                    keyExtractor={item => item.id || item.description}
                />
                </View>
        </S.Container>
    );
}