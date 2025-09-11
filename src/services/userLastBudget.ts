import firestore from '@react-native-firebase/firestore';

import { UserLastBudget } from '@interfaces/userLastBudget';

import { COLLECTION } from '@enums/collections';

export default class UserLastBudgetService {
  static async CreateUserLastBudget(ulb: UserLastBudget) {
    return firestore()
      .collection(COLLECTION.UserLastBudget)
      .add(ulb)
  }

  static async GetUserLastBudgetByCreator(creatorID: string) {
    const query = firestore()
      .collection(COLLECTION.UserLastBudget)
      .where('creatorID', '==', creatorID)

    return query.get()
      .then(res => {
        const data = res?.docs?.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as UserLastBudget[] || []
        return data[0] || null
      })
  }

  static async EditUserLastBudgetByID(ulb: UserLastBudget) {
    return firestore()
      .collection(COLLECTION.UserLastBudget)
      .doc(ulb.id)
      .update(ulb)
  }

  static async DeleteUserLastBudgetByID(ulbID: string) {
    return firestore()
      .collection(COLLECTION.UserLastBudget)
      .doc(ulbID)
      .delete()
  }
}