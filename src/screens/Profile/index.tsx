import { Text, View } from 'react-native';

interface OwnProps {

}

type Props = OwnProps

export default function Profile(props: Props) {
    return (
        <View className='flex-1 w-full justify-center items-center p-4'>
            <Text>Profile Component</Text>
        </View>
    );
}