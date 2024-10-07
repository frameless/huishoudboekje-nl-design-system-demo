import {create} from "zustand";
import { defaultBanktransactieFilters } from "./defaultBanktransactieFilters";
import { BankTransactionSearchFilter } from "../../../generated/graphql";

const initialState: State = {
	page: 1,
	banktransactieFilters: defaultBanktransactieFilters
  }

type State = {
	page: number
	banktransactieFilters?: BankTransactionSearchFilter
  }
  
  type Action = {
	updatePage: (page: State['page']) => void
	setBanktransactieFilters: (banktransactieFilters: State['banktransactieFilters']) => void
	reset: () => void
  }


const useTransactionsPageStore = create<State & Action>((set) => ({
	...initialState,
	updatePage: (newPage) => set({ page: newPage }),
	setBanktransactieFilters: (banktransactieFilters) => {
		set(store => ({
			...store,
			banktransactieFilters,
		}));
	},
	reset: () => {
	  set(initialState)
	},
  }))

export default useTransactionsPageStore;
