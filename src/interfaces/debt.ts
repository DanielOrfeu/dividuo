
export interface Debt {
    id?: string
    description: string
    category: DebtCategory
    value: number
    valuePaid?: number
    valueRemaning?: number
    settleDate?: string
    dueDate: string
    createDate: string
    active: boolean
    receiverID?: string
    debtorID?: string
    paymentHistory: PaymentHistory[]
    editHistory: EditHistory[]
}

export enum DebtCategory {
    individual,
    coletivo
}

export interface PaymentHistory {
    payDate: string
    payValue: number
}

export interface EditHistory {
    editDate: string
    editorID: string
    oldInfo: HistoryItem
    newInfo: HistoryItem
}

export interface HistoryItem {
    description: string
    value: number
    dueDate: string
}