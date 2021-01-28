import {BoxProps, Spinner, useToken} from "@chakra-ui/react";
import moment from "moment";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../generated/graphql";
import {prepareChartData} from "../../utils/things";
import {FormLeft} from "../Forms/FormLeftRight";
import ChakraChart, {chartProps} from "../Layouts/Chart";
import Section from "../Layouts/Section";
import {createAggregation} from "./Aggregator";
import {RapportageContext} from "./context";

const Saldo: React.FC<BoxProps & { transactions: BankTransaction[] }> = ({transactions}) => {
	const {t} = useTranslation();
	const [color1, color2] = useToken("colors", ["primary.300", "secondary.300"]);
	const {startDate, endDate} = useContext(RapportageContext);

	const [aggregation] = createAggregation(transactions);

	const columns = [t("interval.month", {count: 2}), t("charts.saldo.title")];
	const chartTemplate = prepareChartData(startDate, endDate, columns.length - 1);
	const chartData = (chartTemplate: any[], aggregation) => {
		let saldo = 0;
		return chartTemplate.map(chartItem => {
			const [period] = chartItem;
			const {income = 0, expenses = 0} = aggregation[period] || {};
			saldo += (income + expenses);

			return [
				moment(period, "YYYY MM").format("MMM YYYY"),
				saldo
			];
		});
	};

	const data = [
		columns,
		...chartData(chartTemplate, aggregation)
	];

	return (
		<Section>
			<FormLeft title={t("charts.saldo.title")} helperText={t("charts.saldo.helperText")} />

			<ChakraChart
				height={"500px"}
				chartType="AreaChart"
				loader={<Spinner />}
				data={data}
				options={{
					hAxis: {
						title: t("interval.month", {count: 2}),
					},
					chartArea: {width: "90%", height: "80%"},
					legend: {position: "top"},
					colors: [color1, color2],
					lineWidth: 1,
					pointSize: 5,
					// onLoad: console.log
				}}
				// For tests
				rootProps={{"data-testid": "1"}}
				{...chartProps}
			/>
		</Section>
	);
};

export default Saldo;