import {Stack} from "@chakra-ui/react";
import d from "dayjs";
import React from "react";
import {Afspraak} from "../../generated/graphql";
import ToekomstListItem from "./ToekomstListItem";

const ToekomstList: React.FC<{ afspraken: Afspraak [] }> = ({afspraken}) => {

	const getNextDate = (afspraak) => {
		let recur;
		const b = afspraak.betaalinstructie;

		if (b?.byMonthDay && b.byMonth) { // Maandelijks of eenmalig
			if (b.startDate && b.endDate) {
				const dStartDate = d(b.startDate, "YYYY-MM-DD");
				const dEndDate = d(b.endDate, "YYYY-MM-DD");
				const periodLength = Math.abs(dStartDate.diff(dEndDate, "seconds"));
				const onceDate = d().year(dStartDate.year()).month(b.byMonth[0] - 1).date(b.byMonthDay[0]);

				if (periodLength <= (3600 * 24 * 365)) {
					if (onceDate.isAfter(d())) { // Eenmalig
						return onceDate;
					}
					return undefined;
				}
			}

			recur = d().recur().every(b.byMonthDay).daysOfMonth().every((b?.byMonth || []).map(m => m - 1)).monthsOfYear();
		}
		if (b?.byDay) { // Wekelijks
			recur = d().recur().every(b?.byDay).daysOfWeek();
		}

		return recur ? recur.next(1) : undefined;
	}


	return (
		<Stack>
			{afspraken.map((afspraak, i) => {
				const nextDate = getNextDate(afspraak);

				if (nextDate && d(nextDate).isAfter(d())) {
					const format = d(nextDate).year() !== d().year() ? "dddd D MMMM YYYY" : "dddd D MMMM";
					return <ToekomstListItem key={i} datum={d(nextDate).format(format)} bedrag={afspraak.bedrag} omschrijving={afspraak.omschrijving} rekening={afspraak.tegenrekening?.iban} />
				}

				return null;
			})}
		</Stack>
	)

};

export default ToekomstList;