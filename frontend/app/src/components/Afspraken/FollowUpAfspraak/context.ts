import React from "react";
import {Organisatie, Rubriek} from "../../../generated/graphql";

export type FollowUpAfspraakFormContextType = {
	organisaties: Organisatie[],
	rubrieken: Rubriek[],
};

const initialValue: FollowUpAfspraakFormContextType = {
	organisaties: [],
	rubrieken: [],
};

const FollowUpAfspraakFormContext = React.createContext<FollowUpAfspraakFormContextType>(initialValue);
export default FollowUpAfspraakFormContext;