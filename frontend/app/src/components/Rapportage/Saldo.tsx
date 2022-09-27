import {BoxProps, Heading, Spinner, Stack, Text, useToken} from "@chakra-ui/react";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import ChakraChart, {chartProps} from "../../config/theme/custom/Chart";
import {BankTransaction} from "../../generated/graphql";
import {prepareChartData} from "../../utils/things";
import {createAggregation} from "./Aggregator";
import {RapportageContext} from "./context";

const Saldo: React.FC<BoxProps & {transactions: BankTransaction[]}> = ({transactions}) => {
	const {t} = useTranslation();
	const [colorSaldo] = useToken("colors", ["blue.300"]);
	const {startDate, endDate, granularity} = useContext(RapportageContext);

	const [aggregation] = createAggregation(transactions, granularity);

	const columns = [t("interval.month", {count: 2}), t("charts.saldo.title")];
	const chartTemplate = prepareChartData(startDate, endDate, granularity, columns.length - 1);
	const generateChartData = (chartTemplate, aggregation) => {
		let saldo = 0;
		return chartTemplate.map(chartItem => {
			const [period] = chartItem;
			const {income = 0, expenses = 0} = aggregation[period] || {};
			saldo += income + expenses;

			return [
				period,
				saldo,
			];
		});
	};

	const chartData = generateChartData(chartTemplate, aggregation);
	const data = [
		columns,
		...chartData.length > 0 ? chartData : [[0, 0]],
	];

	return (
		<Stack>
			<Heading size={"md"}>{t("charts.saldo.title")}</Heading>
			<Text fontSize={"md"} color={"gray.500"}>{t("charts.saldo.helperText")}</Text>

			<ChakraChart
				height={"500px"}
				chartType={"AreaChart"}
				loader={<Spinner />}
				data={data}
				options={{
					chartArea: {width: "90%", height: "80%"},
					legend: {position: "top"},
					colors: [colorSaldo],
					lineWidth: 1,
					pointSize: 5,
				}}
				{...chartProps}
			/>
		</Stack>
	);
};

export default Saldo;
