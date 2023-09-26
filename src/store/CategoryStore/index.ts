import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { create } from 'zustand'
import { DebtCategory } from '../../@types/Debt'

type CategoryStore = {
    category: DebtCategory
    setCategory: (dc: DebtCategory) => void
}

export const useCategoryStore = create<CategoryStore>((set) => {
    return {
        category: null,
        setCategory: (c) => set((state) => ({category: c}))
    }
})