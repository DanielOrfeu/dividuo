import { Entypo } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { Alert, Text, View } from 'react-native'

import Input from '@components/Inputs/Input'
import Button from '@components/Buttons/Button'
import Loading from '@components/Loading'
import ActionModal from '@components/ActionModal'

import UserService from '@services/User'
import DebtService from '@services/Debt'
import PersonService from '@services/Person'

import { useUserStore } from '@store/User'
import { AuthErrorTypes } from '@store/Firebase/types'

export default function Profile({ navigation }) {
    const [user] = useUserStore((state) => [state.user])
    
    const [name, setname] = useState<string>(user.displayName || '');
    const [email, setemail] = useState<string>(user.email || '');
    const [loading, setloading] = useState<boolean>(false);
    const [deleUserModalOpen, setdeleUserModalOpen] = useState<boolean>(false);
    const [password, setpassword] = useState<string>();
    const [newPassword, setnewPassword] = useState<string>();
    const [confirmNewPassword, setconfirmNewPassword] = useState<string>();
    const [reauthUserModalOpen, setreauthUserModalOpen] = useState<boolean>(false);
    const [changePasswordModalOpen, setchangePasswordModalOpen] = useState<boolean>(false);
    const [showVerifyEmailBtn, setshowVerifyEmailBtn] = useState<boolean>(user.emailVerified);

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

    useEffect(() => {
        setshowVerifyEmailBtn(user.emailVerified)
    }, [user]);

    return (
        <>
        {
        loading
        ? <View className='flex-1 w-full p-4 justify-center'>
            <Loading size={60}/>
        </View> 
        : <View className='flex-1 w-screen p-4'>
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
                {
                    !showVerifyEmailBtn &&
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
                    />
                }
                <Button
                    disabled={loading}
                    text={'Alterar senha'}
                    onPress={() => {
                        setchangePasswordModalOpen(true)
                    }}
                />
                <Button
                    disabled={loading}
                    type='alert'
                    text={'Excluir conta'}
                    onPress={() => {
                        setdeleUserModalOpen(true)
                    }}
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
                startAction={() => {
                    setdeleUserModalOpen(false)
                    setreauthUserModalOpen(true)
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
            <ActionModal
                title="Alterar de senha"
                actionText="Alterar"
                isVisible={changePasswordModalOpen}
                disableAction={password?.length < 6 || newPassword?.length < 6 || newPassword != confirmNewPassword || loading}
                closeModal={() => {
                    setchangePasswordModalOpen(false)
                    setpassword('')
                    setconfirmNewPassword('')
                    setnewPassword('')
                }}
                startAction={async () => {
                    setloading(true)
                    setchangePasswordModalOpen(false)
                    await UserService.ReauthenticateUser(password)
                    .then(async () => {
                        setpassword('')
                        
                        await UserService.ChangePassword(newPassword)
                        .then(() => {
                            Alert.alert('Sucesso!', 'Senha alterada com sucesso')
                            setconfirmNewPassword('')
                            setnewPassword('')
                        })
                        .catch((err) => {
                            Alert.alert('Erro ao alterar senha!', AuthErrorTypes[err.code] || err.code)
                        })
                        .finally(() => {
                            setloading(false)
                        })
                    })
                    .catch((err) => {
                        Alert.alert('Erro ao reautenticar usuário!', AuthErrorTypes[err.code] || err.code)
                    })
                    .finally(() => {
                        setloading(false)
                    })
                }}
                content={
                    <View className="w-full">
                        <View className="w-full justify-evenly items-center py-2">
                            <Text className='text-center text-lg'>Para alterar sua senha, por favor preencha os campos abaixo.</Text>
                            <Input
                                title='Senha atual'
                                value={password}
                                onChangeText={(txt) => {
                                    setpassword(txt)
                                }}
                                isPassword
                            />
                            <Input
                                title='Nova senha'
                                value={newPassword}
                                onChangeText={(txt) => {
                                    setnewPassword(txt)
                                }}
                                isPassword
                            />
                            <Input
                                title='Confirme a nova senha'
                                value={confirmNewPassword}
                                onChangeText={(txt) => {
                                    setconfirmNewPassword(txt)
                                }}
                                isPassword
                            />
                        </View>
                    </View>
                }
            />
        </View>
        }
        </>
    )
}