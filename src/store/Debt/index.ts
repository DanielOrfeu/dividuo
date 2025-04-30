import { create } from 'zustand'
import { Alert } from 'react-native'

import DebtService from '@services/Debt'

import { Debt } from '@store/Debt/types'
import { AuthErrorTypes } from '@store/Firebase/types'
import { usePersonStore } from '@store/Person'
import { useUserStore } from '@store/User'
import { useCategoryStore } from '@store/Category'

type DebtStore = {
    showPaidDebts: boolean
    setShowPaidDebts: (pd: boolean) => void

    debtsToPay: Debt[]
    loadDebtToPay: boolean
    setDebtsToPay: (dc: Debt[]) => void
    setLoadDebtsToPay: (l: boolean) => void
    getDebtsToPay:  () => void

    debtsToReceive: Debt[]
    loadDebtToReceive: boolean
    setDebtsToReceive: (dc: Debt[]) => void
    setLoadDebtsToReceive: (l: boolean) => void
    getDebtsToReceive: () => void

    debt: Debt | null
    loadDebt: boolean
    setDebt: (d: Debt | null) => void
    setLoadDebt: (l: boolean) => void
    getDebtByID: (userID: string) => void
}

export const useDebtStore = create<DebtStore>((set, get) => {
    return {
        showPaidDebts: false,
        setShowPaidDebts: (pd) => set({showPaidDebts: pd}),

        debtsToPay: [],
        loadDebtToPay: false,
        setDebtsToPay: (dp) => set({debtsToPay: dp}),
        setLoadDebtsToPay: (l) => set({loadDebtToPay: l}),
        getDebtsToPay: async () => {
            const {user} = useUserStore.getState()
            const {category} = useCategoryStore.getState()
            const {selectedPersonID} = usePersonStore.getState()

            set({loadDebtToPay: true})
            await DebtService.GetDebtsToPay(user.uid, category, get().showPaidDebts, selectedPersonID)
            .then(res => {
                set({debtsToPay: res})
            })
            .catch((err) => {
                Alert.alert('Erro ao listar débitos a pagar', AuthErrorTypes[err.code] || err.code)
            })
            .finally(() => {
                set({loadDebtToPay: false})
            })              
        },
        debtsToReceive: [],
        loadDebtToReceive: false,
        setDebtsToReceive: (dr) => set({debtsToReceive: dr}),
        setLoadDebtsToReceive: (l) => set({loadDebtToReceive: l}),
        getDebtsToReceive: async () => {
            const {user} = useUserStore.getState()
            const {category} = useCategoryStore.getState()
            const {selectedPersonID} = usePersonStore.getState()

            set({loadDebtToReceive: true})
            await DebtService.GetDebtsToReceive(user.uid, category, get().showPaidDebts, selectedPersonID)
            .then(res => {
                set({debtsToReceive: res})
            })
            .catch((err) => {
                Alert.alert('Erro ao listar débitos a receber', AuthErrorTypes[err.code] || err.code)
            })
            .finally(() => {
                set({loadDebtToReceive: false})
            })              
        },
        debt: null,
        loadDebt: false,
        setDebt: (d) => set({debt: d}),
        setLoadDebt: (l) => set({loadDebt: l}),
        getDebtByID: async (debtID) => {
            set({loadDebt: true})
            await DebtService.GetDebtByID(debtID)
            .then((res: Debt) => {
                set({debt: res})
            })
            .catch((err) => {
                Alert.alert('Erro ao buscar débito', AuthErrorTypes[err.code] || err.code)
            })
            .finally(() => {
                set({loadDebt: false})
            })
        }
    }
})