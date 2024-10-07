import {create} from "zustand";

const initialState: State = {
	page: 1,
	selectedLogTypes: [2]
  }

type State = {
	page: number
	selectedLogTypes: number[]
  }

  
  type Action = {
	updatePage: (page: State['page']) => void
	setSelectedLogTypes: (selectedLogTypes: State['selectedLogTypes']) => void
	reset: () => void
  }


const useGebeurtenissenPageStore = create<State & Action>((set) => ({
	...initialState,
	updatePage: (newPage) => set({ page: newPage }),
	setSelectedLogTypes: (newValue) => set({selectedLogTypes: newValue }),
	reset: () => {
	  set(initialState)
	},
  }))

export default useGebeurtenissenPageStore;
