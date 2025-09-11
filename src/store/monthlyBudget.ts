import { create } from 'zustand'
import { Alert } from 'react-native'

import MonthlyBudgetService from '@services/monthlyBudget'

import { FIREBASE_ERROR } from '@enums/firebase'

import { useUserStore } from '@store/user'

import { MonthlyBudget } from '@interfaces/monthlyBudget'

type MonthlyBudgetStore = {
  loadingMonthlyBudget: boolean
  setLoadingMonthlyBudget: (loading: boolean) => void

  monthYearReference: string
  setMonthYearReference: (my: string) => void

  getMonthyBudgetByMonthYear: (my: string) => Promise<MonthlyBudget | null>

  selectedMonthlyBudget: MonthlyBudget | null
  setSelectedMonthlyBudget: (mb: MonthlyBudget) => void
}

export const useMonthlyBudgetStore = create<MonthlyBudgetStore>((set) => {
  return {
    loadingMonthlyBudget: false,
    setLoadingMonthlyBudget: (l) => {
      set({ loadingMonthlyBudget: l })
    },

    monthYearReference: '',
    setMonthYearReference: (my) => {
      set({ monthYearReference: my })
    },

    getMonthyBudgetByMonthYear: async (my): Promise<MonthlyBudget | null> => {


      const { user } = useUserStore.getState()

      return await MonthlyBudgetService.GetMonthlyBudgetByMonthYearAndCreator(my, user.uid)
        .then((res) => {
          return res || null
        })
        .catch((err) => {
          Alert.alert(`Erro ao buscar orcamento de ${my}`, FIREBASE_ERROR[err.code] || err.code)
          return null
        })


    },

    selectedMonthlyBudget: null,
    setSelectedMonthlyBudget: (monthlyBudget) => {
      set({ selectedMonthlyBudget: monthlyBudget })
    },
  }
})