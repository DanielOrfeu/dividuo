import { useEffect, useState } from 'react';
import { Alert, Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Debt, DebtCategory } from '../../@types/Debt';
import DebtService from '../../services/Debt';
import UserService from '../../services/User';
import * as Utils from '../../Utils';

import { useCategoryStore } from '../../store/CategoryStore';
import Button from '../../components/Button';
import InvertedButton from '../../components/InvertedButton';
import { useUserStore } from '../../store/UserStore';
import { AuthErrorTypes } from '../../@types/Firebase';
import { useDebtStore } from '../../store/DebtStore';
import Loading from '../../components/Loading';
import moment from 'moment';

export default function Home({ navigation }) {
    const [user] = useUserStore((state) => [state.user])
    const [category] = useCategoryStore((state) => [state.category])
    const [getMyDebtsToPay, getMyDebtsToReceive] = useDebtStore((state) => [state.getMyDebtsToPay, state.getMyDebtsToReceive])
    const [debtsToPay, debtsToReceive] = useDebtStore((state) => [state.debtsToPay, state.debtsToReceive])
    const [loadDebtToPay, loadDebtToReceive] = useDebtStore((state) => [state.loadDebtToPay, state.loadDebtToReceive])

    useEffect(() => {
        getMyDebtsToPay(user.uid, category)
        getMyDebtsToReceive(user.uid, category)
    }, []);


    const debtItem = (debt: Debt, personType: string) => {
        const color = personType === 'receiverID' ? 'primary' : 'red-600'
        const dateExpired = moment().isAfter(moment(new Date(debt.dueDate))) ? `text-red-600` : ''

        return (
            <TouchableOpacity 
                className={`border-2 m-1 px-1 pb-3 rounded-xl items-center`} 
                style={{
                    borderColor: personType === 'receiverID' ? '#00ab8c' : '#ff0000'
                }}
                onPress={() => {
                    navigation.navigate('DebtDetail', debt.id)
                }}
            >
                <Text className={`text-${color} font-semibold text-lg`}>{debt.description}</Text>
                <Text className={`font-medium`}>Valor: {Utils.NumberToBRL(debt.value)}</Text>
                <Text className={`font-medium`}>Pago: {Utils.NumberToBRL(debt.valuePaid)}</Text>
                <Text className={`font-medium`}>Restante: {Utils.NumberToBRL(debt.valueRemaning)}</Text>
                <Text className={`font-medium`}>Criado em {Utils.NormalizeDate(debt.createDate)}</Text>
                <Text className={`${dateExpired} font-medium`}>Vencimento {Utils.NormalizeDate(debt.dueDate)}</Text>
            </TouchableOpacity>
        )
    } 

    const listToPay = () => {
        return (
            <View className='flex-1 items-center'>
                <Text className={`text-red-600 text-lg font-semibold pb-1`}>A pagar</Text>
                {
                    loadDebtToPay 
                    ? <Loading/>
                    : debtsToPay.length > 0
                        ? <FlatList
                            className='w-full'
                            data={debtsToPay}
                            renderItem={({ item }) => debtItem(item, 'debtorID')}
                            keyExtractor={item => item.id || item.description}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loadDebtToPay}
                                    onRefresh={() => {
                                        getMyDebtsToPay(user.uid, category)
                                    }}
                                />
                            }
                        />
                        : <Text className='text-md'>Sem débitos a pagar</Text>
                }
            </View>
        )
    }

    const listToReceive = () => {
        return (
            <View className='flex-1 items-center'>
                <Text className={`text-primary text-lg font-semibold pb-1`}>A receber</Text>
                {
                    loadDebtToReceive 
                    ? <Loading/>
                    : debtsToReceive.length > 0
                        ? <FlatList
                            className='w-full'
                            data={debtsToReceive}
                            renderItem={({ item }) => debtItem(item, 'receiverID')}
                            keyExtractor={item => item.id || item.description}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loadDebtToReceive}
                                    onRefresh={() => {
                                        getMyDebtsToReceive(user.uid, category)
                                    }}
                                />
                            }
                        />
                        : <Text className='text-md'>Sem débitos a receber</Text>
                }
            </View>
        )
    }

    return (
        <View className='flex-1 w-full p-4'>
            <View className='flex-1 w-full mb-4'>
                <View className='flex-row w-full'>
                    {
                        listToReceive()
                    }
                    {
                        listToPay()
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