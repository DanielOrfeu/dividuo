import { Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { useEffect, useState } from 'react';
import { AuthErrorTypes } from '../../@types/Firebase';
import PersonService from '../../services/Person';
import { Person } from '../../@types/Person';
import { useUserStore } from '../../store/UserStore';
import { Feather } from '@expo/vector-icons';
import * as Utils from '../../Utils';
import ActionModal from '../../components/ActionModal';
import Input from '../../components/Input';
import { usePersonStore } from '../../store/PersonStore';
import { useDebtStore } from '../../store/DebtStore';
import { useCategoryStore } from '../../store/CategoryStore';

enum EditAction {
    add,
    edit,
    remove
}

export default function EditPersons({ navigation }) {
    const [user] = useUserStore((state) => [state.user])
    const [index, setindex] = useState<number>();
    const [action, setaction] = useState<EditAction>();
    const [personName, setpersonName] = useState<string>('');
    const [personModalOpen, setpersonModalOpen] = useState<boolean>(false);
    const [getPersonsByCreator, persons, loading, selectedPersonID] = usePersonStore((state) => [state.getPersonsByCreator, state.persons, state.loadingPersons, state.selectedPersonID])
    const [getMyDebtsToPay, getMyDebtsToReceive] = useDebtStore((state) => [state.getMyDebtsToPay, state.getMyDebtsToReceive])
    const [category] = useCategoryStore((state) => [state.category])


    const editPersonlist = async () => {
        if (action === EditAction.add) {
            await PersonService.CreatePerson({
                name: personName,
                creatorID: user.uid
            })
                .then((res) => {
                    Alert.alert('Sucesso!', 'Devedor/recebedor criado com sucesso', [{
                        text: 'OK',
                        onPress: () => {
                            getPersonsByCreator(user.uid)
                            setpersonModalOpen(false)
                        }
                    }])
                })
                .catch((err) => {
                    Alert.alert('Erro ao criar usuário!', AuthErrorTypes[err.code] || err.code)
                })
        }

        if (action === EditAction.edit) {
            await PersonService.EditPerson({
                ...persons[index],
                name: personName
            })
                .then((res) => {
                    Alert.alert('Sucesso!', 'Devedor/recebedor editado com sucesso', [{
                        text: 'OK',
                        onPress: () => {
                            getPersonsByCreator(user.uid)
                            getMyDebtsToPay(user.uid, category, selectedPersonID)
                            getMyDebtsToReceive(user.uid, category, selectedPersonID)
                            setpersonModalOpen(false)
                        }
                    }])
                })
                .catch((err) => {
                    Alert.alert('Erro ao editar devedor/recebedor!', AuthErrorTypes[err.code] || err.code)
                })
        }


        if (action === EditAction.remove) {
            await PersonService.DeletePerson({
                ...persons[index],
                name: personName
            })
                .then((res) => {
                    Alert.alert('Sucesso!', 'Devedor/recebedor deletado com sucesso', [{
                        text: 'OK',
                        onPress: () => {
                            getPersonsByCreator(user.uid)
                            getMyDebtsToPay(user.uid, category, null)
                            getMyDebtsToReceive(user.uid, category, null)
                            setpersonModalOpen(false)
                        }
                    }])
                })
                .catch((err) => {
                    Alert.alert('Erro ao deletar devedor/recebedor!', AuthErrorTypes[err.code] || err.code)
                })
        }

        setpersonName('')
    }

    const personItem = (person: Person, index: number) => {
        return (
            <View className='w-full bg-gray-200 rounded-3xl p-4 my-1 flex-row'>
                <View className='w-[80%] items-center justify-center'>
                    <Text className='text-md font-semibold'>Nome: {person.name}</Text>
                </View>
                <View className='w-[20%] items-center justify-evenly flex-row'>
                    <TouchableOpacity
                        onPress={() => {
                            setindex(index)
                            setpersonName(person.name)
                            setaction(EditAction.edit)
                            setpersonModalOpen(true)
                        }}
                    >
                        <Feather name="edit-3" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setindex(index)
                            setaction(EditAction.remove)
                            setpersonModalOpen(true)
                        }}
                    >
                        <Feather name="trash-2" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    useEffect(() => {
        getPersonsByCreator(user.uid)
    }, []);

    return (
        <View className='flex-1 w-screens justify-center items-center p-4'>
            <View className='w-full items-center flex-1'>
                <Text className='text-primary font-bold text-xl mb-1'>Lista de Devedores/recebedores</Text>
                {
                    persons.length > 0
                        ? <View className='flex-1 w-full'>
                            <FlatList
                                data={persons}
                                renderItem={({ item, index }) => personItem(item, index)}
                                keyExtractor={item => item.id}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={loading}
                                        onRefresh={() => {
                                            getPersonsByCreator(user.uid)
                                        }}
                                    />
                                }
                            />
                        </View>
                        :
                        <View className='flex-1 justify-center'>
                            <Text className='text-gray-500'>Não há devedor/recebedor cadastrado para esse usuário</Text>
                        </View>
                }
            </View>
            <View className='w-full items-center'>
                <Button
                    disabled={loading}
                    text={'Adicionar devedor/recebedor'}
                    onPress={() => {
                        setaction(EditAction.add)
                        setpersonModalOpen(true)
                    }}
                    icon={
                        loading ?
                            <Loading color='white' size={20} /> :
                            null
                    }
                />
            </View>
            <ActionModal
                type={action === EditAction.remove ? 'alert' : ''}
                title={`${action === EditAction.remove ? 'Excluir' : action === EditAction.edit ? 'Editar' : 'Adicionar'} devedor/recebedor`}
                actionText={action === EditAction.remove ? 'Excluir' : action === EditAction.edit ? 'Editar' : 'Adicionar'}
                isVisible={personModalOpen}
                disableAction={false}
                closeModal={() => {
                    setpersonModalOpen(false)
                }}
                startAction={async () => {
                    await editPersonlist()
                }}
                content={
                    <View className="w-full">
                        <View className="w-full flex-row justify-evenly items-center ">
                            {
                                action === EditAction.remove
                                    ? <Text className='text-center text-lg'>Deseja realmente excluir o devedor/recebedor?</Text>
                                    : <Input
                                        title='Nome do devedor/recebedor'
                                        value={personName}
                                        onChangeText={(txt) => {
                                            setpersonName(txt)
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