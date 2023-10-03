import firestore from '@react-native-firebase/firestore';
import { Person } from '../../@types/Person';

export default class PersonService {
    static async CreatePerson(person: Person) {
        return firestore()
        .collection('Persons')
        .add(person)
    }
}