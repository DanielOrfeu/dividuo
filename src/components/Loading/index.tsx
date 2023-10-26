import { ActivityIndicator } from 'react-native'

interface OwnProps {
    size?: number
    color?: string
}

type Props = OwnProps

export default function Loading(props: Props) {
    return (
        <ActivityIndicator size={props.size || "large"} color={props.color || '#00ab8c'}/>
    );
}