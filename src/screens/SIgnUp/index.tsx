import { Alert, Text, View, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import UserService from "../../services/User";
import Input from '../../components/Input';
import Button from '../../components/Button';
import InvertedButton from '../../components/InvertedButton';
import { AuthErrorTypes } from '../../@types/Firebase';
import Loading from '../../components/Loading';

export default function SignUp({ navigation }) {
    const [email, setemail] = useState<string>()
    const [password, setpassword] = useState<string>()
    const [confirmPassword, setconfirmPassword] = useState<string>()
    const [loading, setloading] = useState<boolean>(false)

    return (
        <View 
            className='flex-1 items-center justify-center w-full p-8 bg-primary'
        >   
            <Image className='m-4' source={require('../../../assets/images/transparent-icon.png')} style={{width: 75, height: 75}} />
            <View
                className='p-4 w-full items-center justify-center bg-white rounded-3xl'
            >
            <Text className='text-3xl text-primary font-bold p-2'>Cadastro</Text>

                <Input
                    placeholder='E-mail'
                    value={email}
                    onChangeText={(txt) => {
                        setemail(txt)
                    }}
                />
                <Input
                    placeholder='Senha'
                    value={password}
                    onChangeText={(txt) => {
                        setpassword(txt)
                    }}
                    isPassword
                />
                <Input
                    placeholder='Confirmar senha'
                    value={confirmPassword}
                    onChangeText={(txt) => {
                        setconfirmPassword(txt)
                    }}
                    isPassword
                />
                <View
                    className='m-4 w-full'
                >
                    {
                        loading 
                        ? <Loading/>
                        :  <Button
                            disabled={!email || !email.includes('@') 
                                || !password || password.length < 6
                                || !confirmPassword || confirmPassword.length < 6
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
                        />
                    }
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