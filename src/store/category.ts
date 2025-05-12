import { create } from 'zustand'

import { DebtCategory } from '@interfaces/debt'

type CategoryStore = {
	category: DebtCategory
	setCategory: (dc: DebtCategory) => void
}

export const useCategoryStore = create<CategoryStore>((set) => {
	return {
		category: null,
		setCategory: (c) => set({ category: c })
	}
})