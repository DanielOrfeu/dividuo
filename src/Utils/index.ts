import moment from "moment"

export function NormalizeDate(date: string | Date): string {
    return moment(date).format('DD/MM/YYYY')
}

export function NormalizeDateTime(date: string | Date): string {
    return moment(date).format('DD/MM/YYYY [às] HH:mm')
}

export function NumberToBRL(value: number):string {
    return value ? `R$ ${value.toFixed(2)}`.replace('.',',') : 'R$ 0,00'
}