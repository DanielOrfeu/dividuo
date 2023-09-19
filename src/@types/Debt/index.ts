
export interface Debt {
    id?: string
    description: string
    category: DebtCategory
    value: number
    valuePaid?: number
    valueRemaning?: number
    dueDate: any
    createDate: any,   
    active: boolean
    receiver?: string
    debtor?: string
    paymentHistory: PaymentHistory[]
}

export enum DebtCategory {
    individual = 0,
    coletivo = 1
}

interface PaymentHistory {
    payDate: any
    payValue: number
}