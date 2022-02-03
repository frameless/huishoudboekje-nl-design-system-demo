import React, {useState} from "react";

type BurgerSearchContextValue = {
	search: string,
	setSearch: (search: string) => void,
}

export const BurgerSearchContext = React.createContext<BurgerSearchContextValue>({
	search: "",
	setSearch: () => void(0),
});

const BurgerSearchProvider = ({children}) => {
	const [search, setSearch] = useState<string>("");
	const defaultValue = {
		search: search.trim(),
		setSearch,
	}

	return (
		<BurgerSearchContext.Provider value={defaultValue}>
			{children}
		</BurgerSearchContext.Provider>
	)
}

export default BurgerSearchProvider;