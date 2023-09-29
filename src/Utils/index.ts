import { FirebaseTime } from "../@types/Firebase";

export function TimestampToDate(date: FirebaseTime) {
    let d = (date.seconds+date.nanoseconds*10**-9)*1000
    return new Date(d).toLocaleDateString('pt-BR')
}

export function NumberToBRL(value: number) {
}