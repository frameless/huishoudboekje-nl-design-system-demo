import moment from "moment";
import {useTranslation} from "react-i18next";
import {BankTransaction, Rubriek} from "../generated/graphql";

export const useCreateAggregationByCategoryByMonth = (tr: BankTransaction[]) => {
	const {t} = useTranslation();

	const filtered = tr.filter(t => t.journaalpost !== null);
	const _data = filtered.map(tr => ({
		...tr,
		rubriek: tr.journaalpost?.grootboekrekening?.rubriek
	})).reduce((result: any, tr: BankTransaction & { rubriek?: Rubriek }) => {
		const month = moment(tr.transactieDatum, "YYYY MM DD").format("YYYY-MM");
		const category = tr.journaalpost?.grootboekrekening?.rubriek ? (tr.journaalpost?.grootboekrekening?.credit ? t("inkomsten") : t("uitgaven")) : t("ongeboekt");

		result[month] = result[month] || {};
		result[month][category] = result[month][category] || 0;
		result[month][category] += parseFloat(tr.bedrag);
		return result;
	}, {});

	const chartData: any[] = [];
	for (let month in _data) {
		chartData.push([
			moment(month, "YYYY-MM").format("MMM YYYY"),
			Math.abs(_data[month].inkomsten) || 0,
			Math.abs(_data[month].uitgaven) || 0,
		])
	}

	return chartData.sort((a, b) => moment(a, "MMM YYYY").isSameOrBefore(moment(b, "MMM YYYY")) ? -1 : 1);
};