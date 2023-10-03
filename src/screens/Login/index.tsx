import { Alert, Text, View, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import UserService from "../../services/User";
import Input from '../../components/Input';
import Button from '../../components/Button';
import InvertedButton from '../../components/InvertedButton';
import { AuthErrorTypes } from '../../@types/Firebase';
import Loading from '../../components/Loading';

export default function Login({ navigation }) {
    const [email, setemail] = useState<string>()
    const [password, setpassword] = useState<string>()
    const [loading, setloading] = useState<boolean>(false)

    return (
        <View 
            className='flex-1 items-center justify-center w-full p-8 bg-primary'
        >   
            <Image className='m-4' source={require('../../../assets/images/transparent-icon.png')} style={{width: 75, height: 75}} />
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
                            className={`${!email || !email.includes('@') ? 'text-gray-500' : 'text-primary'}`}
                        >
                            Esqueceu a senha?
                        </Text>
                    }
                </TouchableOpacity>
                <View
                    className='m-4 w-full'
                >
                    {
                        loading 
                        ? <Loading/>
                        :  <Button
                            disabled={!email || !email.includes('@') || !password || password.length < 6}
                            text='Entrar'
                            onPress={async () => {
                            setloading(true)
                            await UserService.Login(email, password)
                            .catch((err) => {
                                setloading(false)
                                    Alert.alert('Erro ao logar!', AuthErrorTypes[err.code] || err.code)
                                })
                            }}
                        />
                    }
                </View>
                <View className='w-full items-center justify-center'>
                    <Text className='mb-4'>Ainda não possui uma conta?</Text>
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