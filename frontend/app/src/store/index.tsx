import create from "zustand";
import {defaultBanktransactieFilters} from "../components/Bankzaken/Transacties/defaultBanktransactieFilters";
import {GetTransactiesQueryVariables} from "../generated/graphql";
import {BanktransactieFilters} from "../models/models";

type StoreValue = {
	// Values
	burgerSearch: string,
	banktransactieFilters?: BanktransactieFilters,
	banktransactieQueryVariables?: GetTransactiesQueryVariables,
	featureFlags: Record<string, boolean>,

	// Operations
	setBurgerSearch: (searchTerm: string) => void,
	setFeatureFlags: (featureFlags: Record<string, boolean>) => void,
	setBanktransactieFilters: (banktransactieFilters: BanktransactieFilters) => void,
	setBanktransactieQueryVariables: (queryVariables: GetTransactiesQueryVariables) => void,
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
	setBanktransactieFilters: (banktransactieFilters: BanktransactieFilters) => {
		set(store => ({
			...store,
			banktransactieFilters,
		}));
	},
	setBanktransactieQueryVariables: (queryVariables: GetTransactiesQueryVariables) => {
		set(store => ({
			...store,
			banktransactieQueryVariables: queryVariables,
		}));
	},
}));

export default useStore;
