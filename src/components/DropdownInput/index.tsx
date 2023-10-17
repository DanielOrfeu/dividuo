import { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import * as Utils from '../../Utils';

interface Item {
    label: string
    value: string
}

interface OwnProps {
    data: Item[]
    title: string
    selectedItem: string
    setSelectedItem(s: string): void
    w?: string
}

type Props = OwnProps

export default function DropdownInput(props: Props) {
    const className = `w-${props.w ? props.w : 'full'}`

    const buildList = () => {
        let list = [
                <Picker.Item 
                    key={`Selecione...`} 
                    label={`Selecione...`} 
                    value={null}
                    style={{
                        color: '#a1a1aa'
                    }}
                />
            ]
        if (props.data?.length > 0) {
            props.data.forEach(d => {
                list.push(
                    <Picker.Item 
                        key={d.value} 
                        label={d.label} 
                        value={d.value} 
                        style={{
                            color: '#000000'
                        }}
                    />
                )
            })
        }
        return list
    }

    return (
        <View className={className}> 
            <Text className='text-primary font-medium text-sm'>{props.title}</Text>
            <TouchableOpacity
                className='w-full h-10 justify-center rounded-xl border-2 border-gray-300 focus:border-primary'
            >
            <Picker
                placeholder=''
                selectedValue={props.selectedItem}
                onValueChange={(itemValue, itemIndex) => { 
                    props.setSelectedItem(itemValue)
                }}
                enabled={props.data?.length > 0}
            >
                {
                    props.data?.length > 0 
                    ? 
                
                        buildList()
                    : <Picker.Item 
                        enabled={false}
                        label={`Sem resultados para ${props.title}`} 
                        value={''} 
                        style={{
                            color: '#a1a1aa'
                        }}
                    />
                }
            </Picker>
            </TouchableOpacity>
        </View>
    );
}

