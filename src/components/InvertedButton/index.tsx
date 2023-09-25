import { Text, View, TouchableOpacity } from 'react-native';

interface OwnProps {
    text: string,
    disabled?: boolean,
    onPress(): void,
}

type Props = OwnProps

export default function InvertedButton(props: Props) {
    const className = ``

    return (
            <TouchableOpacity
                onPress={() => {
                    props.onPress()
                }}
                className='bg-white rounded-xl p-3 w-full justify-center items-center border-2 border-primary'
            >
                <Text
                    className='text-primary font-bold'
                >
                    {props.text}
                </Text>
            </TouchableOpacity>
    );
}

