import { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import colors from 'tailwindcss/colors'

interface OwnProps {
    text: string,
    onPress(): void,
}

type Props = OwnProps

export default function Button(props: Props) {
    return (
            <TouchableOpacity
                onPress={() => {
                    props.onPress()
                }}
                className='bg-primary rounded-xl p-3'
            >
                <Text
                    className='text-white font-bold'
                >
                    {props.text}
                </Text>
            </TouchableOpacity>
    );
}

