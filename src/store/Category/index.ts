import { create } from 'zustand'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

import { DebtCategory } from '@store/Debt/types'

type CategoryStore = {
    category: DebtCategory
    setCategory: (dc: DebtCategory) => void
}

export const useCategoryStore = create<CategoryStore>((set) => {
    return {
        category: null,
        setCategory: (c) => set({category: c})
    }
})