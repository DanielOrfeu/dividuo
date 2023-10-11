import moment from "moment"

export function NormalizeDate(date: string | Date): string {
    return moment(new Date(date)).format('DD/MM/YYYY')
}

export function NormalizeDateTime(date: string | Date): string {
    return moment(new Date(date)).format('DD/MM/YYYY [às] HH:mm')
}

export function NumberToBRL(value: number):string {
    return value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
}