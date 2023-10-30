import moment from 'moment';
import Checkbox from 'expo-checkbox'
import { useEffect, useState } from 'react'
import { Alert, Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native'

import Loading from '@components/Loading'
import Button from '@components/Buttons/Button'
import DropdownInput from '@components/Inputs/DropdownInput'

import { useUserStore } from '@store/User'
import { useDebtStore } from '@store/Debt'
import { usePersonStore } from '@store/Person'
import { useCategoryStore } from '@store/Category'
import { Debt, DebtCategory } from '@store/Debt/types'

import * as utils from '@utils/index'

export default function Home({ navigation }) {
    const [user] = useUserStore((state) => [state.user])
    const [category] = useCategoryStore((state) => [state.category])
    const [
        getMyDebtsToPay, 
        getMyDebtsToReceive
    ] = useDebtStore((state) => [
        state.getMyDebtsToPay, 
        state.getMyDebtsToReceive
    ])
    const [debtsToPay, 
        debtsToReceive
    ] = useDebtStore((state) => [
        state.debtsToPay, 
        state.debtsToReceive
    ])
    const [
        getDebtByID,
        loadDebtToPay, 
        loadDebtToReceive, 
        showPaidDebts,
        setShowPaidDebts
    ] = useDebtStore((state) => [
        state.getDebtByID,
        state.loadDebtToPay, 
        state.loadDebtToReceive,
        state.showPaidDebts,
        state.setShowPaidDebts
    ])
    const [
        persons, 
        selectedPersonID,
        getPersonsByCreator, 
        setSelectedPersonID, 
    ] = usePersonStore((state) => [
        state.persons, 
        state.selectedPersonID,
        state.getPersonsByCreator,
        state.setSelectedPersonID, 
    ])
    const [totalToReceive, settotalToReceive] = useState<number>(0);
    const [totalToPay, settotalToPay] = useState<number>(0);

    const getDebts = async (personID?: string) => {
        getMyDebtsToPay(user.uid, category, personID)
        getMyDebtsToReceive(user.uid, category, personID)
    }
    
    useEffect(() => {
        settotalToPay(debtsToPay.reduce((acc, crr) => {
            return crr.valueRemaning > 0 ? acc + crr.valueRemaning : acc
        }, 0))
    }, [debtsToPay]);

    useEffect(() => {
        settotalToPay(debtsToReceive.reduce((acc, crr) => {
            return crr.valueRemaning > 0 ? acc + crr.valueRemaning : acc
        }, 0))
    }, [debtsToReceive]);

    useEffect(() => {
        getPersonsByCreator(user.uid)
        getDebts()
    }, []);

    useEffect(() => {
        getMyDebtsToPay(user.uid, category, selectedPersonID || null)
        getMyDebtsToReceive(user.uid, category, selectedPersonID || null)
    }, [showPaidDebts]);

    const debtItem = (debt: Debt, personType: string) => {
        const color = !debt.active ? 'gray-500' : personType === 'receiverID' ? 'primary' : 'red-600'

        return (
            <TouchableOpacity 
                className={`border-2 m-1 px-1 pb-3 rounded-xl items-center`} 
                style={{
                    borderColor: !debt.active ? '#6b7280' : personType === 'receiverID' ? '#00ab8c' : '#ff0000'
                }}
                onPress={() => {
                    getDebtByID(debt.id)
                    navigation.navigate('DebtDetail')
                }}
            >
                <Text className={`text-${color} font-semibold text-lg text-center`}>{debt.description}</Text>
                <Text className={`font-medium`}>Valor: {utils.NumberToBRL(debt.value)}</Text>
                <Text className={`font-medium`}>Pago: {utils.NumberToBRL(debt.valuePaid)}</Text>
                <Text className={`font-medium`}>Restante: {utils.NumberToBRL(debt.valueRemaning)}</Text>
                <Text className={`font-medium`}>Criado em: {utils.NormalizeDate(debt.createDate)}</Text>
                <Text className={`font-medium`}
                    style={{
                        color: !debt.active ? '#6b7280' : moment().isAfter(moment(new Date(debt.dueDate))) ? '#ff0000' : '#000'
                    }}
                >Vencimento {utils.NormalizeDate(debt.dueDate)}</Text>
                {debt.settleDate && <Text className={`font-medium`}>Quitado em: {utils.NormalizeDate(debt.settleDate)}</Text>}
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
                        data={debtsToReceive.sort((a, b) => {
                            return Number(b.active) - Number(a.active)
                        })}
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
                <TouchableOpacity className='flex-row gap-2 items-center justify-center m-2'
                    onPress={() => {
                        setShowPaidDebts(!showPaidDebts)
                    }}
                > 
                    <Checkbox
                        value={showPaidDebts}
                        color={showPaidDebts ? '#00ab8c' : undefined}
                        onValueChange={(v) => {
                            setShowPaidDebts(v)
                        }}
                    />
                    <Text className='text-primary font-bold-'>Exibir dívidas quitadas</Text>
                </TouchableOpacity>
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
                <View className='w-full flex-row'>
                    <View className='w-6/12 items-center'>
                        <Text>Total a receber: {utils.NumberToBRL(totalToPay)}</Text>
                    </View>
                    <View className='w-6/12 items-center'>
                        <Text>Total a pagar: {utils.NumberToBRL(totalToReceive)}</Text>
                    </View>
                </View>
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