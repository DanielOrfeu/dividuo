import { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import colors from 'tailwindcss/colors'

interface OwnProps {
    title: string,
    value: string,
    isPassword?: boolean,
    numeric?: boolean,
    email?: boolean,
    disabled?: boolean,
    onChangeText(s:string): void,
    w?: string
}

type Props = OwnProps

export default function Input(props: Props) {
    const [hidePassword, sethidePassword] = useState<boolean>(props.isPassword);
    const width = `w-${props.w?.length > 0 ? props.w : 'full'}`
    return (
        <View className={`my-2 ${width}`}>
            <Text className='text-primary font-medium text-sm pl-1'>{props.title}</Text>
            <TextInput
                className={`w-full h-10 rounded-xl px-4 border-2 border-gray-300 focus:border-primary`}
                placeholder={props.title}
                value={props.value}
                keyboardType={props.numeric ? 'numeric' : props.email ? 'email-address' : 'default'}
                onChangeText={(txt) => {
                    props.onChangeText(txt)
                }}
                secureTextEntry={hidePassword}
                editable={!props.disabled}
            />
            {
                props.isPassword &&
                <View className='absolute right-3 bottom-2'>
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

