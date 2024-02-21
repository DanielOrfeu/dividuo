import { Entypo, Feather,Ionicons  } from '@expo/vector-icons'

import { MultiSelect } from 'react-native-element-dropdown'
import { Text, View, TouchableOpacity, Alert } from 'react-native'
import Input from '../Input'
import { useState } from 'react'


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
    showAddButton?: boolean
    handleClickAddButton?: (name: string) => void
}

type Props = OwnProps

export default function MultipleSelectInput(props: Props) {
    const [searchQuery, setsearchQuery] = useState<string>('');

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
                renderInputSearch={(search) => {
                    return (
                        <View className='mx-2 '>
                            <Input
                                hideTitle
                                title={'Pesquisar'} 
                                value={searchQuery} 
                                onChangeText={(q) => {
                                    setsearchQuery(q)
                                    search(q)
                                }} 
                                hasClearInput
                                handleClearInput={() => {
                                    setsearchQuery('')
                                    search('')
                                }}
                            />
                            {
                                props.showAddButton &&
                                <View className='flex items-center w-full pb-3'>
                                    <TouchableOpacity className='bg-primary w-4/12 rounded-lg'
                                        onPress={() => {
                                            props.handleClickAddButton(searchQuery)
                                        }}
                                    > 
                                        <View className='flex-row flex gap-1 border-primary p-2 mx-4 items-center justify-center '>

                                            <Text className='text-white font-semibold'>Adicionar</Text>
                                            <Ionicons name="add-circle-sharp" size={24} color="white" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    )
                }}
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



