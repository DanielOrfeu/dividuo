import React from 'react'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import UserService from '../../services/User';
import { useUserStore } from '../../store/UserStore';

export default function CustomDrawer(props) {
  const [user] = useUserStore((state) => [state.user])

  return (
    <View className='flex-1'>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: '#00ab8c',
        }}
      >
        <View className='p-4'>
          {
            user.displayName
              ? <Text className='text-white text-xl font-semibold self-left'>Olá, {user.displayName}</Text>
              : <Text className='text-white text-2xl font-semibold self-center'>DiviDUO</Text>
          }
        </View>
        <View className='bg-white'>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View className='p-8 border-t-2 border-gray-200 justify-center'>
        <TouchableOpacity className='flex-row gap-2 items-center' onPress={async () => {
          await UserService.Logout()
        }}>
          <MaterialIcons name="logout" size={24} color='#00ab8c' />
          <Text className='text-primary'>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}