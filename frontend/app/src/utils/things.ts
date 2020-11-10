import {createContext} from "react";

export const searchFields = (term: string, fields: string[]): boolean => {
	const _fields = fields.filter(f => f);

	if (_fields.length === 0) {
		return false;
	}

	return _fields.map(f => f.toLowerCase()).some(s => s.includes(term.toLowerCase()));
};

export const MOBILE_BREAKPOINT = 650;
export const TABLET_BREAKPOINT = 1000;

const ZipcodeNL = /^[1-9][0-9]{3}[A-Za-z]{2}$/i;
const PhoneNumberNL = /^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$/;
const MobilePhoneNL = /^(((\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$/i;
const IbanNL = /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/;
const BsnNL = /^\d{9}$/;
const Date = /^(\d{2})-(\d{2})-(\d{4})$/;

export const Regex = {ZipcodeNL, PhoneNumberNL, MobilePhoneNL, IbanNL, BsnNL, Date};

export const Months = ["jan", "feb", "mrt", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export const isDev = process.env.NODE_ENV === "development";

export const DrawerContext = createContext<{ onClose: () => void }>({
	onClose: () => {}
});

export const createInterval = (intervalType: "day" | "week" | "month" | "year", intervalCount: any) => {
	const intervalTypeConversion = {
		"day": "dagen",
		"week": "weken",
		"month": "maanden",
		"year": "jaren",
	};

	const interval = {
		jaren: 0,
		maanden: 0,
		weken: 0,
		dagen: 0,
	}

	interval[intervalTypeConversion[intervalType]] = parseInt(intervalCount);

	return interval;
};

export const numberFormat = new Intl.NumberFormat("nl-NL");
export const dateFormat = new Intl.DateTimeFormat("nl-NL");