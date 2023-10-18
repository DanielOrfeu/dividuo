import firestore from '@react-native-firebase/firestore';
import { Debt } from '../../@types/Debt';

export default class DebtService {
    static async CreateDebt(debt: Debt) {
        return firestore()
        .collection('Debts')
        .add(debt)
    }

    static async GetDebtByID(debtID: string) {
        return firestore()
        .collection('Debts')
        .doc(debtID)
        .get()
        .then(res => {
            return {
                id: res.id,
                ...res.data()
            } as Debt || {}
        })
    }

    static async EditDebtByID(debt: Debt) {
        return firestore()
        .collection('Debts')
        .doc(debt.id)
        .update(debt)
    }

    static async GetMyDebtsToReceive(userID: string, category: number, personID?: string | null) {
        let query = firestore()
        .collection('Debts')
        .where('active', '==', true)
        .where('category', '==', category)
        .where('receiverID', '==', userID)

        if(personID) {
            query = query.where('debtorID', '==', personID)
        }

        return query.get()
        .then(res => {
            let data = res?.docs?.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            }) as Debt[] || []  
            return data.sort((a: Debt, b:Debt) => {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() 
            })
        })
    }

    static async GetMyDebtsToPay(userID: string, category: number, personID?: string | null) {
        let query = firestore()
        .collection('Debts')
        .where('active', '==', true)
        .where('category', '==', category)
        .where('debtorID', '==', userID)

        if(personID) {
            query = query.where('receiverID', '==', personID)
        }

        return query.get()
        .then(res => {
            let data = res?.docs?.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            }) as Debt[] || []  
            return data.sort((a: Debt, b:Debt) => {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() 
            })
        })
    }

    static async DeleteDebtByID(debtID: string) {
        return firestore()
        .collection('Debts')
        .doc(debtID)
        .delete()
    }
}

