import {BankTransaction, BurgerRapportage, RapportageTransactie, RapportageRubriek, Organisatie, Rubriek} from "../../generated/graphql";
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

type Transaction = RapportageTransactie & {
	type: Type
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

function getTransactionsFromRapportageRubrieks(rapportageRubrieken: RapportageRubriek[], type: Type): Transaction[] {
	const result: Transaction[] = [];
	for (const rubriek of rapportageRubrieken ?? []) {
		for (const transaction of rubriek.transacties ?? []) {
			result.push({
				...transaction,
				type: Type.Inkomsten
			})
		}
	}
	return result;
}

export function createChartAggregation(burgerRapportages: BurgerRapportage[], granularity: Granularity) {
	let _data: Transaction[] = [];

	for (const rapportages of burgerRapportages) {
		_data = _data.concat(getTransactionsFromRapportageRubrieks(rapportages.inkomsten ?? [], Type.Inkomsten))
		_data = _data.concat(getTransactionsFromRapportageRubrieks(rapportages.uitgaven ?? [], Type.Uitgaven))
	}


	const reduceByPeriod = (granularity: Granularity = Granularity.Monthly) => (result, tr) => {
		const period = d(tr.transactieDatum, "YYYY MM DD").format(periodFormatForGranularity[granularity]);

		result[period] = result[period] || {};
		result[period][tr.type] = result[period][tr.type] || 0;
		result[period][tr.type] += parseFloat(tr.bedrag);
		return result;
	};

	const chartData = _data.reduce(reduceByPeriod(granularity), {});
	return chartData;
}

export function createBalanceTableAggregation(burgerRapportages: BurgerRapportage[]){
	
}

// Todo: clean this up, can be more compact maybe?
export const createAggregation = (tr: BankTransaction[], granularity = Granularity.Monthly) => {
	// Enrich transaction with some useful data
	const _data = tr.map(t => ({
		...t,
		dayjsDate: d(t.transactieDatum, "YYYY MM DD"),
		rubriek: getRubriekForTransaction(t),
		organisatie: getOrganisatieForTransaction(t),
	}));

	/* For chart */
	const reduceByPeriod = (granularity: Granularity = Granularity.Monthly) => (result, tr) => {
		const period = tr.dayjsDate.format(periodFormatForGranularity[granularity]);
		const type = tr.isCredit ? Type.Inkomsten : Type.Uitgaven;

		result[period] = result[period] || {};
		result[period][type] = result[period][type] || 0;
		result[period][type] += parseFloat(tr.bedrag);
		return result;
	};

	const chartData = _data.reduce(reduceByPeriod(granularity), {});

	const splitupFormat: {[Type.Inkomsten]: RichTransaction[], [Type.Uitgaven]: RichTransaction[]} = {
		[Type.Inkomsten]: [],
		[Type.Uitgaven]: [],
	};

	const tableDataPrepare = _data.reduce((result, tr: RichTransaction) => {
		result[tr.isCredit ? Type.Inkomsten : Type.Uitgaven].push(tr);
		return result;
	}, splitupFormat);

	/* For table */
	const reduceByOrganisatie = (result, tr: RichTransaction) => {
		const beneficiary = tr.organisatie?.naam || (tr.journaalpost?.afspraak?.burger ? formatBurgerName(tr.journaalpost?.afspraak?.burger) : undefined);
		const index = beneficiary || "Niet afgeletterd"; // Todo: i18n / translate
		result[index] = result[index] || 0;
		result[index] += parseFloat(tr.bedrag);
		return result;
	};

	const tableData = {
		[Type.Inkomsten]: tableDataPrepare[Type.Inkomsten].reduce(reduceByOrganisatie, {}),
		[Type.Uitgaven]: tableDataPrepare[Type.Uitgaven].reduce(reduceByOrganisatie, {}),
	};

	const saldo = _data.reduce((result, tr: RichTransaction) => {
		return result + parseFloat(tr.bedrag);
	}, 0);

	return [chartData, tableData, saldo];
};
