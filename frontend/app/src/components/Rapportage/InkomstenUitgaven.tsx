import {BoxProps, Spinner, useToken} from "@chakra-ui/react";
import moment, {Moment} from "moment";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../generated/graphql";
import {createAggregationByCategoryByMonth} from "../../utils/DataEngine";
import {FormLeft} from "../Forms/FormLeftRight";
import ChakraChart from "../Layouts/Chart";
import Section from "../Layouts/Section";
import {RapportageContext} from "./context";

const InkomstenUitgaven: React.FC<BoxProps & { transactions: BankTransaction[] }> = ({transactions = []}) => {
	const {t} = useTranslation();
	const [color1, color2] = useToken("colors", ["primary.300", "secondary.300"]);
	const {startDate, endDate} = useContext(RapportageContext);

	const columns = [t("interval.period"), t("charts.inkomstenUitgaven.income"), t("charts.inkomstenUitgaven.expenses")];
	const aggregationByCategoryByMonth = createAggregationByCategoryByMonth(transactions);
	// const data = [
	// 	columns,
	// 	...(aggregationByCategoryByMonth.length > 0 ? aggregationByCategoryByMonth : [["", 0, 0]])
	// ];

	const prepareData = (startDate: Moment, endDate: Moment, columns: number = 1): any[] => {
		const nMonths = Math.abs(endDate.endOf("month").diff(startDate.startOf("month"), "month")) + 1;

		return new Array(nMonths).fill(0).map((_, i) => {
			return ([
				moment(startDate).add(i, "month").startOf("month").format("MMM YYYY"),
				...new Array(columns).fill(0)
			]);
		});
	}

	const data = [
		columns,
		...prepareData(startDate, endDate, columns.length - 1)
	];

	return (
		<Section>
			<pre>{JSON.stringify({data, aggregationByCategoryByMonth}, null, 2)}</pre>

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