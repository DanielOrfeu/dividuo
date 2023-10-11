
export interface Debt {
    id?: string
    description: string
    category: DebtCategory
    value: number
    valuePaid?: number
    valueRemaning?: number
    dueDate: string
    createDate: string
    active: boolean
    receiverID?: string
    debtorID?: string
    paymentHistory: PaymentHistory[]
}

export enum DebtCategory {
    individual,
    coletivo
}

export interface PaymentHistory {
    payDate: string
    payValue: number
}