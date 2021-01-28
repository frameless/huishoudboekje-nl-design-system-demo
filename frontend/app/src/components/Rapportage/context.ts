import moment, {Moment} from "moment";
import {createContext} from "react";
import {Granularity} from "./Aggregator";

type RapportageContextValue = {
	startDate: Moment,
	endDate: Moment,
	granularity: Granularity
}

export const RapportageContext = createContext<RapportageContextValue>({
	startDate: moment(),
	endDate: moment(),
	granularity: Granularity.Monthly
});