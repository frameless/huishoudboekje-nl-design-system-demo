import {BoxProps, chakra, Spinner, useToken} from "@chakra-ui/react";
import React from "react";
import {Chart} from "react-google-charts";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../generated/graphql";
import {createAggregationByCategoryByMonth} from "../../utils/DataEngine";
import {FormLeft} from "../Forms/FormLeftRight";
import Section from "../Layouts/Section";

const ChakraChart = chakra(Chart);

const InkomstenUitgaven: React.FC<BoxProps & { transactions: BankTransaction[] }> = ({transactions}) => {
	const {t} = useTranslation();
	const [color1, color2] = useToken("colors", ["primary.300", "secondary.300"]);

	const aggregationByCategoryByMonth = createAggregationByCategoryByMonth(transactions);

	const columns = [t("interval.month", {count: 2}), t("charts.saldo.title")];

	const {data} = aggregationByCategoryByMonth.reduce((result, d) => {
		const [month, _in, _out] = d;
		const balance = _in - _out;

		result.total += balance;
		result.data.push([month, (result.total + balance)]);
		return result;
	}, {
		data: [], total: 0
	});

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
					title: t("charts.saldo.saldo"),
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

export default InkomstenUitgaven;