import { ActivityIndicator } from "react-native";

interface OwnProps {

}

type Props = OwnProps

export default function Loading(props: Props) {
    return (
        <ActivityIndicator size={"large"} color={'#00ab8c'}/>
    );
}