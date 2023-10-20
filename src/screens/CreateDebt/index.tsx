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

export default function CreateDebt({ navigation }) {
    const [user] = useUserStore((state) => [state.user])
    const [category] = useCategoryStore((state) => [state.category])
    const [getMyDebtsToPay, getMyDebtsToReceive] = useDebtStore((state) => [state.getMyDebtsToPay, state.getMyDebtsToReceive])
    const [getPersonsByCreator, persons, selectedPersonID ] = usePersonStore((state) => [state.getPersonsByCreator, state.persons, state.selectedPersonID])
    const [multipleMonthModalOpen, setmultipleMonthModalOpen] = useState<boolean>(false);
    const [createPersonModalOpen, setcreatePersonModalOpen] = useState<boolean>(false);
    const [personType, setpersonType] = useState<string>('debtorID')
    const [personName, setpersonName] = useState<string>('');
    const [linkedPerson, setlinkedPerson] = useState('');
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
        active: true,
        receiverID: null,
        debtorID: null,
        paymentHistory: []
    });

    const createDebt = async () => {
        setloading(true)
        await DebtService.CreateDebt({
            ...debt,
            receiverID: personType === 'receiverID' ? user.uid : linkedPerson,
            debtorID: personType === 'debtorID' ? user.uid : linkedPerson
        })
        .then((res) => {
            Alert.alert('Sucesso!', 'Débito criado com sucesso')
            personType === 'receiverID'
            ? getMyDebtsToReceive(user.uid, category, selectedPersonID)
            : getMyDebtsToPay(user.uid, category, selectedPersonID)
        })
        .catch((err) => {
            Alert.alert('Erro!', AuthErrorTypes[err.code] || err.code)
        })
        .finally(() => {
            setloading(false)
        })
    }

    useEffect(() => {
        let tempDate = new Date(debt.dueDate)
        tempDate.setMonth(new Date(debt.dueDate).getMonth() + monthAmount)
        setfinalDate(tempDate)
    }, [monthAmount]);
    
    useEffect(() => {
        getPersonsByCreator(user.uid)
    }, []);
    
    return (
        <View
            className='flex-1 items-center p-4 bg-white w-screen'
        >
            <Image className='m-2' source={require('../../../assets/images/transparent-icon.png')} style={{width: 75, height: 75}} />
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
            <DropdownInput 
                title={personType === 'debtorID' ? 'Recebedor' : 'Devedor'}
                data={persons?.map(ps => {
                    return {
                        label: ps.name,
                        value: ps.id
                    }
                }) || []}
                selectedItem={linkedPerson}
                setSelectedItem={(item) => {
                    setlinkedPerson(item)
                }}
            />
            <View className="w-full py-2">
                {
                    loading 
                    ? <Loading/>
                    : <>
                        <Button 
                            text={"Criar devedor/recebedor"} 
                            onPress={() => {
                                setcreatePersonModalOpen(true)
                            }}            
                        />
                        <Button 
                            disabled={!debt.description || !debt.value || !debt.dueDate || !linkedPerson}
                            text={'Criar débito'} 
                            onPress={() => {
                                createDebt()
                            }}
                        />
                        <Button 
                            disabled={!debt.description || !debt.value || !debt.dueDate ||!linkedPerson}
                            text={"Criar débitos recorrentes"} 
                            onPress={() => { 
                                setmultipleMonthModalOpen(true)
                            }}            
                        />
                    </>
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
                title="Débito recorrente"
                actionText="Criar débito recorrente"
                isVisible={multipleMonthModalOpen} 
                disableAction={!monthAmount || monthAmount < 0}
                closeModal={() => {
                    setmultipleMonthModalOpen(false)
                }}
                startAction={async () => {
                    setmultipleMonthModalOpen(false)
                    setloading(true)
                    for (let i = 0; i <= monthAmount; i++) {
                        let dueDate = new Date(debt.dueDate)
                        dueDate.setMonth(new Date(debt.dueDate).getMonth() + i)
                        await DebtService.CreateDebt({
                            ...debt,
                            dueDate: moment(dueDate).format(),
                            receiverID: personType === 'receiverID' ? user.uid : linkedPerson,
                            debtorID: personType === 'debtorID' ? user.uid : linkedPerson
                        })
                        .catch((err) => {
                            Alert.alert(`Erro ao criar Débito do dia ${Utils.NormalizeDate(dueDate)}`, AuthErrorTypes[err.code] || err.code)
                            setloading(false)
                        })
                    }
                    Alert.alert('Sucesso!', 'Débitos criados com sucesso')
                    setloading(false)
                    personType === 'receiverID'
                    ? getMyDebtsToReceive(user.uid, category, selectedPersonID)
                    : getMyDebtsToPay(user.uid, category, selectedPersonID)
                }}
                content={
                    <View className="w-full">
                        <Input 
                            title={"Quantidade de meses recorrentes"} 
                            numeric
                            value={monthAmount.toString()} 
                            onChangeText={(n) => {
                            let val = +n.replace(/[^0-9]/g, '')
                                setmonthAmount(val)
                            }}                    
                        />
                        <View className="w-full flex-row justify-evenly items-center py-2">
                            <View className="w-4/12 items-center">
                                <Text>Mês inicial</Text>
                                <Text>{Utils.NormalizeDate(debt.dueDate)}</Text>
                            </View>
                            <View className="w-2/12 items-center">
                                <AntDesign name="arrowright" size={24} color='#00ab8c' />
                            </View>
                            <View className="w-4/12 items-center">
                                <Text>Mês final</Text>
                                <Text>{Utils.NormalizeDate(finalDate)}</Text>
                            </View>
                        </View>
                    </View>
                }
            />
        </View>
    );
}