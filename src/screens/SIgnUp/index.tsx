import { Text, TouchableOpacity } from 'react-native';
import * as S from './styles'
import { useNavigation } from '@react-navigation/native';

export default function SignUp({ navigation }) {

    return (
        <S.Container>
            <Text>SignUp Component</Text>
            <TouchableOpacity 
                onPress={() => {
                    navigation.goBack()
                }}
            >
                <Text>
                    Voltar
                </Text>
            </TouchableOpacity>
        </S.Container>
    );
}