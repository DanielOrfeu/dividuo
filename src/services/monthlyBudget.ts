import firestore from '@react-native-firebase/firestore';

import { MonthlyBudget } from '@interfaces/monthlyBudget';

import { COLLECTION } from '@enums/collections';


export default class MonthlyBudgetService {

	static async CreateMonthlyBudget(mb?: MonthlyBudget) {
		return firestore()
			.collection(COLLECTION.MonthlyBudgets)
			.add(mb)
	}

	static async GetMonthlyBudgetByID(monthlyBudgetID: string) {
		return firestore()
			.collection(COLLECTION.MonthlyBudgets)
			.doc(monthlyBudgetID)
			.get()
			.then(res => {
				if (!res.exists) return {}
				return {
					id: res.id,
					...res.data()
				} as MonthlyBudget
			})
	}

	static async GetBudgetByMonthYear(monthYear: string, creatorID: string) {
		const query = firestore()
			.collection(COLLECTION.MonthlyBudgets)
			.where('monthYear', '==', monthYear)
			.where('creatorID', '==', creatorID)

		return query.get()
			.then(res => {
				const data = res?.docs?.map((doc) => {
					return {
						id: doc.id,
						...doc.data()
					}
				}) as MonthlyBudget[] || []
				return data[0] || null
			})
	}

	static async EditMonthlyBudgetByID(mb: MonthlyBudget) {
		return firestore()
			.collection(COLLECTION.MonthlyBudgets)
			.doc(mb.id)
			.update(mb)
	}

	static async DeleteMonthlyBudgetByID(mbID: string) {
		return firestore()
			.collection(COLLECTION.MonthlyBudgets)
			.doc(mbID)
			.delete()
	}


	/*
		TODO: 
		- CreateMonthlyBudget recuperando informações do mês passado
		- Verificar se vai poder editar/crirar mês passado ou futuro
		- Integrar divida da feature principal com essa nova
	*/

}