export function NormalizeDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('pt-br')
}

export function NumberToBRL(value: number):string {
    return value ? `R$ ${value.toFixed(2)}`.replace('.',',') : 'R$ 0,00'
}