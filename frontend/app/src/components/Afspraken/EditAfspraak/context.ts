import React from "react";
import {Organisatie, Rubriek} from "../../../generated/graphql";

export type AfspraakFormContextType = {
	organisaties: Organisatie[],
	rubrieken: Rubriek[],
};

const initialValue: AfspraakFormContextType = {
	organisaties: [],
	rubrieken: [],
};

const AfspraakFormContext = React.createContext<AfspraakFormContextType>(initialValue);
export default AfspraakFormContext;