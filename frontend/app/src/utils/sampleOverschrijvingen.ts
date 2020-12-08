import moment from "moment";
import {Interval, Overschrijving, OverschrijvingStatus} from "../generated/graphql";
import {XInterval} from "./things";

type SampleOverschrijvingenProps = {bedrag: number, startDate: Date, endDate: Date, interval: Interval, nTimes: number};
const generateSampleOverschrijvingen = ({bedrag, startDate, endDate, interval, nTimes = 0}: SampleOverschrijvingenProps): Overschrijving[] => {
	const o: Overschrijving = {
		export: {},
		datum: "",
		bedrag,
		status: OverschrijvingStatus.Verwachting,
	};

	const parsedInterval = XInterval.parse(interval);

	let mStartDate = moment(startDate);
	let mEndDate = moment(endDate);

	if (!parsedInterval || !mStartDate.isValid() || !mEndDate.isValid()) {
		return [];
	}

	if (nTimes === 0) {
		/* Limit the date range from the start of the current year until the end of next year, otherwise moment-recur will go wild */
		if (mStartDate.isBefore(moment().startOf("year"))) {
			mStartDate = moment().startOf("year");
		}
		if (mEndDate.isAfter(moment().add(2, "year"))) {
			mEndDate = moment().add(2, "year");
		}
	}

	try {
		const recursion = moment(startDate).recur({start: mStartDate, end: mEndDate}).every(parsedInterval.count)[parsedInterval.intervalType]();
		const nextDates = nTimes > 0 ? [...recursion.next(nTimes)] : [...recursion.all()];
		return nextDates.map(m => ({
			...o,
			datum: m.toDate(),
		}));
	} catch (err) {
		return [];
	}
};

export default generateSampleOverschrijvingen;