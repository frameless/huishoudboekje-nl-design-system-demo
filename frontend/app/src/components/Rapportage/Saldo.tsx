import {BoxProps, FormControl, HStack, Spinner, Stack, Text, useToken} from "@chakra-ui/react";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import ChakraChart, {chartProps} from "../../config/theme/custom/Chart";
import {BurgerRapportage, Saldo as StartSaldo} from "../../generated/graphql";
import {prepareChartData} from "../../utils/things";
import {Granularity, createChartAggregation} from "./Aggregator";
import {RapportageContext} from "./context";
import RadioButtonGroup from "../shared/RadioButtonGroup";

const Saldo: React.FC<BoxProps & {transactions: BurgerRapportage[], startSaldo: number, granularity: Granularity, setGranularity: (value) => void, granularityOptions}> = ({transactions, startSaldo, granularity, setGranularity, granularityOptions}) => {
	const {t} = useTranslation();
	const [colorSaldo] = useToken("colors", ["blue.300"]);
	const {startDate, endDate} = useContext(RapportageContext);


	const aggregation = createChartAggregation(startDate, transactions, granularity);

	const columns = [t("interval.month", {count: 2}), t("charts.saldo.title")];
	const chartTemplate = prepareChartData(startDate, endDate, granularity, columns.length - 1);
	const generateChartData = (chartTemplate, aggregation) => {
		let saldo = startSaldo
		return chartTemplate.map(chartItem => {
			const [period] = chartItem;
			const {income = 0, expenses = 0} = aggregation[period] || {};
			saldo += income + expenses;
			startSaldo += income + expenses
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
		<Stack height={"600px"}>
			<HStack justifyContent={"space-between"}>
				<Stack>
					<Text fontSize={"md"} color={"gray.500"}>{t("charts.saldo.helperText")}</Text>
				</Stack>
				<Stack>
					<FormControl paddingRight={50}>
						<RadioButtonGroup name={"granularity"} onChange={setGranularity}  defaultValue={Granularity.Weekly} value={granularity} options={granularityOptions} />
					</FormControl>
				</Stack>
			</HStack>

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
