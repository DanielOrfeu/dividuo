import { Text, TouchableOpacity } from 'react-native'
import { Fragment, ReactNode, useEffect, useState } from 'react'
import { BUTTON_BG_COLOR, BUTTON_COLOR } from '@enums/colors'

interface OwnProps {
    w?: string,
    text?: string,
    icon?: ReactNode,
    type?: string,
    disabled?: boolean,
    onPress(): void,
}

interface colorPallet {
    bgColor: string
    color: string
}

type Props = OwnProps

export default function Button(props: Props) {
    const [pallet, setpallet] = useState<colorPallet>({
        bgColor: BUTTON_BG_COLOR['default'],
        color: BUTTON_COLOR['default']
    });

    useEffect(() => {
        switchColor()
    }, [props]);

    useEffect(() => {
        switchColor()
    }, []);

    const switchColor = () => {
        if (props.disabled) {
            setpallet({
                bgColor: BUTTON_BG_COLOR['disabled'],
                color: BUTTON_COLOR['disabled']
            })
        } else {
            if (props.type) {
                setpallet({
                    bgColor: BUTTON_BG_COLOR[props.type],
                    color: BUTTON_COLOR[props.type]
                })
            } else {
                setpallet({
                    bgColor: BUTTON_BG_COLOR['default'],
                    color: BUTTON_COLOR['default']
                })
            }
        }
    }

    const className = `w-${props.w ? props.w : 'full'} rounded-xl p-3 my-1 justify-center items-center`
    return (
        <TouchableOpacity
            disabled={props.disabled}
            onPress={() => {
                props.onPress()
            }}
            className={className}
            style={{
                backgroundColor: pallet.bgColor,
                borderColor: pallet.bgColor,
                borderWidth: 2
            }}
        >
            {   
                props.icon
                    ? <Fragment>
                        {props.icon}
                    </Fragment>
                    : props.text
                        ? <Text
                            className='font-bold'
                            style={{
                                color: pallet.color
                            }}
                        >
                            {props.text}
                        </Text>
                        : null
            }
        </TouchableOpacity>
    );
}

