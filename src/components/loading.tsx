import { ActivityIndicator } from "react-native";
import { COLOR } from "@enums/colors";

interface OwnProps {
	size?: number;
	color?: string;
}

type LoadingProps = OwnProps;

export default function Loading({ size, color }: LoadingProps) {
	return (
		<ActivityIndicator size={size || "large"} color={color || COLOR.primary} />
	);
}
