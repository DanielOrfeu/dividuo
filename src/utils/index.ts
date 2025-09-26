import moment from 'moment'

export function NormalizeDate(date: string | Date): string {
  return moment(date).format('DD/MM/YYYY')
}

export function NormalizeDateTime(date: string | Date): string {
  return moment(date).format('DD/MM/YYYY [às] HH:mm')
}

export function NumberToBRL(value: number): string {
  if (isNaN(value)) value = 0
  return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}