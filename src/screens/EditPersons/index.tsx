import { Feather } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

import Input from '@components/Inputs/Input'
import Button from '@components/Buttons/Button'
import Loading from '@components/Loading'
import ActionModal from '@components/ActionModal'

import DebtService from '@services/Debt'
import PersonService from '@services/Person'

import { useDebtStore } from '@store/Debt'
import { useUserStore } from '@store/User'
import { Person } from '@store/Person/types'
import { usePersonStore } from '@store/Person'
import { useCategoryStore } from '@store/Category'
import { AuthErrorTypes } from '@store/Firebase/types'

enum EditAction {
    add,
    edit,
    remove
}

export default function EditPersons({ navigation }) {
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
        loading, 
        selectedPersonID, 
        getPersonsByCreator, 
        setSelectedPersonID
    ] = usePersonStore((state) => [
        state.persons, 
        state.loadingPersons, 
        state.selectedPersonID, 
        state.getPersonsByCreator, 
        state.setSelectedPersonID
    ])
    
    const [index, setindex] = useState<number>();
    const [action, setaction] = useState<EditAction>();
    const [personName, setpersonName] = useState<string>('');
    const [personModalOpen, setpersonModalOpen] = useState<boolean>(false);


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
                            setpersonModalOpen(false)
                            getPersonsByCreator(user.uid)
                            if (persons[index].id === selectedPersonID) {
                                getMyDebtsToPay(user.uid, category, selectedPersonID)
                                getMyDebtsToReceive(user.uid, category, selectedPersonID)
                            } 
                        }
                    }])
                })
                .catch((err) => {
                    Alert.alert('Erro ao editar devedor/recebedor!', AuthErrorTypes[err.code] || err.code)
                })
        }


        if (action === EditAction.remove) {
            let deletePerson = await PersonService.DeletePerson({
                ...persons[index],
                name: personName
            })
            let deletePersonDebts = await DebtService.DeleteAllDebtsByPersonID(persons[index].id)

            Promise.all([deletePerson, deletePersonDebts])
            .then((res) => {
                Alert.alert('Sucesso!', 'Devedor/recebedor e todos débitos associados deletados com sucesso', [{
                    text: 'OK',
                    onPress: () => {
                        setpersonModalOpen(false)
                        getPersonsByCreator(user.uid)
                        if (persons[index].id === selectedPersonID) {
                            getMyDebtsToPay(user.uid, category, null)
                            getMyDebtsToReceive(user.uid, category, null)
                            setSelectedPersonID(null)
                        }                        
                    }
                }])
            })
            .catch((err) => {
                Alert.alert('Erro ao deletar devedor/recebedor e débitos associados', AuthErrorTypes[err.code] || err.code)
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
                disableAction={action === EditAction.edit && personName === persons[index].name}
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
                                    ? <Text className='text-center text-lg'>Excluir o devedor/recebedor deletará também todas as dívidas relacionadas ao perfil selecionado! Continuar?</Text>
                                    : <Input
                                        title='Nome'
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