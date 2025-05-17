import { create } from 'zustand'
import { Alert } from 'react-native'

import MonthlyBudgetService from '@services/monthlyBudget'

import { FIREBASE_ERROR } from '@enums/firebase'

import { useUserStore } from '@store/user'

import { MonthlyBudget } from '@interfaces/monthlyBudget'

type MonthlyBudgetStore = {
	monthYearReference: string
	setMonthYearReference: (my: string) => void

	monthlyBudgets: MonthlyBudget[]
	getBudgetByMonthYear: (my: string) => void

	selectedMonthlyBudget: MonthlyBudget | null
	setSelectedMonthlyBudget: (mb: MonthlyBudget) => void

	loadingMonthlyBudget: boolean
}

export const useMonthlyBudgetStore = create<MonthlyBudgetStore>((set, get) => {
	return {
		monthYearReference: '',
		setMonthYearReference: (my) => {
			set({ monthYearReference: my })
		},

		monthlyBudgets: [],
		getBudgetByMonthYear: async (mb) => {
			set({ loadingMonthlyBudget: true })
			const { user } = useUserStore.getState()

			await MonthlyBudgetService.GetBudgetByMonthYear(mb, user.uid)
				.then((res) => {
					if (!res) return
					if (get().monthlyBudgets.length == 0) {
						set({ monthlyBudgets: [res] })
					} else {
						set({ monthlyBudgets: [...get().monthlyBudgets, res] })
					}
					set({ selectedMonthlyBudget: res })
				})
				.catch((err) => {
					Alert.alert('Erro ao buscar lista de pessoas', FIREBASE_ERROR[err.code] || err.code)
					set({ monthlyBudgets: [] })
				})
				.finally(() => {
					set({ loadingMonthlyBudget: false })
				})
		},
		selectedMonthlyBudget: null,
		loadingMonthlyBudget: false,
		setSelectedMonthlyBudget: (monthlyBudget) => {
			set({ selectedMonthlyBudget: monthlyBudget })
		},
	}
})