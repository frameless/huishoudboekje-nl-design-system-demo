/* t("months.jan"), t("months.feb"), t("months.mrt"), t("months.apr"), t("months.may"), t("months.jun"), t("months.jul"), t("months.aug"), t("months.sep"), t("months.oct"), t("months.nov"), t("months.dec") */
import {useToken} from "@chakra-ui/react";
import arrayToSentence from "array-to-sentence";
import currency from "currency.js";
import {friendlyFormatIBAN} from "ibantools";
import {createContext} from "react";
import {Granularity, periodFormatForGranularity} from "../components/Rapportage/Aggregator";
import {Afspraak, BankTransaction, Burger, GebruikersActiviteit, Organisatie, Rubriek} from "../generated/graphql";
import d from "./dayjs";

const HHB_NUMMER_FORMAT = "HHB000000";

export const searchFields = (term: string, fields: string[]): boolean => {
	const _fields = fields.filter(f => f);

	if (_fields.length === 0) {
		return false;
	}

	return _fields.map(f => f.toLowerCase()).some(s => s.includes(term.toLowerCase()));
};

const ZipcodeNL = /^[1-9][0-9]{3}[A-Za-z]{2}$/i;
const PhoneNumberNL = /^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$/;
const MobilePhoneNL = /^(((\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$/i;
const IbanNL = /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]{0,16})$/;
const BsnNL = /^\d{9}$/;
const Date = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;

export const Regex = {ZipcodeNL, PhoneNumberNL, MobilePhoneNL, IbanNL, BsnNL, Date};

export const Months = ["jan", "feb", "mrt", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export const isDev = process.env.NODE_ENV === "development";

export const DrawerContext = createContext<{onClose: () => void}>({
	onClose: () => {
	},
});

/*
 * Format to EUR: 					currencyFormat(12999.23).format()); // "12.999,23"
 * Parse from EUR (user input): 	currencyFormat("12.999,23").toString() // "12999.23"
 */
export const currencyFormat = value => currency(value, {separator: "", decimal: ",", symbol: ""});

/* Todo: move to currencyFormat (03-12-2020) */
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

export const sortBankTransactions = (a: BankTransaction, b: BankTransaction) => {
	return b.bedrag - a.bedrag;
};

export const formatBurgerName = (burger: Burger | undefined, fullName = true) => {
	if (fullName) {
		return [burger?.voornamen, burger?.achternaam].join(" ");
	}

	const voorletters = burger?.voorletters?.replace(/\./g, "").split("").join(". ") + ".";
	return [voorletters, burger?.achternaam].join(" ");
};

export const formatIBAN = (iban?: string) => {
	if (iban) {
		return friendlyFormatIBAN(iban);
	}
};

export const useReactSelectStyles = () => {
	const [inputBorderColor, inputBorderErrorColor] = useToken("colors", ["gray.200", "red.500"]);

	return {
		default: {
			control: (provided) => ({
				...provided,
				borderColor: inputBorderColor,
			}),
			option: (provided) => ({
				...provided,
				textAlign: "left",
			}),
		},
		error: {
			control: (provided) => ({
				...provided,
				borderColor: inputBorderErrorColor,
				borderWidth: "2px",
			}),
			option: (provided) => ({
				...provided,
				textAlign: "left",
			}),
		},
	};
};

export const humanJoin = (x) => arrayToSentence(x, {
	lastSeparator: " en ",
});

export const getRubriekForTransaction = (t: BankTransaction): Rubriek | undefined => t.journaalpost?.grootboekrekening?.rubriek || t.journaalpost?.afspraak?.rubriek;
export const getOrganisatieForTransaction = (t: BankTransaction): Organisatie | undefined => t.journaalpost?.afspraak?.organisatie;

export const prepareChartData = (startDate: d.Dayjs, endDate: d.Dayjs, granularity: Granularity, columns: number = 1): any[] => {
	if (!startDate.isValid()) {
		console.error("Invalid startDate", startDate);
		return [];
	}

	if (!endDate.isValid()) {
		console.error("Invalid endDate", endDate);
		return [];
	}

	const nPeriods = {
		[Granularity.Monthly]: (Math.abs(endDate.endOf("month").diff(startDate.startOf("month"), "month")) + 1),
		[Granularity.Weekly]: (Math.abs(endDate.endOf("month").diff(startDate.startOf("month"), "week")) + 1),
		[Granularity.Daily]: (Math.abs(endDate.endOf("month").diff(startDate.startOf("month"), "day")) + 1),
	}[granularity];

	const timeUnits: Record<Granularity, any> = {
		[Granularity.Monthly]: "month",
		[Granularity.Weekly]: "week",
		[Granularity.Daily]: "day",
	};

	return new Array(nPeriods).fill(0).map((_, i) => [
		d(startDate).add(i, timeUnits[granularity]).startOf(timeUnits[granularity]).format(periodFormatForGranularity[granularity]),
		...new Array(columns).fill(0),
	]);
};

export const sanitizeIBAN = (iban: string) => iban.replace(/\s/g, "").toUpperCase();

export const sortAuditTrailByTime = (a: GebruikersActiviteit, b: GebruikersActiviteit) => d(a.timestamp).isBefore(b.timestamp) ? 1 : -1;

export const truncateText = (str: string, maxLength = 50) => {
	const padding = Math.floor((maxLength - 10) / 2);
	if (str.length > maxLength) {
		return str.substr(0, padding) + "..." + str.substr(str.length - padding, str.length);
	}

	return str;
};

export const isAfspraakActive = (afspraak: Afspraak) => {
	const {validThrough} = afspraak;

	if (validThrough) {
		const _validThrough = d(validThrough, "YYYY-MM-DD").endOf("day");
		return (d().endOf("day").isSameOrBefore(_validThrough));
	}

	// If there's no validThrough, assume this Afspraak is active.
	return true;
};

export const getBurgerHhbId = (burger: Burger) => burger.id && String(burger.id).padStart(9, HHB_NUMMER_FORMAT);