import { create } from 'zustand'
import { Alert } from 'react-native'

import MonthlyBudgetService from '@services/monthlyBudget'

import { FIREBASE_ERROR } from '@enums/firebase'

import { useUserStore } from '@store/user'

import { MonthlyBudget } from '@interfaces/monthlyBudget'

type MonthlyBudgetStore = {
	monthlyBudgets: MonthlyBudget[]

	getBudgetByMonthYear: (my: string) => void

	selectedMonthlyBudget: MonthlyBudget | null
	setSelectedMonthlyBudget: (mb: MonthlyBudget) => void

	loadingMonthlyBudget: boolean
}

export const useMonthlyBudgetStore = create<MonthlyBudgetStore>((set, get) => {
	return {
		monthlyBudgets: [],
		getBudgetByMonthYear: async (mb) => {
			set({ loadingMonthlyBudget: true })
			const { user } = useUserStore.getState()

			await MonthlyBudgetService.GetBudgetByMonthYear(mb, user.uid)
				.then((res) => {
					if (get().monthlyBudgets.length == 0) {
						set({ monthlyBudgets: [res] })
						//TODO: ver lógica de associação
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