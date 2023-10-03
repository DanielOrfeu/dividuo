import firestore from '@react-native-firebase/firestore';
import { Debt } from '../../@types/Debt';

export default class DebtService {
    static async CreateDebt(debt: Debt) {
        return firestore()
        .collection('Debts')
        .add(debt)
    }

//     static async GetPersonByCreator(creatorID: string) {
//         return firestore()
//         .collection('Debts')
//         .orderBy('name')
//         // .where('creatorID', '==', creatorID)
//         .get()
//         .then(res => {
//             let data = res?.docs?.map((doc) => {
//                 return {
//                     id: doc.id,
//                     ...doc.data()
//                 }
//             }) as Debt[] || []  
//             return data
//         })
//     }
}

