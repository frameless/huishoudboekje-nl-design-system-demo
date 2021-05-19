import {BankTransaction, Organisatie, Rubriek} from "../../generated/graphql";
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

	const tableDataPrepare = _data.reduce((result: any, tr: RichTransaction) => {
		result[tr.isCredit ? Type.Inkomsten : Type.Uitgaven].push(tr);
		return result;
	}, splitupFormat);

	/* For table */
	const reduceByOrganisatie = (result, tr: RichTransaction) => {
		let beneficiary = tr.organisatie?.weergaveNaam || (tr.journaalpost?.afspraak?.burger ? formatBurgerName(tr.journaalpost?.afspraak?.burger) : undefined);
		const index = beneficiary || "???";
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