import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';

export default function About({ navigation }) {
    return (
        <ScrollView className='flex-1 w-screen p-4'>
            <View className='w-full items-center'>
                <View className='pb-4 items-center'>
                    <Text className='font-bold text-3xl text-primary'>DiviDUO</Text>
                    <Text className='font-bold text-lg text-primary'>Descomplicando dívidas</Text>
                </View>


                <View className='pb-2 items-center'>
                    <Text className='font-semibold text-lg'>Versão</Text>
                    <Text className='text-lg'>1.0.0</Text>
                </View>

                <View className='pb-2 items-center'>
                    <Text className='font-semibold text-lg'>Criado em</Text>
                    <Text className='text-lg'>18/09/2023</Text>
                </View>

                <View className='pb-2 items-center'>
                    <Text className='font-semibold text-lg'>Idealização, criação e desenvolvimento</Text>
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL('https://www.linkedin.com/in/danielorfeu/');
                        }}
                    >
                        <Text className='text-lg'>Daniel Orfeu</Text>
                    </TouchableOpacity>
                </View>

                <View className='pb-2 items-center'>
                    <Text className='font-semibold text-lg'>Design e correções</Text>
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL('https://www.linkedin.com/in/danielorfeu/');
                        }}
                    >
                        <Text className='text-lg'>Daniel Orfeu</Text>
                    </TouchableOpacity>
                    <Text className='text-lg'>Cíntia Silveira</Text>
                </View>

                <View className='pb-2 items-center'>
                    <Text className='font-semibold text-lg'>Beta Testers</Text>
                    <Text className='text-lg'>Amanda Moraes</Text>
                    <Text className='text-lg'>Cíntia Silveira</Text>
                    <Text className='text-lg'>Joice Paz</Text>
                </View>
            </View>
        </ScrollView>
    );
}