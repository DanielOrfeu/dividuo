import { Alert, Text, TextInput } from 'react-native';
import * as S from './styles'
import firestore from '@react-native-firebase/firestore';
import { Debt, DebtCategory } from '../../@types/Debt';
import DebtService from '../../services/Debt';
import { useState } from 'react';

export default function CreateDebit() {
    const [description, setdescription] = useState<string>('')
    const [category, setcategory] = useState<number>()
    const [value, setvalue] = useState<number>()
    const [dueDate, setdueDate] = useState()
    const [userID, setuserID] = useState<string>()

    const createDebt = async () => {
        let debt: Debt =  {
            description,
            category,
            value,
            dueDate: firestore.FieldValue.serverTimestamp(),
            createDate: firestore.FieldValue.serverTimestamp(),
            active: true,
            paymentHistory: []
        }

        console.log(debt)

    //     await DebtService.CreateDebt(debt)
    //     .then((res) => {
    //         Alert.alert('OK', 'criado com sucesso')
    //     })
    //     .catch((err) => {
    //         Alert.alert('NOK', 'erro ao criar')
    //     })
    }

    return (
        <S.Container>
            <Text>CreateDebit Component</Text>
            <TextInput
                placeholder='descrição (opicional)'
                value={description}
                onChangeText={(txt) => {
                    setdescription(txt)
                }}
            />    
            {/* category */}
            <TextInput
                placeholder='valor'
                value={value?.toString()}
                onChangeText={(n) => {
                    setvalue(+n)
                }}
            />   
            <TextInput
                placeholder='data de vencimento'
                value={dueDate}
                onChangeText={(txt) => {
                    // setdueDate(txt)
                }}
            />
            <TextInput
                placeholder='Devedor ou recebedor?'
                value={description}
                onChangeText={(txt) => {
                    setdescription(txt)
                }}
            />   
        </S.Container>
    );
}