
import moment from 'moment'
import { AntDesign } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Alert, Text, View, Image } from 'react-native'
import RadioButtonGroup, { RadioButtonItem } from 'expo-radio-button'

import Input from '@components/Inputs/Input'
import Button from '@components/Buttons/Button'
import Loading from '@components/Loading'
import ActionModal from '@components/ActionModal'
import DatepickerInput from '@components/Inputs/DatepickerInput'
import MultipleSelectInput from '@components/Inputs/MultipleSelectInput'

import DebtService from '@services/Debt'
import PersonService from '@services/Person'

import { Debt } from '@store/Debt/types'
import { useDebtStore } from '@store/Debt'
import { useUserStore } from '@store/User'
import { usePersonStore } from '@store/Person'
import { useCategoryStore } from '@store/Category'
import { AuthErrorTypes } from '@store/Firebase/types'

import * as utils from '@utils/index';

export default function CreateDebt({ navigation, route }) {
    const [user] = useUserStore((state) => [state.user])
    const [category] = useCategoryStore((state) => [state.category])
    const [
        getMyDebtsToPay, 
        getMyDebtsToReceive
    ] = useDebtStore((state) => [
        state.getMyDebtsToPay, 
        state.getMyDebtsToReceive
    ])
    const [
        persons, 
        selectedPersonID,
        getPersonsByCreator, 
    ] = usePersonStore((state) => [
        state.persons, 
        state.selectedPersonID,
        state.getPersonsByCreator
    ])

    const [createPersonModalOpen, setcreatePersonModalOpen] = useState<boolean>(false);
    const [createInfosModal, setcreateInfosModal] = useState<boolean>(false);
    const [personType, setpersonType] = useState<string>('receiverID')
    const [personName, setpersonName] = useState<string>('');
    const [selectedPersons, setselectedPersons] = useState<string[]>([]);
    const [monthAmount, setmonthAmount] = useState<number>(0);
    const [finalDate, setfinalDate] = useState<Date>();
    const [loading, setloading] = useState<boolean>(false);
    const [debt, setdebt] = useState<Debt>({
        description: '',
        category,
        value: 0,
        valuePaid: 0,
        valueRemaning: 0,
        dueDate: moment().format(),
        createDate: moment().format(),
        settleDate: null,
        active: true,
        receiverID: null,
        debtorID: null,
        paymentHistory: [],
        editHistory: []
    });

    useEffect(() => {
        let tempDate = new Date(debt.dueDate)
        tempDate.setMonth(new Date(debt.dueDate).getMonth() + monthAmount)
        setfinalDate(tempDate)
    }, [monthAmount, debt.dueDate]);
    
    useEffect(() => {
        getPersonsByCreator(user.uid)
        setpersonType(`${route.params.persontype}ID`)
    }, []);
    
    return (
        <View
            className='flex-1 items-center p-4 bg-white w-screen'
        >
            <Text className='text-3xl text-primary font-semibold'>Novo débito</Text>
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
                value={debt.value ? utils.NumberToBRL(debt.value) : null}
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
            <View className='flex-row p-4 w-full justify-center'>
                <RadioButtonGroup
                    selected={personType}
                    size={22}
                    containerStyle={{ gap: 10, with: '100%', flexDirection: 'row' }}
                    onSelected={(value) => setpersonType(value)}
                    radioBackground={'#00ab8c'}
                >
                    <RadioButtonItem
                        value="receiverID"
                        label={
                            <Text className='text-primary'>Sou o recebedor</Text>
                        }
                    />
                    <RadioButtonItem 
                        value="debtorID" 
                        label={
                            <Text className='text-primary'>Sou o devedor</Text>
                        }
                    />
                </RadioButtonGroup>
            </View>
            <MultipleSelectInput 
                data={persons.map((p) => {
                return {
                        label: p.name,
                        value: p.id
                    }
                }) || []} 
                title={personType === 'debtorID' ? 'Recebedores' : 'Devedores'}
                selectedItems={selectedPersons} 
                setSelectedItems={(list) => {
                    setselectedPersons(list)
                }}
                showAddButton
                handleClickAddButton={(name) => {
                    setpersonName(name)
                    setcreatePersonModalOpen(true)
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
            <Input
                title='Quantas vezes a dívida se repete?'
                placeholder='Deixe vazio ou 0 para dívida única'
                value={monthAmount ? monthAmount.toString() : null}
                numeric
                onChangeText={(txt) => {
                    let value = (+txt.replace(/[^0-9]/g, ''))
                    setmonthAmount(value)
                }}
            />
            <View className="w-full py-2">
                {
                    loading 
                    ? <Loading/>
                    : <Button 
                        disabled={!debt.description || !debt.value || !debt.dueDate || selectedPersons.length <= 0}
                        text={"Criar débito(s)"} 
                        onPress={() => { 
                            setcreateInfosModal(true)
                        }}            
                    />
                }
            </View>
            <ActionModal 
                title="Criar devedor/recebedor"
                actionText="Criar"
                isVisible={createPersonModalOpen} 
                disableAction={!personName || personName.length < 2}
                closeModal={() => {
                    setcreatePersonModalOpen(false)
                }}
                startAction={async() => {
                    setcreatePersonModalOpen(false)
                    setloading(true)
                    await PersonService.CreatePerson({
                        name: personName,
                        creatorID: user.uid
                    })
                    .then((res) => {
                        getPersonsByCreator(user.uid)
                        Alert.alert('Sucesso!', 'Devedor/recebedor criado com sucesso')
                    })
                    .catch((err) => {
                        Alert.alert('Erro!', AuthErrorTypes[err.code] || err.code)
                    })
                    .finally(() => {
                        setloading(false)
                    })
                }}
                content={
                    <View className="w-full">
                        <View className="w-full flex-row justify-evenly items-center py-2">
                            <Input 
                                title={"Nome"} 
                                value={personName} 
                                onChangeText={(txt) => {
                                    setpersonName(txt)
                                }}                            
                            />
                        </View>
                    </View>
                }
            />
            <ActionModal 
                title="Criar débito(s)"
                actionText="Criar"
                isVisible={createInfosModal} 
                disableAction={false}
                closeModal={() => {
                    setcreateInfosModal(false)
                }}
                startAction={async() => {
                    setcreateInfosModal(false)
                    setloading(true)

                    let newDebts: Debt[] = []

                    selectedPersons.forEach((personID) => {
                        for (let i = 0; i <= monthAmount; i++) {
                            let dueDate = new Date(debt.dueDate)
                            dueDate.setMonth(new Date(debt.dueDate).getMonth() + i)
                            newDebts.push({
                                ...debt,
                                dueDate: moment(dueDate).format(),
                                receiverID: personType === 'receiverID' ? user.uid : personID,
                                debtorID: personType === 'debtorID' ? user.uid : personID
                            })
                        }
                    })

                    await DebtService.CreateMultipleDebts(newDebts)
                    .then((res) => {
                        personType === 'receiverID'
                        ? getMyDebtsToReceive(user.uid, category, selectedPersonID)
                        : getMyDebtsToPay(user.uid, category, selectedPersonID)
            
                        Alert.alert('Sucesso!', 'Débito(s) criado(s) com sucesso! \nDeseja continuar criando débitos?', [
                            {
                                text: 'Não',
                                onPress: () => {
                                    navigation.goBack()
                                }
                            },
                            {
                                text: 'Sim',
                                onPress: () => {}
                            },
                        ])
                    })
                    .catch((err) => {
                        Alert.alert('Erro!', AuthErrorTypes[err.code] || err.code)
                    })
                    .finally(() => {
                        setloading(false)
                    })
                }}
                content={
                    <View className="w-full">
                        <View className="w-full py-2">
                            {selectedPersons.length > 1 && <Text className='text-center'>{`Ao selecionar ${selectedPersons.length} pessoa(s), você está criando um débito para cada pessoa, para cada um dos ${monthAmount+1} mês(es) selecioado(s).`}</Text>}
                            <Text className='py-2 text-center'>{`No total serão criados ${selectedPersons.length * (monthAmount+1)} débitos. Continuar?`}</Text>
                        </View>
                        <View className="w-full flex-row justify-evenly items-center py-2">
                            <View className="w-5/12 items-center">
                                <Text>Primeiro mês</Text>
                                <Text>{utils.NormalizeDate(debt.dueDate)}</Text>
                            </View>
                            <View className="items-center">
                                <AntDesign name="arrowright" size={24} color='#00ab8c' />
                            </View>
                            <View className="w-5/12 items-center">
                                <Text>Último mês</Text>
                                <Text>{utils.NormalizeDate(finalDate)}</Text>
                            </View>
                        </View>
                    </View>
                }
            />
        </View>
    );
}