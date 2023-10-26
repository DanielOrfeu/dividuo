import { useState } from 'react'
import { Alert, Text, View, Image, TouchableOpacity } from 'react-native'

import Input from '@components/Inputs/Input'
import Button from '@components/Buttons/Button'
import Loading from '@components/Loading'
import InvertedButton from '@components/Buttons/InvertedButton'

import UserService from '@services/User'

import { AuthErrorTypes } from '@store/Firebase/types'

export default function Login({ navigation }) {
    const [email, setemail] = useState<string>()
    const [password, setpassword] = useState<string>()
    const [loading, setloading] = useState<boolean>(false)
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

    return (
        <View
            className='flex-1 items-center justify-center w-full p-8 bg-primary'
        >
            <Image className='m-4' source={require('../../../assets/images/transparent-icon.png')} style={{ width: 75, height: 75 }} />
            <View
                className='p-4 w-full items-center justify-center bg-white rounded-3xl'
            >
                <Text className='text-3xl text-primary font-bold p-2'>Login</Text>
                <Input
                    title='E-mail'
                    value={email}
                    onChangeText={(txt) => {
                        setemail(txt)
                    }}
                />
                <Input
                    title='Senha'
                    value={password}
                    onChangeText={(txt) => {
                        setpassword(txt)
                    }}
                    isPassword
                />
                <TouchableOpacity
                    className='self-end'
                    disabled={!emailRegex.test(email)}
                    onPress={async () => {
                        setloading(true)
                        await UserService.ForgotPassword(email)
                            .then((res) => {
                                Alert.alert('Sucesso!', `Foi enviado um e-mail para ${email} com instruções para criar uma nova senha`)
                            })
                            .catch((err) => {
                                setloading(false)
                                Alert.alert('Erro!', AuthErrorTypes[err.code] || err.code)
                            })
                            .finally(() => {
                                setloading(false)
                            })
                    }}
                >
                    {
                        loading
                            ? null
                            : <Text
                                className={`${!emailRegex.test(email) ? 'text-gray-500' : 'text-primary'}`}
                            >
                                Esqueceu a senha?
                            </Text>
                    }
                </TouchableOpacity>
                <View
                    className='m-4 w-full'
                >
                    <Button
                        disabled={!emailRegex.test(email) || !password || password.length < 6 || loading}
                        text='Entrar'
                        onPress={async () => {
                            setloading(true)
                            await UserService.Login(email, password)
                                .catch((err) => {
                                    setloading(false)
                                    Alert.alert('Erro ao logar!', AuthErrorTypes[err.code] || err.code)
                                })
                        }}
                        icon={
                            loading ?
                                <Loading color='white' size={28} /> :
                                null
                        }
                    />
                </View>
                <View className='w-full items-center justify-center'>
                    <Text className='mb-2'>Ainda não possui uma conta?</Text>
                    <InvertedButton
                        text={'Cadastre-se'}
                        onPress={() => {
                            navigation.navigate('SignUp')
                        }}
                    />
                </View>
            </View>
        </View>
    )
}