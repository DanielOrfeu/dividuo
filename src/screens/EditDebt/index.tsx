import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { Alert, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { Debt } from '../../@types/Debt';
import { AuthErrorTypes } from '../../@types/Firebase';
import DebtService from '../../services/Debt';
import { useUserStore } from '../../store/UserStore';
import { useCategoryStore } from '../../store/CategoryStore';
import DatepickerInput from '../../components/DatepickerInput';
import Input from '../../components/Input';
import Button from '../../components/Button';
import * as Utils from '../../Utils';
import DropdownInput from "../../components/DropdownInput";
import PersonService from "../../services/Person";
import { Person } from "../../@types/Person";
import ActionModal from "../../components/ActionModal";
import Loading from "../../components/Loading";
import { useDebtStore } from "../../store/DebtStore";
import moment from "moment";
import { usePersonStore } from "../../store/PersonStore";

export default function EditDebt({ navigation, route }) {
    const [user] = useUserStore((state) => [state.user])
    const [category] = useCategoryStore((state) => [state.category])
    const [selectedPersonID] = usePersonStore((state) => [state.selectedPersonID])
    const [getMyDebtsToPay, getMyDebtsToReceive] = useDebtStore((state) => [state.getMyDebtsToPay, state.getMyDebtsToReceive])
    const [loading, setloading] = useState<boolean>(false);
    const [debt, setdebt] = useState<Debt>(route.params.debt);
    
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
                    setdebt({
                        ...debt,
                        description
                    })
                }}
            />
            <Input
                title='Valor do débito'
                value={debt.value ? Utils.NumberToBRL(debt.value) : null}
                numeric
                onChangeText={(txt) => {
                    let value = (+txt.replace(/[^0-9]/g, '')/100)
                    setdebt({
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
                    setdebt({
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
                                await DebtService.EditDebtByID(debt)
                                .then(() => {
                                    user.uid === debt.receiverID
                                    ? getMyDebtsToReceive(user.uid, category, selectedPersonID)
                                    : getMyDebtsToPay(user.uid, category, selectedPersonID)
                                    Alert.alert('Sucesso!', `Débito editado com sucesso!`, [{
                                        text: 'OK',
                                        onPress: () => {
                                            route.params.onGoBack()
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