import { create } from 'zustand'
import { Alert } from 'react-native'

import DebtService from '@services/Debt'

import { Debt } from '@store/Debt/types'
import { AuthErrorTypes } from '@store/Firebase/types'

type DebtStore = {
    showPaidDebts: boolean
    setShowPaidDebts: (pd: boolean) => void

    debtsToPay: Debt[]
    loadDebtToPay: boolean
    setDebtsToPay: (dc: Debt[]) => void
    setLoadDebtsToPay: (l: boolean) => void
    getMyDebtsToPay: (userID: string, category: number, personId?: string | null) => void

    debtsToReceive: Debt[]
    loadDebtToReceive: boolean
    setDebtsToReceive: (dc: Debt[]) => void
    setLoadDebtsToReceive: (l: boolean) => void
    getMyDebtsToReceive: (userID: string, category: number, personId?: string | null) => void

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
        getMyDebtsToPay: async (userID, category, personId) => {
            set({loadDebtToPay: true})
            await DebtService.GetMyDebtsToPay(userID, category, get().showPaidDebts, personId)
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
        getMyDebtsToReceive: async (userID, category, personId) => {
            set({loadDebtToReceive: true})
            await DebtService.GetMyDebtsToReceive(userID, category, get().showPaidDebts, personId)
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