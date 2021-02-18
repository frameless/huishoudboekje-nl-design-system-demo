import moment, {Moment} from "moment";
import {BankTransaction, Rubriek} from "../../generated/graphql";
import {getRubriekForTransaction} from "../../utils/things";

// @i18n: t("charts.inkomstenUitgaven.income") t("charts.inkomstenUitgaven.expenses") t("charts.inkomstenUitgaven.unbooked")
export enum Type {
	Inkomsten = "income", Uitgaven = "expenses", Ongeboekt = "unbooked"
}

type RichTransaction = BankTransaction & {
	mDate: Moment,
	rubriek?: Rubriek
};

export enum Granularity {
	Monthly = "monthly",
	Weekly = "weekly",
	Daily = "daily",
}

export const periodFormatForGranularity = {
	[Granularity.Monthly]: "MMM YYYY",
	[Granularity.Weekly]: "GGGG-WW",
	[Granularity.Daily]: "DD-MM-YYYY",
};

// Todo: clean this up, can be more compact maybe?
export const createAggregation = (tr: BankTransaction[], granularity = Granularity.Monthly) => {
	// Enrich transaction with some useful data
	const _data = tr.map(t => ({
		...t,
		mDate: moment(t.transactieDatum, "YYYY MM DD"),
		rubriek: getRubriekForTransaction(t)
	}));

	/* For chart */
	const reducePerPeriod = (granularity: Granularity = Granularity.Monthly) => (result, tr) => {
		const period = tr.mDate.format(periodFormatForGranularity[granularity]);
		const type = tr.isCredit ? Type.Inkomsten : Type.Uitgaven;

		result[period] = result[period] || {};
		result[period][type] = result[period][type] || 0;
		result[period][type] += parseFloat(tr.bedrag);
		return result;
	};

	const chartData = _data.reduce(reducePerPeriod(granularity), {});

	const splitupFormat: { [Type.Inkomsten]: RichTransaction[], [Type.Uitgaven]: RichTransaction[] } = {
		[Type.Inkomsten]: [],
		[Type.Uitgaven]: [],
	}

	const tableDataPrepare = _data.reduce((result: any, tr: RichTransaction) => {
		result[tr.isCredit ? Type.Inkomsten : Type.Uitgaven].push(tr);
		return result;
	}, splitupFormat);

	/* For table */
	const reducePerRubriek = (result, tr: RichTransaction) => {
		const rubriek = tr.rubriek?.naam || Type.Ongeboekt.toString();
		result[rubriek] = result[rubriek] || 0;
		result[rubriek] += parseFloat(tr.bedrag);
		return result;
	};

	const tableData = {
		[Type.Inkomsten]: tableDataPrepare[Type.Inkomsten].reduce(reducePerRubriek, {}),
		[Type.Uitgaven]: tableDataPrepare[Type.Uitgaven].reduce(reducePerRubriek, {}),
	};

	const saldo = _data.reduce((result, tr: RichTransaction) => {
		return result + parseFloat(tr.bedrag);
	}, 0);

	return [chartData, tableData, saldo];
};