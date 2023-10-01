import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { Alert, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Debt } from '../../@types/Debt';
import { AuthErrorTypes } from '../../@types/Firebase';
import DebtService from '../../services/Debt';
import { useUserStore } from '../../store/UserStore';
import { useCategoryStore } from '../../store/CategoryStore';
import DatepickerInput from '../../components/DatepickerInput';
import Input from '../../components/Input';
import Button from '../../components/Button';
import * as Utils from '../../Utils';

export default function CreateDebit({ navigation }) {
    const [user] = useUserStore((state) => [
        state.user
    ])
    const [category] = useCategoryStore((state) => [
        state.category
    ])
    const [description, setdescription] = useState<string>('')
    const [value, setvalue] = useState<number>()
    const [dueDate, setdueDate] = useState<Date>()
    const [personType, setpersonType] = useState<string>('debtorID')


    const createDebt = async () => {
        let debt: Debt =  {
            description,
            category,
            value,
            valueRemaning: value,
            dueDate: dueDate.toString(),
            createDate: new Date().toString(),
            active: true,
            paymentHistory: []
        }

        debt[personType] = user.uid

        await DebtService.CreateDebt(debt)
        .then((res) => {
            Alert.alert('Sucesso!', 'Débito criado com sucesso')
            navigation.goBack()
        })
        .catch((err) => {
            Alert.alert('Erro!', AuthErrorTypes[err.code] || err.code)
        })
    }
    useEffect(() => {
        console.log(personType)
    }, [personType]);

    return (
        <View
            className='flex-1 items-center justify-center w-full p-8 bg-white'
        >
            <Image className='m-4' source={require('../../../assets/images/transparent-icon.png')} style={{width: 75, height: 75}} />
            <Text className='text-3xl text-primary font-semibold'>Novo débito</Text>
            <Input
                placeholder='Descrição (opicional)'
                value={description}
                onChangeText={(txt) => {
                    setdescription(txt)
                }}
            />
            <Input
                placeholder='Valor do débito'
                value={value ? Utils.NumberToBRL(value) : null}
                numeric
                onChangeText={(txt) => {
                    let val = (+txt.replace(/[^0-9]/g, '')/100)
                    setvalue(val)
                }}
            />
            <DatepickerInput
                title='Data de vencimento'
                value={dueDate}
                onPickDate={(d) => {
                    setdueDate(d)
                }}
            />


            <View className='flex-row p-4 w-full justify-center'>
                <RadioButtonGroup
                    selected={personType}
                    size={22}
                    containerStyle={{ gap: 10, with: '100%', flexDirection: 'row' }}
                    onSelected={(value) => setpersonType(value)}
                    radioBackground={'#00ab8c'}
                >
                    <RadioButtonItem 
                        value="debtorID" 
                        label={
                            <Text className='text-primary'>Sou o devedor</Text>
                        }
                    />
                    <RadioButtonItem
                        value="receiverID"
                        label={
                            <Text className='text-primary'>Sou o recebedor</Text>
                        }
                    />
                </RadioButtonGroup>
            </View>

            <Button 
                disabled={!value || !dueDate}
                text={'Criar débito'} 
                onPress={() => {
                    createDebt()
                }}
            />
        </View>
    );
}