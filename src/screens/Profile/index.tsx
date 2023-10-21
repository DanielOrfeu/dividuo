import { Alert, Text, View } from 'react-native';
import Input from '../../components/Input';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/UserStore';
import Button from '../../components/Button';
import UserService from '../../services/User';
import { AuthErrorTypes } from '../../@types/Firebase';
import Loading from '../../components/Loading';
import { Entypo } from '@expo/vector-icons';
import ActionModal from '../../components/ActionModal';
import DebtService from '../../services/Debt';
import PersonService from '../../services/Person';

export default function Profile({ navigation }) {
    const [user] = useUserStore((state) => [state.user])
    const [name, setname] = useState<string>(user.displayName || '');
    const [email, setemail] = useState<string>(user.email || '');
    const [loading, setloading] = useState<boolean>(false);
    const [deleUserModalOpen, setdeleUserModalOpen] = useState<boolean>(false);
    const [password, setpassword] = useState<string>();
    const [reauthUserModalOpen, setreauthUserModalOpen] = useState<boolean>(false);

    const deleteAllUserData = async () => {
        setdeleUserModalOpen(false)
        setloading(true)
        let userID = user.uid
        await UserService.DeleteUser()
        .then(async () => {
            let deleteUserDebts = await DebtService.DeleteAllUserDebts(userID)
            let deleteUserPersons = await PersonService.DeleteAllUserPersons(userID)
                
            Promise.all([deleteUserDebts, deleteUserPersons])
            .then(async (res) => {
                Alert.alert('Sucesso', 'O usuário e todos os seus dados foram deletados com sucesso')
            })
            .catch((err) => {
                Alert.alert('Erro ao deletar dados do usuário!', AuthErrorTypes[err.code] || err.code)
                setloading(false)
            })
        })
        .catch((err) => {
            setloading(false)
            if( err.code === 'auth/requires-recent-login') {
                setreauthUserModalOpen(true)
            } else {
                Alert.alert('Erro ao deletar usuário!', AuthErrorTypes[err.code] || err.code)
            }
        })
    }
    useEffect(() => {
        if (user.displayName) {
            setname(user.displayName)
        }
        if (user.email) {
            setemail(user.email)
        }
    }, []);

    return (
        <View className='flex-1 w-screen p-4'>
            <View className='items-center'>
                {/* <Text>Icon section</Text> */}
            </View>
            <View className='flex-1 justify-center'>
                <View className='flex-row justify-between'>
                    <View className='w-[84%] items-center'>
                        <Input
                            title={'E-mail'}
                            value={email}
                            onChangeText={(txt) => {
                                setemail(txt)
                            }}
                        />
                    </View>
                    <View className='w-[15%] items-center justify-end'>
                        <Button
                            icon={
                                loading ?
                                    <Loading color='white' size={28} /> :
                                    <Entypo name="save" size={18} color="white" />
                            }
                            disabled={email?.length < 2 || !email.includes('@') || email == user.email || loading}
                            onPress={async () => {
                                setloading(true)
                                await UserService.EditUserEmail(email.trim())
                                    .then((res) => {
                                        Alert.alert('Sucesso!', 'Email editado com sucesso')
                                    })
                                    .catch((err) => {
                                        Alert.alert('Erro ao editar email!', AuthErrorTypes[err.code] || err.code)
                                    })
                                    .finally(() => {
                                        setloading(false)
                                    })
                            }}
                        />
                    </View>
                </View>
                <View className='flex-row justify-between'>
                    <View className='w-[84%] items-center'>
                        <Input
                            title={'Nome'}
                            value={name}
                            onChangeText={(txt) => {
                                setname(txt)
                            }}
                        />
                    </View>
                    <View className='w-[15%] items-center justify-end'>
                        <Button
                            icon={
                                loading ?
                                    <Loading color='white' size={28} /> :
                                    <Entypo name="save" size={18} color="white" />
                            }
                            disabled={name?.length < 2 || name == user.displayName || loading}
                            onPress={async () => {
                                setloading(true)
                                await UserService.EditUser(name)
                                    .then((res) => {
                                        Alert.alert('Sucesso!', 'Nome editado com sucesso')
                                    })
                                    .catch((err) => {
                                        Alert.alert('Erro ao editar nome!', AuthErrorTypes[err.code] || err.code)
                                    })
                                    .finally(() => {
                                        setloading(false)
                                    })
                            }}
                        />
                    </View>
                </View>
            </View>
            <View>
                <Button
                    text={'Verificar e-mail'}
                    disabled={loading}
                    onPress={async () => {
                        setloading(true)
                        await UserService.VerifyEmail()
                            .then((res) => {
                                Alert.alert('Sucesso!', 'E-mail de verificação enviado com sucesso!')
                            })
                            .catch((err) => {
                                Alert.alert('Erro ao envir e-mail!', AuthErrorTypes[err.code] || err.code)
                            })
                            .finally(() => {
                                setloading(false)
                            })
                    }}
                    icon={
                        loading ?
                            <Loading color='white' size={20} /> :
                            null
                    }
                />
                <Button
                    disabled={loading}
                    type='alert'
                    text={'Excluir conta'}
                    onPress={() => {
                        setdeleUserModalOpen(true)
                    }}
                    icon={
                        loading ?
                            <Loading color='white' size={20} /> :
                            null
                    }
                />
            </View>
            <ActionModal
                type='alert'
                title="Excluir conta"
                actionText="Excluir"
                isVisible={deleUserModalOpen}
                disableAction={false}
                closeModal={() => {
                    setdeleUserModalOpen(false)
                }}
                startAction={async () => {
                    deleteAllUserData()
                }}
                content={
                    <View className="w-full">
                        <View className="w-full flex-row justify-evenly items-center py-2">
                            <Text className='text-center text-lg'>Essa ação é irreversível e deletará quaisquer informações associadas à esse usuário. Continuar?</Text>
                        </View>
                    </View>
                }
            />
            <ActionModal
                type='alert'
                title="Reautenticar usuário"
                actionText="Continuar com a exclusão"
                isVisible={reauthUserModalOpen}
                disableAction={password?.length < 6 || loading}
                closeModal={() => {
                    setreauthUserModalOpen(false)
                    setpassword('')
                }}
                startAction={async () => {
                    setloading(true)
                    await UserService.ReauthenticateUser(password)
                    .then(() => {
                        setreauthUserModalOpen(false)
                        setpassword('')
                        deleteAllUserData()
                    })
                    .catch((err) => {
                        Alert.alert('Erro ao reautenticar usuário!', AuthErrorTypes[err.code] || err.code)
                        setloading(false)
                    })
                }}
                content={
                    <View className="w-full">
                        <View className="w-full justify-evenly items-center py-2">
                            <Text className='text-center text-lg'>Para dar continuidade com a exclusão de seus dados, por favor insira novamente sua senha.</Text>
                            <Input
                                title='Senha'
                                value={password}
                                onChangeText={(txt) => {
                                    setpassword(txt)
                                }}
                                isPassword
                            />
                        </View>
                    </View>
                }
            />
        </View>
    )
}