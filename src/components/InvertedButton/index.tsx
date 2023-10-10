import { Text, View, TouchableOpacity } from 'react-native';

interface OwnProps {
    text: string,
    disabled?: boolean,
    onPress(): void,
    w?: string
}

type Props = OwnProps

export default function InvertedButton(props: Props) {
    const className = `bg-white rounded-xl p-3 w-${props.w ? props.w : 'full'} justify-center items-center border-2 border-primary`

    return (
            <TouchableOpacity
                onPress={() => {
                    props.onPress()
                }}
                className={className}
            >
                <Text
                    className='text-primary font-bold'
                >
                    {props.text}
                </Text>
            </TouchableOpacity>
    );
}

