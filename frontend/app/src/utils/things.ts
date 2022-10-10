/* t("months.jan"), t("months.feb"), t("months.mrt"), t("months.apr"), t("months.may"), t("months.jun"), t("months.jul"), t("months.aug"), t("months.sep"), t("months.oct"), t("months.nov"), t("months.dec") */
import {useToken} from "@chakra-ui/react";
import arrayToSentence from "array-to-sentence";
import currency from "currency.js";
import {ManipulateType} from "dayjs";
import {friendlyFormatIBAN} from "ibantools";
import {createContext} from "react";
import {defaultBanktransactieFilters} from "../components/Bankzaken/Transacties/defaultBanktransactieFilters";
import {Granularity, periodFormatForGranularity} from "../components/Rapportage/Aggregator";
import {Afspraak, BankTransaction, Burger, GebruikersActiviteit, Huishouden, Organisatie, Rubriek} from "../generated/graphql";
import {BanktransactieFilters} from "../models/models";
import d from "./dayjs";

const HHB_NUMMER_FORMAT = "HHB000000";

export const searchFields = (term: string, fields: string[]): boolean => {
	const _fields = fields.filter(f => f);

	if (_fields.length === 0) {
		return false;
	}

	return _fields.map(f => f.toLowerCase()).some(s => s.includes(term.toLowerCase()));
};

export const Regex = {
	ZipcodeNL: /^[1-9][0-9]{3}[A-Za-z]{2}$/i,
	PhoneNumberNL: /^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$/,
	MobilePhoneNL: /^(((\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$/i,
	IbanNL: /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]{0,16})$/,
	BsnNL: /^\d{9}$/,
	Date: /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
	KvkNummer: /^([0-9]{8})$/,
	Vestigingsnummer: /^([0-9]{12})$/,
};

export const Months = ["jan", "feb", "mrt", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export const isDev = process.env.NODE_ENV === "development";

type DrawerContextProps = {
	onClose: () => void
};

export const DrawerContext = createContext<DrawerContextProps>({
	onClose: () => {
		return;
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

export const formatBurgerName = (burger: Burger | undefined, fullName = true): string => {
	if (!burger) {
		return "?";
	}

	const {voornamen, achternaam, voorletters} = burger;

	if (fullName) {
		return [voornamen, achternaam].join(" ");
	}

	return [
		voorletters?.replace(/\./g, "").split("").join(". ") + ".",
		achternaam,
	].join(" ");
};

export const formatHuishoudenName = (huishouden: Huishouden | undefined): string => {
	const allBurgers = (huishouden?.burgers || []).map(b => b.achternaam);

	/* Filter out double last names. */
	const burgerLastNames = Array.from(new Set(allBurgers));
	return burgerLastNames.join("-");
};

export const formatIBAN = (iban?: string): string => {
	return friendlyFormatIBAN(iban) || "";
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
export const getOrganisatieForTransaction = (t: BankTransaction): Organisatie | undefined => t.journaalpost?.afspraak?.afdeling?.organisatie;

export const prepareChartData = (startDate: d.Dayjs, endDate: d.Dayjs, granularity: Granularity, columns = 1) => {
	if (!startDate.isValid()) {
		// console.error("Invalid startDate", startDate);
		return [];
	}

	if (!endDate.isValid()) {
		// console.error("Invalid endDate", endDate);
		return [];
	}

	const nPeriods = {
		[Granularity.Monthly]: Math.abs(endDate.endOf("month").diff(startDate.startOf("month"), "month")) + 1,
		[Granularity.Weekly]: Math.abs(endDate.endOf("month").diff(startDate.startOf("month"), "week")) + 1,
		[Granularity.Daily]: Math.abs(endDate.endOf("month").diff(startDate.startOf("month"), "day")) + 1,
	}[granularity];

	const timeUnits: Record<Granularity, ManipulateType> = {
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
		return d().endOf("day").isSameOrBefore(_validThrough);
	}

	// If there's no validThrough, assume this Afspraak is active.
	return true;
};

export const getBurgerHhbId = (burger: Burger) => burger.id && String(burger.id).padStart(9, HHB_NUMMER_FORMAT);

export const maxOrganisatieNaamLengthBreakpointValues = [25, 25, 35, 75];

export const createQueryParamsFromFilters = (filters: Partial<BanktransactieFilters>) => {
	const _filters = {
		...defaultBanktransactieFilters,
		...filters,
	};

	return {
		isGeboekt: _filters.onlyUnbooked ? false : undefined,
		isCredit: {
			all: undefined,
			income: true,
			expenses: false,
		}[_filters.isCredit || defaultBanktransactieFilters.isCredit],
		..._filters.dateRange && _filters.dateRange.from && _filters.dateRange.through && {
			transactieDatum: {
				BETWEEN: [d(_filters.dateRange.from).format("YYYY-MM-DD"), d(_filters.dateRange.through).format("YYYY-MM-DD") || undefined],
			},
		},
		..._filters.tegenrekeningIban && {
			tegenRekening: {
				EQ: _filters.tegenrekeningIban,
			},
		},
		..._filters.bedragRange && {
			bedrag: {
				BETWEEN: _filters.bedragRange,
			},
		},
	};
};
