import {create} from "zustand";
import { ActiveSwitch } from "../Burgers/BurgerDetail/BurgerSignalenView";

const initialState: State = {
	page: 1,
	filterByActive: {active: true, inactive: false},
	filterByCitizens: [],
	filterByTypes: []
  }

type State = {
	page: number
	filterByActive: ActiveSwitch,
	filterByCitizens: string[],
	filterByTypes: number[]
  }

  
  type Action = {
	updatePage: (page: State['page']) => void
	setFilterByActive: (filterByActive: State['filterByActive']) => void
	setFilterByCitizens: (filterByCitizens: State['filterByCitizens']) => void
	setFilterByTypes: (filterByTypes: State['filterByTypes']) => void
	reset: () => void
  }


const useSignalPageStore = create<State & Action>((set) => ({
	...initialState,
	updatePage: (newPage) => set({ page: newPage }),
	setFilterByActive: (newValue) => set({ filterByActive: newValue }),
	setFilterByCitizens: (newValue) => set({ filterByCitizens: newValue }),
	setFilterByTypes: (newValue) => set({ filterByTypes: newValue }),
	reset: () => {
	  set(initialState)
	},
  }))

export default useSignalPageStore;
