import { create } from 'zustand'
import { Alert } from 'react-native'

import PersonService from '@services/Person'

import { Person } from '@store/Person/types'
import { AuthErrorTypes } from '@store/Firebase/types'
import { useUserStore } from '@store/User'

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
            set({selectedPersonID: personID})
        },
        getPersonsByCreator: async () => {
            const {user} = useUserStore.getState()

            set({loadingPersons: true})
            await PersonService.GetPersonByCreator(user.uid)
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