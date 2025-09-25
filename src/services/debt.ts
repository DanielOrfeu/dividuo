import firestore from '@react-native-firebase/firestore';

import { Debt } from '@interfaces/debt';
import { COLLECTION } from '@enums/collections';

export default class DebtService {
  static async CreateDebt(debt: Debt) {
    return firestore()
      .collection(COLLECTION.Debts)
      .add(debt)
  }

  static async CreateMultipleDebts(debts: Debt[]) {
    const batch = firestore().batch();
    const colRef = firestore().collection(COLLECTION.Debts)

    new Promise((resolve) => {
      resolve(debts.forEach((d) => {
        const id = colRef.doc().id
        batch.set(colRef.doc(id), d)
      }))
    })
      .then(() => {
        batch.commit()
      })
      .catch(() => {
        throw {
          code: 'Erro ao crias múltiplos débitos'
        }
      })
  }

  static async GetDebtByID(debtID: string) {
    return firestore()
      .collection(COLLECTION.Debts)
      .doc(debtID)
      .get()
      .then(res => {
        console.log("🚀 ~ DebtService ~ GetDebtByID ~ res:", res)
        if (!res.exists) return {}
        return {
          id: res.id,
          ...res.data()
        } as Debt
      })
  }

  static async EditDebtByID(debt: Debt) {
    return firestore()
      .collection(COLLECTION.Debts)
      .doc(debt.id)
      .update(debt)
  }

  static async GetTypedDebts(userID: string, category: number, showPaidDebts: boolean, debtType: 'receiverID' | 'debtorID', personID?: string | null) {
    const otherType = debtType === 'receiverID' ? 'debtorID' : 'receiverID'

    let query = firestore()
      .collection(COLLECTION.Debts)
      .where('category', '==', category)
      .where(debtType, '==', userID)

    if (personID) {
      query = query.where(otherType, '==', personID)
    }

    if (!showPaidDebts) {
      query = query.where('active', '==', true)
    }

    return query.get()
      .then(res => {
        const data = res?.docs?.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as Debt[] || []
        return data.sort((a: Debt, b: Debt) => {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
      })
  }

  static async GetDebtsToReceive(userID: string, category: number, showPaidDebts: boolean, personID?: string | null) {
    return await this.GetTypedDebts(userID, category, showPaidDebts, 'receiverID', personID)
  }

  static async GetDebtsToPay(userID: string, category: number, showPaidDebts: boolean, personID?: string | null) {
    return await this.GetTypedDebts(userID, category, showPaidDebts, 'debtorID', personID)
  }

  static async DeleteAllDebtsByRelatedID(id: string, relatedPerson: string) {
    const batch = firestore().batch();

    const queryUserIsReceiver = await firestore()
      .collection(COLLECTION.Debts)
      .where('category', '==', 0)
      .where('receiverID', '==', id)
      .get()
      .then((res) => {
        res.forEach((q) => {
          batch.delete(q.ref)
        })
      })

    const queryUserIsDebtor = await firestore()
      .collection(COLLECTION.Debts)
      .where('category', '==', 0)
      .where('debtorID', '==', id)
      .get()
      .then((res) => {
        res.forEach((q) => {
          batch.delete(q.ref)
        })
      })

    Promise.all([queryUserIsDebtor, queryUserIsReceiver])
      .then(() => {
        return batch.commit()
      })
      .catch(() => {
        throw {
          code: `Erro ao deletar todos os débitos ${relatedPerson}`
        }
      })
  }

  static async DeleteDebtByID(debtID: string) {
    return firestore()
      .collection(COLLECTION.Debts)
      .doc(debtID)
      .delete()
  }

  static async DeleteAllDebtsByPersonID(personID: string) {
    await this.DeleteAllDebtsByRelatedID(personID, 'da pessoa selecionada');
  }

  static async DeleteAllUserDebts(userID: string) {
    await this.DeleteAllDebtsByRelatedID(userID, 'do usuário');
  }

}


