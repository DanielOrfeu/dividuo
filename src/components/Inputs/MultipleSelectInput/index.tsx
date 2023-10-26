import { useState } from 'react'
import Modal from 'react-native-modal'
import { FontAwesome } from '@expo/vector-icons'
import { Entypo, AntDesign, Feather } from '@expo/vector-icons'

import { MultiSelect } from 'react-native-element-dropdown'
import { Text, TextInput, View, TouchableOpacity } from 'react-native'


interface Item {
    label: string
    value: string
}

interface OwnProps {
    data: Item[]
    title: string
    selectedItems: string[]
    setSelectedItems(s: string[]): void
    w?: string
    hideSelectedItems?: boolean
}

type Props = OwnProps

export default function MultipleSelectInput(props: Props) {
    const className = `w-${props.w ? props.w : 'full'}`

    const renderItem = (item: Item) => {
        let selected = props.selectedItems.includes(item.value)

        return (
            <View className='w-full flex-row justify-between p-2 bg-white'>
                <Text className={`${selected ? 'text-primary' : ''}`}>{item.label}</Text>
                {
                    selected &&
                    <Entypo name="check" size={16} color="#00ab8c" />
                }
            </View>
        );
    }

    return (
        <View className={className}>
            <Text className='text-primary font-medium text-sm'>{props.title}</Text>
            <MultiSelect
                style={{
                    width: '100%',
                    height: 41,
                    backgroundColor: 'white',
                    borderRadius: 12,
                    borderColor: '#d1d5db',
                    borderWidth: 2,
                    paddingHorizontal: 16
                    }}
                placeholderStyle={{
                    fontSize: 14,
                }}
                inputSearchStyle={{
                    fontSize: 14,
                }}
                data={props.data}
                labelField="label"
                valueField="value"
                placeholder={`${props.selectedItems.length} de ${props.data.length} selecionados`}
                value={props.selectedItems}
                search
                mode='modal'
                visibleSelectedItem={!props.hideSelectedItems}
                searchPlaceholder={`Buscar ${props.title.toLocaleLowerCase()}`}
                onChange={item => {
                    props.setSelectedItems(item);
                }}
                renderItem={renderItem}
                renderSelectedItem={(item, unSelect) => (
                    <TouchableOpacity className='m-1 items-center flex-row p-2 border-2 border-primary rounded-2xl'
                        onPress={() => unSelect && unSelect(item)}    
                    >
                        <Text className='text-primary'>{item.label}</Text>
                        <Feather name="trash-2" size={24} color="red" />
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}



