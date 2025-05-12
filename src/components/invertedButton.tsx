import { Text, TouchableOpacity } from "react-native";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { INVERTED_BUTTON_BG_COLOR, INVERTED_BUTTON_COLOR } from "@enums/colors";

interface OwnProps {
	w?: string;
	text?: string;
	icon?: ReactNode;
	type?: string;
	disabled?: boolean;
	onPress(): void;
}

interface colorPallet {
	bgColor: string;
	color: string;
}

type InvertedButtonProps = OwnProps;

export default function InvertedButton({
	w,
	text,
	icon,
	type,
	disabled,
	onPress,
}: InvertedButtonProps) {
	const [pallet, setpallet] = useState<colorPallet>({
		color: INVERTED_BUTTON_COLOR.default,
		bgColor: INVERTED_BUTTON_BG_COLOR.default,
	});

	useEffect(() => {
		switchColor();
	}, [disabled, type]);

	useEffect(() => {
		switchColor();
	}, []);

	const switchColor = () => {
		if (disabled) {
			setpallet({
				bgColor: INVERTED_BUTTON_BG_COLOR.disabled,
				color: INVERTED_BUTTON_COLOR.disabled,
			});
		} else {
			if (type) {
				setpallet({
					bgColor: INVERTED_BUTTON_BG_COLOR[type],
					color: INVERTED_BUTTON_COLOR[type],
				});
			} else {
				setpallet({
					bgColor: INVERTED_BUTTON_BG_COLOR.default,
					color: INVERTED_BUTTON_COLOR.default,
				});
			}
		}
	};

	const className = `w-${w ? w : "full"} rounded-xl p-3 my-1 justify-center items-center`;
	return (
		<TouchableOpacity
			disabled={disabled}
			onPress={() => {
				onPress();
			}}
			className={className}
			style={{
				backgroundColor: pallet.bgColor,
				borderColor: pallet.color,
				borderWidth: 2,
			}}
		>
			{icon ? (
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
			) : null}
		</TouchableOpacity>
	);
}
