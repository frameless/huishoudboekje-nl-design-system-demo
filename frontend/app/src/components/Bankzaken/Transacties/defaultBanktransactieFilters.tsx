import { BankTransactionSearchFilter } from "../../../generated/graphql";

export const defaultBanktransactieFilters: BankTransactionSearchFilter = {
	automatischGeboekt: undefined,
	burgerIds: undefined,
	endDate: undefined,
	startDate: undefined,
	minBedrag: undefined,
	maxBedrag: undefined,
	onlyBooked: false,
	onlyCredit: undefined,
	ibans: undefined,
	zoektermen: undefined,
	organisatieIds: undefined
};
