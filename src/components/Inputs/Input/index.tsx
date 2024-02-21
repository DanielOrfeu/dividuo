import { useState } from 'react'
import colors from 'tailwindcss/colors'
import { Entypo } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons';
import { Text, TextInput, View, TouchableOpacity } from 'react-native'

interface OwnProps {
    title: string,
    placeholder?: string,
    value: string,
    isPassword?: boolean,
    numeric?: boolean,
    email?: boolean,
    disabled?: boolean,
    onChangeText(s:string): void,
    w?: string
    hideTitle?: boolean
    hasClearInput?: boolean
    handleClearInput?: () => void
}

type Props = OwnProps

export default function Input(props: Props) {
    const [hidePassword, sethidePassword] = useState<boolean>(props.isPassword);
    const width = `w-${props.w?.length > 0 ? props.w : 'full'}`
    
    return (
        <View className={`my-2 ${width}`}>
            { !props.hideTitle &&
                <Text className='text-primary font-medium text-sm pl-1'>{props.title}</Text>
            }
            <TextInput
                className={`w-full h-10 rounded-xl px-4 border-2 border-gray-300 focus:border-primary`}
                placeholder={props.placeholder ? props.placeholder : props.title}
                value={props.value}
                keyboardType={props.numeric ? 'numeric' : props.email ? 'email-address' : 'default'}
                onChangeText={(txt) => {
                    props.onChangeText(txt)
                }}
                secureTextEntry={hidePassword}
                editable={!props.disabled}
            />
            {
                props.isPassword || props.hasClearInput &&
                <View className='absolute right-3 bottom-2'>
                    <TouchableOpacity
                        onPress={() => {
                            if (props.isPassword) {
                                sethidePassword(!hidePassword)
                            } else {
                                props.handleClearInput()
                            }
                        }}
                    >
                        {
                            props.isPassword 
                            
                            ?
                                hidePassword
                                ? <Entypo name="eye" size={20} color='#00ab8c'/>
                                : <Entypo name="eye-with-line" size={20} color='#00ab8c' />
                            : <AntDesign name="closecircle" size={24} color='#00ab8c' />
                        }
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}

