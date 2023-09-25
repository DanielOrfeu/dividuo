import { Text, View, TouchableOpacity } from 'react-native';

interface OwnProps {
    text: string,
    disabled?: boolean,
    onPress(): void,
}

type Props = OwnProps

export default function Button(props: Props) {
    const className = `bg-${props.disabled ? 'gray-500' : 'primary'} rounded-xl p-3 w-full justify-center items-center`
    return (
            <TouchableOpacity
                disabled={props.disabled}
                onPress={() => {
                    props.onPress()
                }}
                className={className}
            >
                <Text
                    className='text-white font-bold'
                >
                    {props.text}
                </Text>
            </TouchableOpacity>
    );
}

