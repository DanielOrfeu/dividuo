import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Alert, Text, View, Image } from 'react-native'

import Input from '@components/Inputs/Input'
import Button from '@components/Buttons/Button'
import Loading from '@components/Loading'
import DatepickerInput from '@components/Inputs/DatepickerInput'

import DebtService from '@services/Debt'

import { useDebtStore } from '@store/Debt'
import { useUserStore } from '@store/User'
import { usePersonStore } from '@store/Person'
import { useCategoryStore } from '@store/Category'
import { AuthErrorTypes } from '@store/Firebase/types'
import { EditHistory, HistoryItem } from '@store/Debt/types'

import * as utils from '@utils/index';


export default function EditDebt({ navigation, route }) {
    const [user] = useUserStore((state) => [state.user])
    const [category] = useCategoryStore((state) => [state.category])
    const [selectedPersonID] = usePersonStore((state) => [state.selectedPersonID])
    const [
        debt, 
        setDebt, 
        getDebtByID,
        getMyDebtsToPay, 
        getMyDebtsToReceive, 
    ] = useDebtStore((state) => [
        state.debt, 
        state.setDebt, 
        state.getDebtByID,
        state.getMyDebtsToPay, 
        state.getMyDebtsToReceive, 
    ])

    const [loading, setloading] = useState<boolean>(false);
    const [oldInfo, setoldInfo] = useState<HistoryItem>();

    useEffect(() => {
        setoldInfo({
            description: debt.description,
            dueDate: debt.dueDate,
            value: debt.value
        })
    }, []);

    return (
        <View
            className='flex-1 items-center p-4 bg-white w-screen justify-center'
        >
            <Image className='m-2' source={require('../../../assets/images/transparent-icon.png')} style={{width: 75, height: 75}} />
            <Text className='text-3xl text-primary font-semibold'>Editar débito</Text>
            <Input
                title='Descrição'
                value={debt.description}
                onChangeText={(description) => {
                    setDebt({
                        ...debt,
                        description
                    })
                }}
            />
            <Input
                title='Valor do débito'
                value={debt.value ? utils.NumberToBRL(debt.value) : null}
                numeric
                onChangeText={(txt) => {
                    let value = (+txt.replace(/[^0-9]/g, '')/100)
                    setDebt({
                        ...debt,
                        value,
                        valueRemaning: value
                    })
                }}
            />
            <DatepickerInput
                title='Data de vencimento'
                value={new Date(debt.dueDate)}
                onPickDate={(date) => {
                    setDebt({
                        ...debt,
                        dueDate: date.toString()
                    })
                }}
            />
            <View className="w-full py-2">
                {
                    loading 
                    ? <Loading/>
                    : <>
                        <Button 
                            disabled={!debt.description || !debt.value || !debt.dueDate}
                            text={'Editar débito'} 
                            onPress={async () => {
                                setloading(true)
                                let editHistory: EditHistory[] = debt.editHistory?.length > 0 ? debt.editHistory : []
                                editHistory.push({
                                    editDate: moment().format(),
                                    editorID: user.uid,
                                    oldInfo,
                                    newInfo: {
                                        description: debt.description,
                                        value: debt.value,
                                        dueDate: debt.dueDate,
                                    }
                                })

                                let valueRemaning = debt.value - debt.valuePaid
                                await DebtService.EditDebtByID({
                                    ...debt,
                                    valueRemaning,
                                    editHistory,
                                    active: debt.valuePaid < debt.value,
                                    settleDate: debt.valuePaid < debt.value ? null : moment().format()
                                })
                                .then(() => {
                                    user.uid === debt.receiverID
                                    ? getMyDebtsToReceive(user.uid, category, selectedPersonID)
                                    : getMyDebtsToPay(user.uid, category, selectedPersonID)

                                    let message = 'Débito editado com sucesso!'
                                    if (debt.valuePaid >= debt.value) {
                                        message = `${message} \nNota: O valor pago é maior ou igual ao valor da dívida. Dívida automaticamente configurada como quitada.`
                                    }

                                    Alert.alert('Sucesso!', message, [{
                                        text: 'OK',
                                        onPress: () => {
                                            getDebtByID(debt.id)
                                            navigation.goBack()
                                        }
                                    }])
                                })
                                .catch((err) => {
                                    Alert.alert(`Erro ao editar débito`, AuthErrorTypes[err.code] || err.code)
                                    setloading(false)
                                })
                            }}
                        />
                    </>
                }
            </View>
        </View>
    );
}