import { Text, TouchableOpacity } from "react-native";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { BUTTON_BG_COLOR, BUTTON_COLOR, COLOR } from "@enums/colors";
import Loading from "./loading";

interface OwnProps {
	w?: string;
	text?: string;
	icon?: ReactNode;
	type?: string;
	disabled?: boolean;
	loading?: boolean;
	onPress(): void;
}

interface colorPallet {
	bgColor: string;
	color: string;
}

type ButtonProps = OwnProps;

export default function Button({
	w,
	text,
	icon,
	type,
	disabled,
	loading = false,
	onPress,
}: ButtonProps) {
	const [pallet, setpallet] = useState<colorPallet>({
		bgColor: BUTTON_BG_COLOR.default,
		color: BUTTON_COLOR.default,
	});

	useEffect(() => {
		switchColor();
	}, [type, disabled || loading]);

	useEffect(() => {
		switchColor();
	}, []);

	const switchColor = () => {
		if (disabled || loading) {
			setpallet({
				bgColor: BUTTON_BG_COLOR.disabled,
				color: BUTTON_COLOR.disabled,
			});
		} else {
			if (type) {
				setpallet({
					bgColor: BUTTON_BG_COLOR[type],
					color: BUTTON_COLOR[type],
				});
			} else {
				setpallet({
					bgColor: BUTTON_BG_COLOR.default,
					color: BUTTON_COLOR.default,
				});
			}
		}
	};

	const className = `w-${w ? w : "full"} rounded-xl p-3 my-1 justify-center items-center`;
	return (
		<TouchableOpacity
			disabled={disabled || loading}
			onPress={() => {
				onPress();
			}}
			className={className}
			style={{
				backgroundColor: pallet.bgColor,
				borderColor: pallet.bgColor,
				borderWidth: 2,
			}}
		>
			{
				loading ? (
					<Loading size={20} color={COLOR.white} />
				) : (
					<>
						{
							icon ? (
								<Fragment>{icon}</Fragment>
							) : text ? (
								<Text
									className="font-bold"
									style={{
										color: pallet.color,
									}}
								>
									{text}
								</Text>
							) : null
						}
					</>
				)
			}
		</TouchableOpacity >
	);
}
