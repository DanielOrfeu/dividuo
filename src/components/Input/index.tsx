import { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import colors from 'tailwindcss/colors'

interface OwnProps {
    placeholder: string,
    value: string,
    isPassword?: boolean,
    onChangeText(s:string): void,
}

type Props = OwnProps

export default function Input(props: Props) {
    const [hidePassword, sethidePassword] = useState<boolean>(props.isPassword);
    
    return (
        <View
            className='my-2 w-full flex-row items-center'
        >
            <TextInput
                className='w-full h-10 rounded-xl px-4 border-2 border-gray-300 focus:border-primary'
                placeholder={props.placeholder}
                value={props.value}
                onChangeText={(txt) => {
                    props.onChangeText(txt)
                }}
                secureTextEntry={hidePassword}
            />
            {
                props.isPassword &&
                <View className='absolute right-3'>
                    <TouchableOpacity
                        onPress={() => {
                            sethidePassword(!hidePassword)
                        }}
                    >
                        {
                            hidePassword
                            ? <Entypo name="eye" size={20} color={colors.emerald['500']} />
                            : <Entypo name="eye-with-line" size={20} color={colors.emerald['500']} />

                        }
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}

