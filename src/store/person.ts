import { create } from 'zustand'
import { Alert } from 'react-native'

import PersonService from '@services/person'

import { FIREBASE_ERROR } from '@enums/firebase'

import { useUserStore } from '@store/user'

import { Person } from '@interfaces/person'

type PersonStore = {
	persons: Person[]
	selectedPersonID: string | null
	loadingPersons: boolean
	getPersonsByCreator: () => void
	setSelectedPersonID: (p: string) => void
}

export const usePersonStore = create<PersonStore>((set) => {
	return {
		persons: [],
		selectedPersonID: null,
		loadingPersons: false,
		setSelectedPersonID: (personID) => {
			set({ selectedPersonID: personID })
		},
		getPersonsByCreator: async () => {
			const { user } = useUserStore.getState()

			set({ loadingPersons: true })
			await PersonService.GetPersonByCreator(user.uid)
				.then((res) => {
					set({ persons: res })
				})
				.catch((err) => {
					Alert.alert('Erro ao buscar lista de pessoas', FIREBASE_ERROR[err.code] || err.code)
					set({ persons: [] })
				})
				.finally(() => {
					set({ loadingPersons: false })
				})
		},
	}
})