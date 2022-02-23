import {createContext, useCallback, useContext, useState} from "react";

type StoreValue = {
	burgerSearch: string,
	banktransactieFilters: Record<string, any>,
};

type StoreContextValue = {
	store: StoreValue,
	updateStore: (field: keyof StoreValue, value: any) => void
}

const initialState: StoreValue = {
	burgerSearch: "",
	banktransactieFilters: {},
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

	const updateStore = useCallback((field: string, value: any) => {
		console.info("updateStore", {field, value});
		setStore(prevStore => {
			return {
				...prevStore,
				[field]: value,
			};
		});
	}, []);

	return (
		<StoreContext.Provider value={{store, updateStore}}>
			{children}
		</StoreContext.Provider>
	);
};

export default StoreProvider;