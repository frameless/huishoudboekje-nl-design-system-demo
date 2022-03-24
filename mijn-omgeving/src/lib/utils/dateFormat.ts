import d from "./dayjs";

export const dateString = (date: Date): string => {
	const _date = d(date).startOf("day");
	const today = d().startOf("day");

	if (_date.isSame(today)) {
		return "Vandaag";
	}

	if (_date.isSame(today.subtract(1, "day"))) {
		return "Gisteren";
	}

	const format = _date.year() !== d().year() ? "dddd D MMMM YYYY" : "dddd D MMMM";
	return d(date).format(format);
};