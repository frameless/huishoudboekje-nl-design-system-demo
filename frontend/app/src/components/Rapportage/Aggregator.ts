import {Maybe} from "graphql/jsutils/Maybe";
import {BankTransaction, BurgerRapportage, RapportageTransactie, RapportageRubriek, Organisatie, Rubriek, Scalars} from "../../generated/graphql";
import d from "../../utils/dayjs";
import {formatBurgerName, getOrganisatieForTransaction, getRubriekForTransaction} from "../../utils/things";

// @i18n: t("charts.inkomstenUitgaven.income") t("charts.inkomstenUitgaven.expenses") t("charts.inkomstenUitgaven.unbooked")
export enum Type {
	Inkomsten = "income",
	Uitgaven = "expenses",
	Ongeboekt = "unbooked"
}

type RichTransaction = BankTransaction & {
	dayjsDate: d.Dayjs,
	rubriek?: Rubriek,
	organisatie?: Organisatie,
};

export type Transaction = RapportageTransactie & {
	type: Type,
	rubriek: string
}

export enum Granularity {
	Monthly = "monthly",
	Weekly = "weekly",
	Daily = "daily",
}

export const periodFormatForGranularity = {
	[Granularity.Monthly]: "MMM YYYY",
	[Granularity.Weekly]: "gggg-ww",
	[Granularity.Daily]: "DD-MM-YYYY",
};

export type Saldos = {
	InkomstenTotal: Maybe<Scalars['Decimal']>,
	UitgavenTotal: Maybe<Scalars['Decimal']>,
	Total: Maybe<Scalars['Decimal']>,
}

export function createSaldos(burgerRapportages: BurgerRapportage[]) {
	const result = [];
	result[Type.Inkomsten] = 0;
	result['Total'] = 0;
	result[Type.Uitgaven] = 0

	for (const rapportage of burgerRapportages) {
		result[Type.Inkomsten] += parseFloat(rapportage.totaalInkomsten);
		result['Total'] += parseFloat(rapportage.totaal);
		result[Type.Uitgaven] += parseFloat(rapportage.totaalUitgaven);
	}

	return result;
}

export function createChartAggregation(burgerRapportages: BurgerRapportage[], granularity: Granularity) {
	const _data = flattenTransactionArrays(burgerRapportages);
	const chartData = [];
	for (const entry of _data) {
		const period = d(entry.transactieDatum, "YYYY MM DD").format(periodFormatForGranularity[granularity]);
		if (chartData[period] == undefined) {
			chartData[period] = [];
		}
		chartData[period][entry.type] = chartData[period][entry.type] || 0;
		chartData[period][entry.type] += parseFloat(entry.bedrag);

	}
	return chartData;
}

export function createBalanceTableAggregation(burgerRapportages: BurgerRapportage[]) {
	const result = []
	for (const transaction of flattenTransactionArrays(burgerRapportages)) {
		result[transaction.type] = result[transaction.type] || [];
		result[transaction.type][transaction.rubriek] = result[transaction.type][transaction.rubriek] || [];
		result[transaction.type][transaction.rubriek].push(transaction);
	}

	return result;
}

function getTransactionsFromRapportageRubrieks(rapportageRubrieken: RapportageRubriek[], type: Type): Transaction[] {
	const result: Transaction[] = [];
	for (const rubriek of rapportageRubrieken ?? []) {
		for (const transaction of rubriek.transacties ?? []) {
			result.push({
				...transaction,
				type: type,
				rubriek: rubriek.rubriek ?? "onbekend"
			})
		}
	}
	return result;
}

function flattenTransactionArrays(burgerRapportages: BurgerRapportage[]): Transaction[] {
	let result: Transaction[] = [];

	for (const rapportages of burgerRapportages) {
		result = result.concat(getTransactionsFromRapportageRubrieks(rapportages.inkomsten ?? [], Type.Inkomsten))
		result = result.concat(getTransactionsFromRapportageRubrieks(rapportages.uitgaven ?? [], Type.Uitgaven))
	}

	return result;
}
