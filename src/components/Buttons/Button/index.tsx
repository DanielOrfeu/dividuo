import { Text, TouchableOpacity } from 'react-native'
import { ReactNode, useEffect, useState } from 'react'

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
        bgColor: '#00ab8c',
        color: '#ffffff'
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
                bgColor: '#6b7280',
                color: '#ffffff'
            })
        } else {
            switch (props.type) {
                case 'warning':
                    setpallet({
                        bgColor: '#eab308',
                        color: '#000000'
                    })
                    break;
                case 'alert':
                    setpallet({
                        bgColor: '#dc2626',
                        color: '#ffffff'
                    })
                    break;
                case 'info':
                    setpallet({
                        bgColor: '#3b82f6',
                        color: '#ffffff'
                    })
                    break;
                default:
                    setpallet({
                        bgColor: '#00ab8c',
                        color: '#ffffff'
                    })
                    break;
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
                    ? <>
                        {props.icon}
                    </>
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

