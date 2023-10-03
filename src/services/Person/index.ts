import firestore from '@react-native-firebase/firestore';
import { Person } from '../../@types/Person';

export default class PersonService {
    static async CreatePerson(person: Person) {
        return firestore()
        .collection('Persons')
        .add(person)
    }

    static async GetPersonByCreator(creatorID: string) {
        return firestore()
        .collection('Persons')
        .orderBy('name')
        .where('creatorID', '==', creatorID)
        .get()
        .then(res => {
            let data = res?.docs?.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            }) as Person[] || []  
            return data
        })
    }
}