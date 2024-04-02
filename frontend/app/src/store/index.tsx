import {create} from "zustand";
import {defaultBanktransactieFilters} from "../components/Bankzaken/Transacties/defaultBanktransactieFilters";
import {BankTransactionSearchFilter, SearchTransactiesQueryVariables} from "../generated/graphql";

type StoreValue = {
	// Values
	burgerSearch: string,
	banktransactieFilters?: BankTransactionSearchFilter,
	banktransactieQueryVariables?: SearchTransactiesQueryVariables,

	// Operations
	setBurgerSearch: (searchTerm: string) => void,
	setBanktransactieFilters: (banktransactieFilters: BankTransactionSearchFilter) => void,
	setBanktransactieQueryVariables: (queryVariables: SearchTransactiesQueryVariables) => void,
};

const useStore = create<StoreValue>((set) => ({
	burgerSearch: "",
	banktransactieFilters: defaultBanktransactieFilters,
	banktransactieQueryVariables: undefined,

	setBurgerSearch: (searchTerm: string) => set(state => ({
		...state,
		burgerSearch: searchTerm,
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
