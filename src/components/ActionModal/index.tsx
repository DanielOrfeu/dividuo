import Modal from "react-native-modal";

import { Text, TouchableOpacity, View } from 'react-native';
import Button from "../Button";
import InvertedButton from "../InvertedButton";
import { ReactNode } from "react";

interface OwnProps {
    title: string
    actionText: string
    isVisible: boolean
    content: ReactNode
    disableAction: boolean
    closeModal(): void
    startAction(): void
}

type Props = OwnProps

export default function ActionModal(props: Props) {
    return (
            <Modal 
            className="flex-1"
                isVisible={props.isVisible}
                backdropColor='#00ab8c'
                backdropOpacity={0.6}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={200}
                animationOutTiming={200}
                backdropTransitionInTiming={200}
                backdropTransitionOutTiming={200}
            >
                <View className="flex-1 w-full items-center justify-center">
                    <View className="bg-white rounded-xl w-11/12 items-center justify-center p-5">
                        <Text className='text-xl text-primary font-semibold'>{props.title}</Text>
                        <View className="py-2 w-full justify-center items-center">
                            {props.content}
                        </View>
                        <Button 
                            disabled={props.disableAction}
                            text={props.actionText} 
                            onPress={() => {
                                props.startAction()
                            }}                            
                        />
                        <View className="p-1"/>
                        <InvertedButton 
                            text={"Cancelar"} 
                            onPress={() => {
                                props.closeModal()
                            }}                            
                        />
                    </View>
                </View>
            </Modal>
    );
}

