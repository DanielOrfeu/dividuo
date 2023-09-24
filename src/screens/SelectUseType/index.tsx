import { Text, TouchableOpacity } from 'react-native';
import * as S from './styles'

export default function SelecUseType({ navigation }) {
    return (
        <S.Container>
            <Text>Selecione o tipo de uso</Text>
            <TouchableOpacity 
                onPress={() => {
                    navigation.navigate('Home')
                }}
            >
                <Text>
                    Individual
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => {
                    navigation.navigate('Home')
                }}
            >
                <Text>
                    Coletivo
                </Text>
            </TouchableOpacity>
        </S.Container>
    );
}