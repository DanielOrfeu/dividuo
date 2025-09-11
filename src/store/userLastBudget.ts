import { create } from 'zustand'
import { Alert } from 'react-native'

import UserLastBudgetService from '@services/userLastBudget'

import { FIREBASE_ERROR } from '@enums/firebase'

import { useUserStore } from '@store/user'

import { UserLastBudget } from '@interfaces/userLastBudget'


type UserLastBudgetStore = {
  loadingUserLastBudget: boolean
  setLoadingUserLastBudget: (loading: boolean) => void

  userLastBudget: UserLastBudget
  setUserLastBudget: (ulb: UserLastBudget) => void

  getUserLastBudgetByCreator: () => void
}

export const useUserLastBudgetStore = create<UserLastBudgetStore>((set) => {
  return {
    loadingUserLastBudget: false,
    setLoadingUserLastBudget: (l) => {
      set({ loadingUserLastBudget: l })
    },

    userLastBudget: null,
    setUserLastBudget: (ulb) => set({ userLastBudget: ulb }),

    getUserLastBudgetByCreator: async () => {
      set({ loadingUserLastBudget: true })

      const { user } = useUserStore.getState()

      await UserLastBudgetService.GetUserLastBudgetByCreator(user.uid)
        .then((res) => {
          set({ userLastBudget: res || null })
        })
        .catch((err) => {
          Alert.alert(`Erro ao buscar referênia de orçamento mensal`, FIREBASE_ERROR[err.code] || err.code)
          return null
        })
        .finally(() => {
          set({ loadingUserLastBudget: false })
        })
    }
  }
})