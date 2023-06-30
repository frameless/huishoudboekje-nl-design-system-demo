import {Maybe} from "graphql/jsutils/Maybe";
import {BankTransaction, BurgerRapportage, RapportageTransactie, RapportageRubriek, Organisatie, Rubriek, Scalars, Saldo} from "../../generated/graphql";
import d from "../../utils/dayjs";
import { Dayjs } from "dayjs";
import { MathOperation, floatMathOperation } from "../../utils/things";

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

export type Offsets = {
	ExpensesOffset: number, 
	IncomesOffset: number, 
	TotalOffset: number
}

export type Saldos = {
	InkomstenTotal: Maybe<Scalars['Decimal']>,
	UitgavenTotal: Maybe<Scalars['Decimal']>,
	Total: Maybe<Scalars['Decimal']>,
}

export function createSaldos(burgerRapportages: BurgerRapportage[], offsets: Offsets) {
	const result = [];
	result[Type.Inkomsten] = 0;
	result['Total'] = 0;
	result[Type.Uitgaven] = 0

	for (const rapportage of burgerRapportages) {
		result[Type.Inkomsten] += parseFloat(rapportage.totaalInkomsten);
		result['Total'] += parseFloat(rapportage.totaal);
		result[Type.Uitgaven] += parseFloat(rapportage.totaalUitgaven);
	}

	result[Type.Inkomsten] = floatMathOperation(result[Type.Inkomsten], offsets.IncomesOffset, 2, MathOperation.Minus);
	result['Total'] = floatMathOperation(result['Total'], offsets.TotalOffset, 2, MathOperation.Minus);
	result[Type.Uitgaven] = floatMathOperation(result[Type.Uitgaven], offsets.ExpensesOffset, 2, MathOperation.Minus);

	return result;
}

export function createChartAggregation(startDate: Dayjs, burgerRapportages: BurgerRapportage[], granularity: Granularity) {
	const _data = flattenTransactionArrays(burgerRapportages).filter(transaction => transaction.transactieDatum? d(transaction.transactieDatum).isSameOrAfter(startDate) : false);
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

export function createBalanceTableAggregation(startDate: Dayjs, burgerRapportages: BurgerRapportage[]) {
	const _data = flattenTransactionArrays(burgerRapportages).filter(transaction => transaction.transactieDatum? d(transaction.transactieDatum).isSameOrAfter(startDate) : false);
	const result = []
	for (const transaction of _data) {
		result[transaction.type] = result[transaction.type] || [];
		result[transaction.type][transaction.rubriek] = result[transaction.type][transaction.rubriek] || [];
		result[transaction.type][transaction.rubriek].push(transaction);
	}
	return result;
}

export function getStartingSaldo(saldos: Saldo[]) {
	let startingSaldo = 0;
	for (const saldo of saldos) {
		startingSaldo += parseFloat(saldo.saldo);
	}
	return startingSaldo;
}

export function calculateOffset(startDate: Dayjs, burgerRapportages: BurgerRapportage[]) : Offsets{
	const _data = flattenTransactionArrays(burgerRapportages).filter(transaction => transaction.transactieDatum? d(transaction.transactieDatum).isBefore(startDate) : false);
	const result = []
	let expensesOffset = 0
	let incomesOffset = 0
	for (const transaction of _data) {
		if(transaction.type === Type.Uitgaven){
			expensesOffset = floatMathOperation(expensesOffset, parseFloat(transaction.bedrag), 2, MathOperation.Plus)
		} else if (transaction.type === Type.Inkomsten) {
			incomesOffset = floatMathOperation(incomesOffset, parseFloat(transaction.bedrag), 2, MathOperation.Plus)
		}
	}
	return {ExpensesOffset: expensesOffset, IncomesOffset: incomesOffset, TotalOffset: floatMathOperation(expensesOffset, incomesOffset, 2, MathOperation.Plus)};
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
