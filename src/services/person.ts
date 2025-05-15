import firestore from '@react-native-firebase/firestore';

import { Person } from '@interfaces/person';

import { COLLECTION } from '@enums/collections';


export default class PersonService {
	static async CreatePerson(person: Person) {
		return firestore()
			.collection(COLLECTION.Persons)
			.add(person)
	}

	static async EditPerson(person: Person) {
		return firestore()
			.collection(COLLECTION.Persons)
			.doc(person.id)
			.update(person)
	}

	static async DeletePerson(person: Person) {
		return firestore()
			.collection(COLLECTION.Persons)
			.doc(person.id)
			.delete()
	}

	static async GetPersonByCreator(creatorID: string) {
		return firestore()
			.collection(COLLECTION.Persons)
			.orderBy('name')
			.where('creatorID', '==', creatorID)
			.get()
			.then(res => {
				const data = res?.docs?.map((doc) => {
					return {
						id: doc.id,
						...doc.data()
					}
				}) as Person[] || []
				return data
			})
	}

	static async GetPersonByID(personID: string) {
		return firestore()
			.collection(COLLECTION.Persons)
			.doc(personID)
			.get()
			.then(res => {
				if (!res.exists) return {}
				return {
					id: res.id,
					...res.data()
				} as Person
			})
	}

	static async DeleteAllUserPersons(userID: string) {
		const batch = firestore().batch();

		const queryUserIsCreator = await firestore()
			.collection(COLLECTION.Persons)
			.where('creatorID', '==', userID)
			.get()
			.then((res) => {
				res.forEach((q) => {
					batch.delete(q.ref)
				})
			})

		Promise.all([queryUserIsCreator])
			.then(() => {
				return batch.commit()
			})
			.catch(() => {
				throw {
					code: 'Erro ao deletar todos os devedores/recebedores do usuário'
				}
			})
	}
}