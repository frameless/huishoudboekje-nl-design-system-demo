import {create} from "zustand";
import {defaultBanktransactieFilters} from "../components/Bankzaken/Transacties/defaultBanktransactieFilters";
import {BankTransactionSearchFilter, SearchTransactiesQueryVariables} from "../generated/graphql";

type StoreValue = {
	// Values
	burgerSearch: string,
	transactionDescriptionFilter: boolean,
	banktransactieFilters?: BankTransactionSearchFilter,
	banktransactieQueryVariables?: SearchTransactiesQueryVariables,

	// Operations
	setBurgerSearch: (searchTerm: string) => void,
	setTransactionDescriptionFilter: (filter: boolean) => void,
	setBanktransactieFilters: (banktransactieFilters: BankTransactionSearchFilter) => void,
	setBanktransactieQueryVariables: (queryVariables: SearchTransactiesQueryVariables) => void,
};

const useStore = create<StoreValue>((set) => ({
	burgerSearch: "",
	transactionDescriptionFilter: true,
	banktransactieFilters: defaultBanktransactieFilters,
	banktransactieQueryVariables: undefined,

	setBurgerSearch: (searchTerm: string) => set(state => ({
		...state,
		burgerSearch: searchTerm,
	})),
	setTransactionDescriptionFilter: (filter: boolean) => set(state => ({
		...state,
		transactionDescriptionFilter: filter,
	})),
	setBanktransactieFilters: (banktransactieFilters: BankTransactionSearchFilter) => {
		set(store => ({
			...store,
			banktransactieFilters,
		}));
	},
	setBanktransactieQueryVariables: (queryVariables: SearchTransactiesQueryVariables) => {
		set(store => ({
			...store,
			banktransactieQueryVariables: queryVariables,
		}));
	},
}));

export default useStore;
