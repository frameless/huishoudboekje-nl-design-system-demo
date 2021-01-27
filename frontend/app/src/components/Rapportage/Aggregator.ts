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

enum Granularity {
	Monthly,
	Weekly,
	Daily,
}

const periodFormatForGranularity = {
	[Granularity.Monthly]: "YYYY-MM",
	[Granularity.Weekly]: "YYYY-WW",
	[Granularity.Daily]: "YYYY-MM-DD",
};

// Todo: clean this up, can be more compact maybe?
export const createAggregation = (tr: BankTransaction[]) => {
	// Enrich transaction with some useful data
	const _data = tr.map(t => ({
		...t,
		mDate: moment(t.transactieDatum, "YYYY MM DD"),
		rubriek: getRubriekForTransaction(t)
	}));

	// const period = tr.mDate.format("YYYY-MM");
	// const category = tr.rubriek?.naam || "";
	// result[period] = result[period] || {};
	// result[period][category] = result[period][category] || 0;
	// result[period][category] += parseFloat(tr.bedrag);

	/* For chart */
	const reducePerPeriod = (granularity: Granularity = Granularity.Monthly) => (result, tr) => {
		const period = tr.mDate.format(periodFormatForGranularity[granularity]);
		const type = tr.isCredit ? Type.Inkomsten : Type.Uitgaven;

		result[period] = result[period] || {};
		result[period][type] = result[period][type] || 0;
		result[period][type] += parseFloat(tr.bedrag);
		return result;
	};

	// Todo: put this in a useState in /src/components/Rapportage/index.tsx and bind to a button so that it can be changed (27-01-2021)
	const granularity = Granularity.Monthly;
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
		[Type.Uitgaven]: tableDataPrepare[Type.Uitgaven].reduce(reducePerRubriek, {})
	};

	return [chartData, tableData];
};

/** @deprecated Use createAggregation instead
 * Todo: remove */
export const createAggregationByRubriek = data => {
	let balance = 0;

	const _data = data.reduce((result, tr: BankTransaction & { rubriek: Rubriek }) => {
		let rubriekNaam: string = Type.Ongeboekt.toString();
		if (tr.journaalpost?.grootboekrekening?.rubriek?.naam) {
			rubriekNaam = tr.journaalpost?.grootboekrekening?.rubriek?.naam;
		}
		else if (tr.journaalpost?.afspraak?.rubriek?.naam) {
			rubriekNaam = tr.journaalpost?.afspraak?.rubriek?.naam;
		}

		const category = tr.isCredit ? Type.Inkomsten : Type.Uitgaven;
		const bedrag = parseFloat(tr.bedrag);
		balance += bedrag;

		return {
			...result,
			[category]: {
				...result[category] || {},
				[rubriekNaam]: (result[category][rubriekNaam] || 0) + bedrag,
			},
		}
	}, {
		[Type.Inkomsten]: {},
		[Type.Uitgaven]: {},
	});

	return {
		rubrieken: _data,
		balance
	};
};