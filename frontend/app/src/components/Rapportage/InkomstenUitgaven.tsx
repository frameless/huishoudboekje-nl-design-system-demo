import {BoxProps, Spinner, useToken} from "@chakra-ui/react";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import ChakraChart from "../../config/theme/custom/Chart";
import {BankTransaction} from "../../generated/graphql";
import {prepareChartData} from "../../utils/things";
import {FormLeft} from "../Layouts/Forms";
import Section from "../Layouts/Section";
import {createAggregation} from "./Aggregator";
import {RapportageContext} from "./context";

// Todo: specify types explicitly
const InkomstenUitgaven: React.FC<BoxProps & {transactions: BankTransaction[]}> = ({transactions = []}) => {
	const {t} = useTranslation();
	const [colorInkomsten, colorUitgaven] = useToken("colors", ["green.300", "red.300"]);
	const {startDate, endDate, granularity} = useContext(RapportageContext);

	const [aggregation] = createAggregation(transactions, granularity);

	const columns = [t("interval.period"), t("charts.inkomstenUitgaven.income"), t("charts.inkomstenUitgaven.expenses")];
	const chartTemplate = prepareChartData(startDate, endDate, granularity, columns.length - 1);
	const chartData = (chartTemplate: any[], aggregation) => chartTemplate.map(chartItem => {
		const [period, tIncome, tExpenses] = chartItem;
		const {income = 0, expenses = 0} = aggregation[period] || {};

		return [
			period,
			tIncome + income,
			tExpenses + Math.abs(expenses),
		];
	});

	const data = [
		columns,
		...chartData(chartTemplate, aggregation),
	];

	return (
		<Section>
			<FormLeft title={t("charts.inkomstenUitgaven.title")} helperText={t("charts.inkomstenUitgaven.helperText")} />

			<ChakraChart
				chartType="AreaChart"
				loader={<Spinner />}
				data={data}
				options={{
					chartArea: {width: "90%", height: "80%"},
					legend: {position: "top"},
					colors: [colorInkomsten, colorUitgaven],
					lineWidth: 1,
					pointSize: 5,
				}}
				// rootProps={{"data-testid": "1"}}
			/>
		</Section>
	);
};

export default InkomstenUitgaven;