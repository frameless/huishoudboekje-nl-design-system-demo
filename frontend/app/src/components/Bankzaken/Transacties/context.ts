import {createContext} from "react";

type TransactionsContextValue = {
	refetch: VoidFunction,
};

export const TransactionsContext = createContext<TransactionsContextValue>({
	refetch: () => undefined,
});