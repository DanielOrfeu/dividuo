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
import DropdownInput from '../../components/DropdownInput';
import { usePersonStore } from '../../store/PersonStore';

export default function Home({ navigation }) {
    const [user] = useUserStore((state) => [state.user])
    const [category] = useCategoryStore((state) => [state.category])
    const [getMyDebtsToPay, getMyDebtsToReceive] = useDebtStore((state) => [state.getMyDebtsToPay, state.getMyDebtsToReceive])
    const [debtsToPay, debtsToReceive] = useDebtStore((state) => [state.debtsToPay, state.debtsToReceive])
    const [loadDebtToPay, loadDebtToReceive, getDebtByID] = useDebtStore((state) => [state.loadDebtToPay, state.loadDebtToReceive, state.getDebtByID])
    const [getPersonsByCreator, persons, setSelectedPersonID, selectedPersonID] = usePersonStore((state) => [state.getPersonsByCreator, state.persons, state.setSelectedPersonID, state.selectedPersonID])

    const getDebts = async (personID?: string) => {
        getMyDebtsToPay(user.uid, category, personID)
        getMyDebtsToReceive(user.uid, category, personID)
    }

    useEffect(() => {
        getPersonsByCreator(user.uid)
        getDebts()
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
                    getDebtByID(debt.id)
                    navigation.navigate('DebtDetail')
                }}
            >
                <Text className={`text-${color} font-semibold text-lg text-center`}>{debt.description}</Text>
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
                    : <FlatList
                        className='w-full'
                        data={debtsToPay}
                        renderItem={({ item }) => debtItem(item, 'debtorID')}
                        keyExtractor={item => item.id || item.description}
                        refreshControl={
                            <RefreshControl
                                refreshing={loadDebtToPay}
                                onRefresh={() => {
                                    getMyDebtsToPay(user.uid, category, selectedPersonID)
                                }}
                            />
                        }
                        ListEmptyComponent={<View className='items-center'>
                            <Text className='text-md'>Sem débitos a pagar</Text>
                        </View>}
                    />
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
                    : <FlatList
                        className='w-full'
                        data={debtsToReceive}
                        renderItem={({ item }) => debtItem(item, 'receiverID')}
                        keyExtractor={item => item.id || item.description}
                        refreshControl={
                            <RefreshControl
                                refreshing={loadDebtToReceive}
                                onRefresh={() => {
                                    getMyDebtsToReceive(user.uid, category, selectedPersonID)
                                }}
                            />
                        }
                        ListEmptyComponent={<View className='items-center'>
                            <Text className='text-md'>Sem débitos a receber</Text>
                        </View>}
                    />
                }
            </View>
        )
    }

    return (
        <View className='flex-1 w-full p-4'>
            <View className='flex-1 w-full'>
                <DropdownInput 
                    title={'Filtro por pessoa'}
                    firstOptionLabel='Todos'
                    firstOptionIsValid
                    data={persons?.map(ps => {
                        return {
                            label: ps.name,
                            value: ps.id
                        };
                    }) || []}
                    selectedItem={selectedPersonID}
                    setSelectedItem={(item) => {
                        setSelectedPersonID(item);
                        getDebts(item)
                    }}          
                />
                <View className='flex-1 flex-row w-full mt-2'>
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
                        navigation.navigate('CreateDebt')
                    }}
                />
            </View>
        </View>
    );
}