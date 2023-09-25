import {createContext} from "react";
import d from "../../utils/dayjs";

type RapportageContextValue = {
	startDate: d.Dayjs,
	endDate: d.Dayjs,
}

export const RapportageContext = createContext<RapportageContextValue>({
	startDate: d(),
	endDate: d(),
});