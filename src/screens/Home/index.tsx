import { Alert, Text, View, FlatList,  TouchableOpacity} from 'react-native';
import * as S from './styles'
import {  } from 'react-native-gesture-handler';
import DebtService from '../../services/Debt';
import UserService from '../../services/User';
import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Debt, DebtCategory } from '../../@types/Debt';
import * as Utils from '../../Utils';

export default function Home() {
    const [debts, setdebts] = useState<Debt[]>([]);
    
    const createDebt = async () => {
        let debt: Debt =  {
            description: 'Débito teste',
            category: DebtCategory.coletivo,
            value: 100.53,
            dueDate: firestore.FieldValue.serverTimestamp(),
            createDate: firestore.FieldValue.serverTimestamp(),
            active: false,
            paymentHistory: []
        }
        await DebtService.CreateDebt(debt)
        .then((res) => {
            Alert.alert('OK', 'criado com sucesso')
        })
        .catch((err) => {
            Alert.alert('NOK', 'erro ao criar')
        })
    }

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
                <Text>Valor: {debt.value}</Text>
                <Text>Valor pago: {debt.valuePaid}</Text>
                <Text>Valor Restante: {debt.valueRemaning}</Text>
                {
                    debt.createDate &&
                    <Text>Criado em {Utils.TimestampToDate(debt.createDate)}</Text>
                }
                {
                    debt.dueDate &&
                    <Text>Vencimento{Utils.TimestampToDate(debt.dueDate)}</Text>
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
                    createDebt()
                }}
            >
                <Text>Criar Débito</Text>
            </TouchableOpacity>
            <FlatList
                data={debts}
                renderItem={({item}) => debtItem(item)}
                keyExtractor={item => item.id || item.description}
            />
        </S.Container>
    );
}