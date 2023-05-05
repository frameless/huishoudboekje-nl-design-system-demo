import { BankTransactionSearchFilter } from "../../../generated/graphql";

export const defaultBanktransactieFilters: BankTransactionSearchFilter = {
	automatischGeboekt: undefined,
	burgerIds: undefined,
	endDate: undefined,
	startDate: undefined,
	minBedrag: undefined,
	maxBedrag: undefined,
	onlyBooked: undefined,
	onlyCredit: undefined,
	ibans: undefined,
	zoektermen: undefined
};
