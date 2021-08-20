import {createContext} from "react";

type TransactionsContextValue = {
	queryVariables: object,
};

export const TransactionsContext = createContext<TransactionsContextValue>({
	queryVariables: {},
});