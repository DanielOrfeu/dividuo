import { create } from 'zustand'
import { Alert } from 'react-native'
import { AuthErrorTypes } from '../../@types/Firebase'
import { Person } from '../../@types/Person'
import PersonService from '../../services/Person'

type PersonStore = {
    persons: Person[]
    selectedPersonID: string | null
    loadingPersons: boolean
    getPersonsByCreator: (userID: string) => void
    setSelectedPersonID: (p: string) => void
}

export const usePersonStore = create<PersonStore>((set) => {
    return {
        persons: [],
        selectedPersonID: null,
        loadingPersons: false,
        setSelectedPersonID: (personID) => {
            set({selectedPersonID: personID})
        },
        getPersonsByCreator: async (userID) => {
            set({loadingPersons: true})
            await PersonService.GetPersonByCreator(userID)
            .then((res) => {
                set({persons: res})
            })
            .catch((err) => {
                Alert.alert('Erro ao buscar lista de pessoas', AuthErrorTypes[err.code] || err.code)
                set({persons: []})
            })
            .finally(() => {
                set({loadingPersons: false})
            })
        },
    }
})