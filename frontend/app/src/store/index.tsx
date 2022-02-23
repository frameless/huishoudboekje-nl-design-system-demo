import {createContext, useContext, useState} from "react";

type StoreValue = Record<string, any> & {
	burgerSearch: string
};

type StoreContextValue = {
	store: StoreValue,
	updateStore: (field: keyof StoreValue, value: any) => void
}

const initialState: StoreValue = {
	burgerSearch: "",
};

const StoreContext = createContext<StoreContextValue>({
	store: initialState,
	updateStore: () => void (0),
});

export const useStore = () => {
	const {store, updateStore} = useContext(StoreContext);

	return {
		store,
		updateStore,
	};
};

const StoreProvider = ({children}) => {
	const [store, setStore] = useState<StoreContextValue["store"]>(initialState);

	const updateStore = (field: string, value: any) => {
		setStore(prevStore => {
			return {
				...prevStore,
				[field]: value,
			};
		});
	};

	return (
		<StoreContext.Provider value={{store, updateStore}}>
			{children}
		</StoreContext.Provider>
	);
};

export default StoreProvider;