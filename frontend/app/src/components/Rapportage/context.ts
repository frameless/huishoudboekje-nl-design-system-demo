import moment, {Moment} from "moment";
import {createContext} from "react";

type RapportageContextValue = {
	startDate: Moment,
	endDate: Moment,
}

export const RapportageContext = createContext<RapportageContextValue>({
	startDate: moment(),
	endDate: moment()
});