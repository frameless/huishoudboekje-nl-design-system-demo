import moment from "moment";
import {Interval, Overschrijving, OverschrijvingStatus} from "../generated/graphql";
import {XInterval} from "./things";

type SampleOverschrijvingenProps = {bedrag: number, startDate: Date, startDate2: Date, endDate: Date, interval: Interval, nTimes: number};
const generateSampleOverschrijvingen = ({bedrag, startDate, startDate2, endDate, interval, nTimes = 0}: SampleOverschrijvingenProps): Overschrijving[] => {
	const o: Overschrijving = {
		export: {},
		datum: "",
		bedrag,
		status: OverschrijvingStatus.Verwachting,
	};

	const parsedInterval = XInterval.parse(interval);

	let mStartDate = moment(startDate);
	let mStartDate2 = moment(startDate2);
	let mEndDate = moment(endDate);

	if (!parsedInterval || !mStartDate.isValid() || !mStartDate2.isValid() || !mEndDate.isValid()) {
		return [];
	}

	// Limit the startDate of the prognosis
	if(mStartDate2.isBefore(mStartDate)){
		mStartDate2 = mStartDate;
	}

	try {
		const recursion = moment(startDate).recur({start: mStartDate, end: mEndDate}).every(parsedInterval.count)[parsedInterval.intervalType]();
		const nextDates = nTimes > 0 ? [...recursion.fromDate(mStartDate2).next(nTimes)] : [...recursion.fromDate(mStartDate2).all()];
		return nextDates.map(m => ({
			...o,
			datum: m.toDate(),
		}));
	} catch (err) {
		return [];
	}
};

export default generateSampleOverschrijvingen;