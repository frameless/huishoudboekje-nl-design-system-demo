import {create} from "zustand";

const initialState: State = {
	page: 1,
	filterByActive: true,
	filterByInactive: false,
	filterByCitizens: [],
	filterByTypes: []
  }

type State = {
	page: number
	filterByActive: boolean,
	filterByInactive: boolean,
	filterByCitizens: string[],
	filterByTypes: number[]
  }

  
  type Action = {
	updatePage: (page: State['page']) => void
	setFilterByActive: (filterByActive: State['filterByActive']) => void
	setFilterByInactive: (filterByActive: State['filterByInactive']) => void
	setFilterByCitizens: (filterByCitizens: State['filterByCitizens']) => void
	setFilterByTypes: (filterByTypes: State['filterByTypes']) => void
	reset: () => void
  }


const useSignalPageStore = create<State & Action>((set) => ({
	...initialState,
	updatePage: (newPage) => set({ page: newPage }),
	setFilterByActive: (newValue) => set({ filterByActive: newValue }),
	setFilterByInactive: (newValue) => set({ filterByInactive: newValue }),
	setFilterByCitizens: (newValue) => set({ filterByCitizens: newValue }),
	setFilterByTypes: (newValue) => set({ filterByTypes: newValue }),
	reset: () => {
	  set(initialState)
	},
  }))

export default useSignalPageStore;
