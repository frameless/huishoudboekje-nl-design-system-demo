import {BoxProps, FormControl, HStack, Spinner, Stack, Text, useToken} from "@chakra-ui/react";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import ChakraChart from "../../config/theme/custom/Chart";
import {BurgerRapportage} from "../../generated/graphql";
import {prepareChartData} from "../../utils/things";
import {Granularity, createChartAggregation} from "./Aggregator";
import {RapportageContext} from "./context";
import RadioButtonGroup from "../shared/RadioButtonGroup";

// Todo: specify types explicitly
const InkomstenUitgaven: React.FC<BoxProps & {transactions: BurgerRapportage[], granularity: Granularity, setGranularity: (value) => void, granularityOptions}> = ({transactions = [], granularity, setGranularity, granularityOptions}) => {
	const {t} = useTranslation();
	const [colorInkomsten, colorUitgaven] = useToken("colors", ["green.300", "red.300"]);
	const {startDate, endDate} = useContext(RapportageContext);

	const aggregation = createChartAggregation(startDate,transactions, granularity);

	const columns = [t("interval.period"), t("charts.inkomstenUitgaven.income"), t("charts.inkomstenUitgaven.expenses")];
	const chartTemplate = prepareChartData(startDate, endDate, granularity, columns.length - 1);
	const chartData = (chartTemplate, aggregation) => chartTemplate.map(chartItem => {
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
		<Stack  height={"600px"}>
			<HStack justifyContent={"space-between"}>
				<Stack>
					<Text fontSize={"md"} color={"gray.500"}>{t("charts.inkomstenUitgaven.helperText")}</Text>
				</Stack>
				<Stack>
					<FormControl paddingRight={50}>
						<RadioButtonGroup name={"granularity"} onChange={setGranularity}  defaultValue={Granularity.Weekly} value={granularity} options={granularityOptions} />
					</FormControl>
				</Stack>
			</HStack>
			<ChakraChart
				chartType={"AreaChart"}
				loader={<Spinner />}
				data={data}
				options={{
					chartArea: {width: "90%", height: "80%"},
					legend: {position: "top"},
					colors: [colorInkomsten, colorUitgaven],
					lineWidth: 1,
					pointSize: 5,
				}}
			/>
		</Stack>
	);
};

export default InkomstenUitgaven;
