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
        color: '#00ab8c',
        bgColor: '#ffffff'
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
                color: '#6b7280',
                bgColor: '#ffffff'
            })
        } else {
            switch (props.type) {
                case 'warning':
                    setpallet({
                        color: '#eab308',
                        bgColor: '#ffffff'
                    })
                    break;
                case 'alert':
                    setpallet({
                        color: '#dc2626',
                        bgColor: '#ffffff'
                    })
                    break;
                case 'info':
                    setpallet({
                        color: '#3b82f6',
                        bgColor: '#ffffff'
                    })
                    break;
                default:
                    setpallet({
                        color: '#00ab8c',
                        bgColor: '#ffffff'
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
                borderColor: pallet.color,
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


