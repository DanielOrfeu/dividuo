import { Alert, Text } from 'react-native';
import * as S from './styles'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';
import UserService from "../../services/User";

export default function Login() {
    const [email, setemail] = useState();
    const [password, setpassword] = useState();

    return (
        <S.Container>
            <Text>Login Component</Text>
            <TextInput
                placeholder='seu email'
                value={email}
                onChangeText={(txt) => {
                    setemail(txt)
                }}
            />            
            <TextInput
                placeholder='sua senha'
                value={password}
                onChangeText={(txt) => {
                    setpassword(txt)
                }}
            />
            <TouchableOpacity 
                onPress={async () => {
                    await UserService.Login(email, password)
                    .then(() => {
                        Alert.alert('Entrou')
                    })
                    .catch(() => {
                        Alert.alert('Falhou')
                    })
                }}
            >
                <Text>
                    Entrar
                </Text>
            </TouchableOpacity>
        </S.Container>
    );
}