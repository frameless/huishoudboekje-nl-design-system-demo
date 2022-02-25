import {createContext, useCallback, useContext, useState} from "react";
import {defaultBanktransactieFilters} from "../components/Bankzaken/Transacties/defaultBanktransactieFilters";
import {BanktransactieFilters} from "../models/models";

type StoreValue = {
	burgerSearch: string,
	banktransactieFilters?: BanktransactieFilters,
};

const initialState: StoreValue = {
	burgerSearch: "",
	banktransactieFilters: defaultBanktransactieFilters,
};

type StoreContextValue = {
	store: StoreValue,
	updateStore: (field: keyof StoreValue, value: any) => void
}

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