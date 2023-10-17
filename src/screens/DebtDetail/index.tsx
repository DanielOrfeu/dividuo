import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Debt, PaymentHistory } from '../../@types/Debt';
import { useEffect, useState } from 'react';
import * as Utils from '../../Utils';
import Button from '../../components/Button';
import DebtService from '../../services/Debt';
import ActionModal from '../../components/ActionModal';
import Loading from '../../components/Loading';
import Input from '../../components/Input';
import { AuthErrorTypes } from '../../@types/Firebase';
import { useDebtStore } from '../../store/DebtStore';
import { useUserStore } from '../../store/UserStore';
import { useCategoryStore } from '../../store/CategoryStore';
import { AntDesign, Feather } from '@expo/vector-icons';
import moment from 'moment'
import { Person } from '../../@types/Person';
import PersonService from '../../services/Person';
import { usePersonStore } from '../../store/PersonStore';

enum EditAction {
    add,
    edit,
    remove
}

export default function DebtDetail({ navigation, route }) {
    const [debt, setdebt] = useState<Debt>(null);
    const [loading, setloading] = useState<boolean>(false);
    const [payValue, setpayValue] = useState<number>(0);
    const [paymentModalOpen, setpaymentModalOpen] = useState<boolean>(false);
    const [user] = useUserStore((state) => [state.user])
    const [category] = useCategoryStore((state) => [state.category])
    const [action, setaction] = useState<EditAction>();
    const [index, setindex] = useState<number>();
    const [person, setperson] = useState<Person>();
    const [getMyDebtsToPay, getMyDebtsToReceive] = useDebtStore((state) => [state.getMyDebtsToPay, state.getMyDebtsToReceive])
    const [selectedPersonID] = usePersonStore((state) => [state.selectedPersonID])
    

    const getDebt = async () => {
        setloading(true)
        await DebtService.GetDebtByID(route.params)
            .then((res: Debt) => {

                setdebt(res)
                getPerson(res)
            })
            .finally(() => {
                setloading(false)
            })
    }

    const getPerson = async (debt: Debt) => {
        await PersonService.GetPersonByID(user.uid === debt.debtorID ? debt.receiverID : debt.debtorID)
            .then((res: Person) => {
                setperson(res)
            })
            .catch((err) => {
                Alert.alert(`Erro ao buscar dados do ${user.uid === debt.debtorID ? 'recebedor' : 'pagador'}`, AuthErrorTypes[err.code] || err.code)
            })
    }

    const editDebtPayments = async () => {
        let payments = debt.paymentHistory

        if (action == EditAction.add) {
            payments.push({
                payDate: moment().format(),
                payValue
            })
        }

        if (action == EditAction.edit) {
            payments = payments.map((p, i) => {
                if (i === index) {
                    return {
                        ...p,
                        payValue
                    }
                }
                return p
            })
        }

        if (action == EditAction.remove) {
            payments = payments.filter((p, i) => {
                return i != index
            })
        }

        let valuePaid = payments.reduce((total, p) => {
            return total += p.payValue
        }, 0)

        await DebtService.EditDebtByID({
            ...debt,
            valueRemaning: debt.value - valuePaid,
            valuePaid,
            paymentHistory: payments
        })
            .then(async () => {
                user.uid === debt.receiverID
                    ? getMyDebtsToReceive(user.uid, category, selectedPersonID)
                    : getMyDebtsToPay(user.uid, category, selectedPersonID)
                getDebt()
                Alert.alert('Sucesso!', `Pagamento ${action == EditAction.add ? 'adicionado' : action == EditAction.remove ? 'removido' : 'editado'} com sucesso`, [{
                    text: 'OK',
                    onPress: () => setpaymentModalOpen(false)
                }])

            })
            .catch((err) => {
                Alert.alert(`Erro ao ${action == EditAction.add ? 'adicionar' : action == EditAction.remove ? 'remover' : 'editar'} pagamento!`, AuthErrorTypes[err.code] || err.code)
            })

        setpayValue(0)
    }

    useEffect(() => {
        getDebt()
    }, []);

    const paymentItem = (item: PaymentHistory, index: number) => {
        return (
            <View className='w-full bg-gray-200 rounded-3xl p-4 my-1 flex-row'>
                <View className='w-[80%] items-center justify-center'>
                    <Text className='text-md font-semibold'>Data: {Utils.NormalizeDateTime(item.payDate)}</Text>
                    <Text className='text-md font-semibold'>Valor: {Utils.NumberToBRL(item.payValue)}</Text>
                </View>
                <View className='w-[20%] items-center justify-evenly flex-row'>
                    <TouchableOpacity
                        onPress={() => {
                            setindex(index)
                            setpayValue(item.payValue)
                            setaction(EditAction.edit)
                            setpaymentModalOpen(true)
                        }}
                    >
                        <Feather name="edit-3" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setindex(index)
                            setaction(EditAction.remove)
                            setpaymentModalOpen(true)
                        }}
                    >
                        <Feather name="trash-2" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View className='flex-1 w-screen justify-center items-center p-4'>
            {
                debt
                    ? <>
                        <View className='w-full items-center flex-1'>
                            <Text className={`text-primary font-semibold text-xl`}>{debt.description}</Text>
                            <Text className={`text-lg`}>Total: {Utils.NumberToBRL(debt.value)}</Text>
                            <Text className={`text-lg`}>Valor pago: {Utils.NumberToBRL(debt.valuePaid)}</Text>
                            <Text className={`text-lg`}>Restante: {Utils.NumberToBRL(debt.valueRemaning)}</Text>
                            <Text className={`text-lg`}>Criado em {Utils.NormalizeDate(debt.createDate)}</Text>
                            <Text className={`${moment().isAfter(moment(new Date(debt.dueDate))) ? `text-red-600 font-bold` : ''} text-lg`}>Vencimento {Utils.NormalizeDate(debt.dueDate)}</Text>
                            <View className="w-full flex-row justify-center items-center py-4">
                                <View className="w-4/12 items-center">
                                    <Text className='font-semibold text-lg text-red-600'>Devedor</Text>
                                    <Text>{debt.debtorID === user.uid ? 'Você' : person?.name || '---'}</Text>
                                </View>
                                <View className="w-2/12 items-center">
                                    <AntDesign name="arrowright" size={24} color='#00ab8c' />
                                </View>
                                <View className="w-4/12 items-center">
                                    <Text className='font-semibold text-lg text-primary'>Recebedor</Text>
                                    <Text>{debt.receiverID === user.uid ? 'Você' : person?.name || '---'}</Text>
                                </View>
                            </View>
                            <View className='w-full items-center flex-1'>
                                <Text className='text-primary font-bold text-xl mb-1'>Lista de pagamentos</Text>
                                {
                                    debt.paymentHistory.length > 0
                                        ? <View className='flex-1 w-full'>
                                            <FlatList
                                                data={debt.paymentHistory.sort((a: PaymentHistory, b: PaymentHistory) => {
                                                    return new Date(a.payDate).getTime() - new Date(b.payDate).getTime()
                                                })}
                                                renderItem={({ item, index }) => paymentItem(item, index)}
                                                keyExtractor={item => item.payDate}
                                            />
                                        </View>
                                        :
                                        <View className='flex-1 justify-center'>
                                            <Text className='text-gray-500'>Não há registro de pagamento para esse débito</Text>
                                        </View>
                                }
                            </View>
                        </View>
                        <View className='w-full items-center'>
                            <Button
                                disabled={loading || debt.valuePaid >= debt.value}
                                text={'Adicionar pagamento'}
                                onPress={() => {
                                    setaction(EditAction.add)
                                    setpaymentModalOpen(true)
                                }}
                                icon={
                                    loading ?
                                        <Loading color='white' size={20} /> :
                                        null
                                }
                            />
                            {/* <Button
                                disabled={loading}
                                type='warning'
                                text={'Inativar dívida'}
                                onPress={() => {
                                }}
                                icon={
                                    loading ?
                                        <Loading color='white' size={20} /> :
                                        null
                                }
                            /> */}
                        </View>
                    </>
                    : <Text className='text-gray-500 text-lg'>Não foi possível carregar dados do débito</Text>
            }
            <ActionModal
                type={action === EditAction.remove ? 'alert' : ''}
                title={`${action === EditAction.remove ? 'Excluir' : action === EditAction.edit ? 'Editar' : 'Adicionar'} pagamento`}
                actionText={action === EditAction.remove ? 'Excluir' : action === EditAction.edit ? 'Editar' : 'Adicionar'}
                isVisible={paymentModalOpen}
                disableAction={false}
                closeModal={() => {
                    setpaymentModalOpen(false)
                }}
                startAction={async () => {
                    await editDebtPayments()
                }}
                content={
                    <View className="w-full">
                        <View className="w-full flex-row justify-evenly items-center ">
                            {
                                action === EditAction.remove
                                    ? <Text className='text-center text-lg'>Deseja realmente excluir o pagamento?</Text>
                                    : <Input
                                        title='Valor do pagamento'
                                        value={payValue ? Utils.NumberToBRL(payValue) : null}
                                        numeric
                                        onChangeText={(txt) => {
                                            let value = (+txt.replace(/[^0-9]/g, '') / 100)
                                            setpayValue(value)
                                        }}
                                    />
                            }
                        </View>
                    </View>
                }
            />
        </View>
    );
}