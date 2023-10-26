import { useState } from 'react'
import { Alert, Text, View, Image, TouchableOpacity } from 'react-native'

import Input from '@components/Inputs/Input'
import Button from '@components/Buttons/Button'
import Loading from '@components/Loading'
import InvertedButton from '@components/Buttons/InvertedButton'

import UserService from '@services/User'

import { AuthErrorTypes } from '@store/Firebase/types'

export default function SignUp({ navigation }) {
    const [email, setemail] = useState<string>()
    const [password, setpassword] = useState<string>()
    const [confirmPassword, setconfirmPassword] = useState<string>()
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
                <Text className='text-3xl text-primary font-bold p-2'>Cadastro</Text>

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
                <Input
                    title='Confirmar senha'
                    value={confirmPassword}
                    onChangeText={(txt) => {
                        setconfirmPassword(txt)
                    }}
                    isPassword
                />
                <View
                    className='m-4 w-full'
                >
                    <Button
                        disabled={!emailRegex.test(email)
                            || !password || password.length < 6
                            || !confirmPassword || confirmPassword.length < 6
                            || loading
                        }
                        text='Criar conta'
                        onPress={async () => {
                            setloading(true)
                            await UserService.SignUp(email, password, confirmPassword)
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
                    <Text className='mb-4'>Já possui conta?</Text>
                    <InvertedButton
                        text={'Entrar'}
                        onPress={() => {
                            navigation.navigate('Login')
                        }}
                    />
                </View>
            </View>
        </View>
    )
}