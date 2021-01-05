import { useToken } from "@chakra-ui/react";
import {friendlyFormatIBAN} from "ibantools";
import moment from "moment";
import {createContext} from "react";
import {BankTransaction, Gebruiker, Interval, IntervalInput} from "../generated/graphql";
import {IntervalType} from "../models";

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
const IbanNL = /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]{0,16})$/;
const BsnNL = /^\d{9}$/;
const Date = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;

export const Regex = {ZipcodeNL, PhoneNumberNL, MobilePhoneNL, IbanNL, BsnNL, Date};

export const Months = ["jan", "feb", "mrt", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export const isDev = process.env.NODE_ENV === "development";

export const DrawerContext = createContext<{ onClose: () => void }>({
	onClose: () => {
	},
});

export const XInterval = {
	create: (intervalType: "day" | "week" | "month" | "year", intervalCount: any): Interval => {
		const intervalTypeConversion = {
			day: "dagen",
			week: "weken",
			month: "maanden",
			year: "jaren",
		};

		const interval = {
			jaren: 0,
			maanden: 0,
			weken: 0,
			dagen: 0,
		};

		interval[intervalTypeConversion[intervalType]] = parseInt(intervalCount);

		return interval;
	},
	empty: {
		jaren: 0,
		maanden: 0,
		weken: 0,
		dagen: 0,
	},
	parse: (interval: IntervalInput | undefined): { intervalType: IntervalType, count: number } | undefined => {
		if (!interval) {
			return undefined;
		}

		const intervalType = Object.keys(interval).filter(k => interval[k] > 0).shift();

		if (!intervalType) {
			return undefined;
		}

		const intervalTypeName = {
			dagen: "day",
			weken: "week",
			maanden: "month",
			jaren: "year",
		}[intervalType];

		return {intervalType: intervalTypeName, count: interval[intervalType]};
	},
};

/* Todo: rename to currencyFormat (03-12-2020) */
export const currencyFormat2 = (showCurrency = true) => {
	return new Intl.NumberFormat("nl-NL", {
		style: showCurrency ? "currency" : "decimal",
		...showCurrency ? {
			currency: "EUR",
		} : {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		},
	});
};

// Todo: export const dateFormat = (d: Date) => moment(d).format("L");
export const dateFormat = {
	format: (d: Date) => moment(d).format("L"),
};

export const wait = async (timeout: number = 1000): Promise<void> => {
	return new Promise(resolve => {
		setTimeout(resolve, timeout);
	});
};

export const sortBankTransactions = (a: BankTransaction, b: BankTransaction) => {
	return b.bedrag - a.bedrag;
};

export const formatBurgerName = (burger: Gebruiker, fullName = false) => {
	return [fullName ? burger.voornamen : burger.voorletters, burger.achternaam].join(" ");
};

export const intervalString = ((interval: Interval | undefined, t: (text, ...tProps) => string): string => {
	/* t("interval.every-day", { count }) t("interval.every-week", { count }) t("interval.every-month", { count }) t("interval.every-year", { count }) */
	const parsedInterval = XInterval.parse(interval);

	if (!parsedInterval) {
		return t("interval.once");
	}

	const {intervalType: type, count} = parsedInterval;
	return t(`interval.every-${type}`, {count});
});

export const formatIBAN = (iban?: string) => {
	if (iban) {
		return friendlyFormatIBAN(iban);
	}
}

export const useReactSelectStyles = () => {
	const inputBorderColor = useToken("colors","gray.200");

	return ({
		control: (provided) => ({
			...provided,
			borderColor: inputBorderColor
		})
	});
};