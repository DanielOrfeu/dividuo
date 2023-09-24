import { Alert, Text, View, Image } from 'react-native';
import * as S from './styles'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';
import UserService from "../../services/User";
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Login({ navigation }) {
    const [email, setemail] = useState<string>()
    const [password, setpassword] = useState<string>()


    return (
        <View 
            className='flex-1 items-center justify-center w-full p-8 bg-primary'
        >   
            <Image className='m-8' source={require('../../../assets/images/transparent-icon.png')} style={{width: 100, height: 100}} />
            <View
                className='p-4 w-full items-center justify-center bg-white rounded-3xl'
            >
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
                <Button
                    text='Entrar'
                    onPress={async () => {
                        await UserService.Login(email, password)
                        .then((res) => {
                            Alert.alert('OK','Logado com sucesso')
                        })
                        .catch((err) => {
                            Alert.alert('nOK', err)
                        })
                    }}
                />
            </View>
        </View>
    )
}