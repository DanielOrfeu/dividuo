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
		getBudgetByMonthYear: async (my) => {
			set({ loadingMonthlyBudget: true })
			const { user } = useUserStore.getState()

			await MonthlyBudgetService.GetBudgetByMonthYear(my, user.uid)
				.then((res) => {
					set({ selectedMonthlyBudget: res || null })
					if (!res) return

					const budgets = [...get().monthlyBudgets || []] 

					const indexForUpdate = budgets.findIndex(
						(item) => item.monthYear === res.monthYear
					);

					if (indexForUpdate !== -1) {
						budgets[indexForUpdate] = res;
					} else {
						budgets.push(res);
					}

					budgets.sort((a, b) => {
						const [monthA, yearA] = a.monthYear.split("/").map(Number);
						const [monthB, yearB] = b.monthYear.split("/").map(Number);

						if (yearA !== yearB) return yearA - yearB;
						return monthA - monthB;
					});

					set({ monthlyBudgets: budgets })
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