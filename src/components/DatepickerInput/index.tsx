import { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import * as Utils from '../../Utils';

interface OwnProps {
    title: string
    value: Date
    onPickDate(d: Date): void
}

type Props = OwnProps

export default function DatepickerInput(props: Props) {
    const [openDatePicker, setopenDatePicker] = useState<boolean>(false);

    return (
        <View
            className='my-2 w-full'
        >  
            <Text className='text-primary font-medium text-sm'>{props.title}</Text>

            <TouchableOpacity
                className='w-full h-10 justify-center rounded-xl px-4 border-2 border-gray-300 focus:border-primary'
                onPress={() => {
                    setopenDatePicker(true)
                }}
            >
                {
                    props.value
                    ? <Text>
                        {Utils.NormalizeDate(props.value)}
                    </Text>
                    : <Text className='text-gray-400'>
                        {props.title}
                    </Text>
                }

            </TouchableOpacity>

            <DatePicker
                modal
                title={props.title}
                mode="date"
                locale='pt-br'
                open={openDatePicker}
                date={props.value ? new Date(props.value) : new Date()}
                onConfirm={(date) => {
                    props.onPickDate(date)
                    setopenDatePicker(false)
                }}
                onCancel={() => {
                    setopenDatePicker(false)
                }}
                confirmText='Confirmar'
                cancelText='Cancelar'
            />
        </View>
    );
}

