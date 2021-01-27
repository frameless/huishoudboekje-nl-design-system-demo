import {BoxProps, Spinner, useToken} from "@chakra-ui/react";
import moment from "moment";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../generated/graphql";
import {prepareChartData} from "../../utils/things";
import {FormLeft} from "../Forms/FormLeftRight";
import ChakraChart from "../Layouts/Chart";
import Section from "../Layouts/Section";
import {createAggregation} from "./Aggregator";
import {RapportageContext} from "./context";

// Todo: specify types explicitly
const InkomstenUitgaven: React.FC<BoxProps & { transactions: BankTransaction[] }> = ({transactions = []}) => {
	const {t} = useTranslation();
	const [color1, color2] = useToken("colors", ["primary.300", "secondary.300"]);
	const {startDate, endDate} = useContext(RapportageContext);

	const columns = [t("interval.period"), t("charts.inkomstenUitgaven.income"), t("charts.inkomstenUitgaven.expenses")];
	const [aggregatedByPeriod] = createAggregation(transactions);

	const chartTemplate = prepareChartData(startDate, endDate, columns.length - 1);

	const chartData = (chartTemplate: any[], aggregation) => {
		return chartTemplate.map(chartItem => {
			const [period, tIncome, tExpenses] = chartItem;
			const {income = 0, expenses = 0} = aggregation[period] || {};

			return [
				moment(period, "YYYY MM").format("MMM YYYY"),
				tIncome + income,
				tExpenses + Math.abs(expenses)
			];
		});
	};

	const data = [
		columns,
		...chartData(chartTemplate, aggregatedByPeriod)
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
					colors: [color1, color2],
					lineWidth: 1,
					pointSize: 5
				}}
				// rootProps={{"data-testid": "1"}}
			/>
		</Section>
	);
};

export default InkomstenUitgaven;