import {BoxProps, Spinner, useToken} from "@chakra-ui/react";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../generated/graphql";
import {prepareChartData} from "../../utils/things";
import {createAggregation} from "./Aggregator";
import {FormLeft} from "../Forms/FormLeftRight";
import ChakraChart from "../Layouts/Chart";
import Section from "../Layouts/Section";
import {RapportageContext} from "./context";

const Saldo: React.FC<BoxProps & { transactions: BankTransaction[] }> = ({transactions}) => {
	const {t} = useTranslation();
	const [color1, color2] = useToken("colors", ["primary.300", "secondary.300"]);
	const {startDate, endDate} = useContext(RapportageContext);

	const aggregation = createAggregation(transactions);

	const columns = [t("interval.month", {count: 2}), t("charts.saldo.title")];
	const chartTemplate = prepareChartData(startDate, endDate, columns.length - 1);

	// LEFTHERE
	// const {data} = aggregation.reduce((result, d) => {
	// 	const [month, _in, _out] = d;
	// 	const balance = _in - _out;
	//
	// 	result.total += balance;
	// 	result.data.push([month, (result.total)]);
	// 	return result;
	// }, {
	// 	data: [], total: 0
	// });
	const data = [];

	return (<>
		<Section>
			<FormLeft title={t("charts.saldo.title")} helperText={t("charts.saldo.helperText")} />

			<ChakraChart
				height={"500px"}
				chartType="AreaChart"
				loader={<Spinner />}
				data={[
					columns,
					...(data.length > 0 ? data : [["", 0]])
				]}
				options={{
					hAxis: {title: t("interval.month", {count: 2})},
					vAxis: {minValue: 0},
					chartArea: {width: "90%", height: "80%"},
					legend: {position: "top"},
					colors: [color1, color2],
					lineWidth: 1,
					pointSize: 5
				}}
				// For tests
				rootProps={{"data-testid": "1"}}
			/>
		</Section>
	</>);
};

export default Saldo;