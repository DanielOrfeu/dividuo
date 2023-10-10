import { create } from 'zustand'
import { Debt } from '../../@types/Debt'
import { useUserStore } from '../UserStore'
import DebtService from '../../services/Debt'
import { Alert } from 'react-native'
import { AuthErrorTypes } from '../../@types/Firebase'

type DebtStore = {
    debtsToPay: Debt[]
    loadDebtToPay: boolean
    setDebtsToPay: (dc: Debt[]) => void
    setLoadDebtsToPay: (l: boolean) => void
    getMyDebtsToPay: (id: string, category: number) => void

    debtsToReceive: Debt[]
    loadDebtToReceive: boolean
    setDebtsToReceive: (dc: Debt[]) => void
    setLoadDebtsToReceive: (l: boolean) => void
    getMyDebtsToReceive: (id: string, category: number) => void
}

export const useDebtStore = create<DebtStore>((set) => {
    return {
        debtsToPay: [],
        loadDebtToPay: false,
        setDebtsToPay: (dp) => set({debtsToPay: dp}),
        setLoadDebtsToPay: (l) => set({loadDebtToPay: l}),
        getMyDebtsToPay: async (id, category) => {
            set({loadDebtToPay: true})
            await DebtService.GetMyDebtsToPay(id, category)
            .then(res => {
                set({debtsToPay: res})
            })
            .catch((err) => {
                Alert.alert('Erro ao listar recebedor/devedor', AuthErrorTypes[err.code] || err.code)
            })
            .finally(() => {
                set({loadDebtToPay: false})
            })              
        },
        debtsToReceive: [],
        loadDebtToReceive: false,
        setDebtsToReceive: (dr) => set({debtsToReceive: dr}),
        setLoadDebtsToReceive: (l) => set({loadDebtToReceive: l}),
        getMyDebtsToReceive: async (id, category) => {
            set({loadDebtToReceive: true})
            await DebtService.GetMyDebtsToReceive(id, category)
            .then(res => {
                set({debtsToReceive: res})
            })
            .catch((err) => {
                Alert.alert('Erro ao listar recebedor/devedor', AuthErrorTypes[err.code] || err.code)
            })
            .finally(() => {
                set({loadDebtToReceive: false})
            })              
        },
    }
})