import moment from "moment";
import {BankTransaction, Rubriek} from "../generated/graphql";

// @i18n: t("charts.inkomstenUitgaven.income") t("charts.inkomstenUitgaven.expenses") t("charts.inkomstenUitgaven.unbooked")

export enum Category {
	Inkomsten = "income", Uitgaven = "expenses", Ongeboekt = "unbooked"
}

export const useCreateAggregationByCategoryByMonth = (tr: BankTransaction[]) => {
	const filtered = tr.filter(t => t.journaalpost !== null);
	const _data = filtered.map(tr => ({
		...tr,
		rubriek: tr.journaalpost?.grootboekrekening?.rubriek
	})).reduce((result: any, tr: BankTransaction & { rubriek?: Rubriek }) => {
		const month = moment(tr.transactieDatum, "YYYY MM DD").format("YYYY-MM");

		let category = Category.Ongeboekt;
		// Geboekt op rubriek
		if (tr.journaalpost?.grootboekrekening?.rubriek) {
			category = tr.journaalpost?.grootboekrekening?.credit ? Category.Inkomsten : Category.Uitgaven;
		}
		// Geboekt op afspraak
		else if (tr.journaalpost?.afspraak?.rubriek) {
			category = tr.journaalpost?.afspraak?.rubriek?.grootboekrekening?.credit ? Category.Inkomsten : Category.Uitgaven;
		}

		result[month] = result[month] || {};
		result[month][category] = result[month][category] || 0;
		result[month][category] += parseFloat(tr.bedrag);
		return result;
	}, {});

	const chartData: any[] = [];
	for (let month in _data) {
		chartData.push([
			moment(month, "YYYY-MM").format("MMM YYYY"),
			// Fixme: Here we're using strings that need to be translated as keys. This will cause errors when there are missing translations.
			Math.abs(_data[month][Category.Inkomsten]) || 0,
			Math.abs(_data[month][Category.Uitgaven]) || 0,
		])
	}

	return chartData.sort((a, b) => moment(a, "MMM YYYY").isSameOrBefore(moment(b, "MMM YYYY")) ? -1 : 1);
};

export const useCreateAggregationByRubriek = data => {
	let balance = 0;

	const _data = data.reduce((result, tr: BankTransaction & { rubriek: Rubriek }) => {
		let rubriekNaam: string = Category.Ongeboekt.toString();
		if (tr.journaalpost?.grootboekrekening?.rubriek?.naam) {
			rubriekNaam = tr.journaalpost?.grootboekrekening?.rubriek?.naam;
		}
		else if (tr.journaalpost?.afspraak?.rubriek?.naam) {
			rubriekNaam = tr.journaalpost?.afspraak?.rubriek?.naam;
		}

		const category = tr.isCredit ? Category.Inkomsten : Category.Uitgaven;
		const bedrag = parseFloat(tr.bedrag);
		balance += bedrag;

		result[category] = result[category] || {}

		return {
			...result,
			[category]: {
				...result[category],
				[rubriekNaam]: (result[category][rubriekNaam] || 0) + bedrag,
			},
		}
	}, {
		[Category.Inkomsten]: {},
		[Category.Uitgaven]: {},
	});

	return {
		rubrieken: _data,
		balance
	};
};