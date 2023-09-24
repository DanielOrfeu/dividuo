import { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AuthStack from './authStack';
import NonAuthStack from './nonAuthStack';
import { useUserStore } from '../store/UserStore';

export default function Routes() {
    const [user, setUser] = useUserStore((state) => [
        state.user,
        state.setUser
    ])

    useEffect(() => {
        const subscribe = auth().onUserChanged(setUser)
        return subscribe
    }, []);
    

    return (
        <NavigationContainer>
            {
                user
                ? <AuthStack/>
                : <NonAuthStack/>
            }
        </NavigationContainer>    
    )
}