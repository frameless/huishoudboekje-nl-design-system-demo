import {create} from "zustand";
import {defaultBanktransactieFilters} from "../components/Bankzaken/Transacties/defaultBanktransactieFilters";
import {BankTransactionSearchFilter, SearchTransactiesQueryVariables} from "../generated/graphql";

type StoreValue = {
	// Values
	burgerSearch: string,
	banktransactieFilters?: BankTransactionSearchFilter,
	banktransactieQueryVariables?: SearchTransactiesQueryVariables,
	featureFlags: Record<string, boolean>,

	// Operations
	setBurgerSearch: (searchTerm: string) => void,
	setFeatureFlags: (featureFlags: Record<string, boolean>) => void,
	setBanktransactieFilters: (banktransactieFilters: BankTransactionSearchFilter) => void,
	setBanktransactieQueryVariables: (queryVariables: SearchTransactiesQueryVariables) => void,
};

const useStore = create<StoreValue>((set) => ({
	burgerSearch: "",
	banktransactieFilters: defaultBanktransactieFilters,
	banktransactieQueryVariables: undefined,
	featureFlags: {},

	setBurgerSearch: (searchTerm: string) => set(state => ({
		...state,
		burgerSearch: searchTerm,
	})),
	setFeatureFlags: (featureFlags: Record<string, boolean>) => {
		set(store => ({
			...store,
			featureFlags,
		}));
	},
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
