import {create} from "zustand";
import {defaultBanktransactieFilters} from "../components/Bankzaken/Transacties/defaultBanktransactieFilters";
import {BankTransactionSearchFilter, SearchTransactiesQueryVariables} from "../generated/graphql";

type StoreValue = {
	// Values
	burgerSearch: string,
	transactionDescriptionFilter: boolean,
	banktransactieQueryVariables?: SearchTransactiesQueryVariables,

	// Operations
	setBurgerSearch: (searchTerm: string) => void,
	setTransactionDescriptionFilter: (filter: boolean) => void,
	setBanktransactieQueryVariables: (queryVariables: SearchTransactiesQueryVariables) => void,
};

const useStore = create<StoreValue>((set) => ({
	burgerSearch: "",
	transactionDescriptionFilter: true,
	banktransactieQueryVariables: undefined,

	setBurgerSearch: (searchTerm: string) => set(state => ({
		...state,
		burgerSearch: searchTerm,
	})),
	setTransactionDescriptionFilter: (filter: boolean) => set(state => ({
		...state,
		transactionDescriptionFilter: filter,
	})),
	setBanktransactieQueryVariables: (queryVariables: SearchTransactiesQueryVariables) => {
		set(store => ({
			...store,
			banktransactieQueryVariables: queryVariables,
		}));
	},
}));

export default useStore;
