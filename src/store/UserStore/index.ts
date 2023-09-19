import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { create } from 'zustand'

type UserStore = {
    user: FirebaseAuthTypes.User | null
    setUser: (u: FirebaseAuthTypes.User | null) => void
}

export const useUserStore = create<UserStore>((set) => {
    return {
        user: null,
        setUser: (u) => set((state) => ({user: u}))
    }
})