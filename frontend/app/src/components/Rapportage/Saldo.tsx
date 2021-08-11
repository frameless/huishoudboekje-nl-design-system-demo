import {BoxProps, Spinner, useToken} from "@chakra-ui/react";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import ChakraChart, {chartProps} from "../../config/theme/custom/Chart";
import {BankTransaction} from "../../generated/graphql";
import {prepareChartData} from "../../utils/things";
import {FormLeft} from "../Layouts/Forms";
import {createAggregation} from "./Aggregator";
import {RapportageContext} from "./context";

const Saldo: React.FC<BoxProps & {transactions: BankTransaction[]}> = ({transactions}) => {
	const {t} = useTranslation();
	const [colorSaldo] = useToken("colors", ["blue.300"]);
	const {startDate, endDate, granularity} = useContext(RapportageContext);

	const [aggregation] = createAggregation(transactions, granularity);

	const columns = [t("interval.month", {count: 2}), t("charts.saldo.title")];
	const chartTemplate = prepareChartData(startDate, endDate, granularity, columns.length - 1);
	const chartData = (chartTemplate: any[], aggregation) => {
		let saldo = 0;
		return chartTemplate.map(chartItem => {
			const [period] = chartItem;
			const {income = 0, expenses = 0} = aggregation[period] || {};
			saldo += (income + expenses);

			return [
				period,
				saldo,
			];
		});
	};

	const data = [
		columns,
		...chartData(chartTemplate, aggregation),
	];

	return (<>
		<FormLeft title={t("charts.saldo.title")} helperText={t("charts.saldo.helperText")} />
		<ChakraChart
			height={"500px"}
			chartType="AreaChart"
			loader={<Spinner />}
			data={data}
			options={{
				chartArea: {width: "90%", height: "80%"},
				legend: {position: "top"},
				colors: [colorSaldo],
				lineWidth: 1,
				pointSize: 5,
				// onLoad: console.log
			}}
			// For tests
			rootProps={{"data-testid": "1"}}
			{...chartProps}
		/>
	</>);
};

export default Saldo;