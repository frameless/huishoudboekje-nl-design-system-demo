import {BoxProps, chakra, Spinner, useToken} from "@chakra-ui/react";
import React from "react";
import {Chart} from "react-google-charts";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../generated/graphql";
import {createAggregationByCategoryByMonth} from "../../utils/DataEngine";
import {FormLeft} from "../Forms/FormLeftRight";
import Section from "../Layouts/Section";

const ChakraChart = chakra(Chart);

const InkomstenUitgaven: React.FC<BoxProps & { transactions: BankTransaction[] }> = ({transactions = []}) => {
	const {t} = useTranslation();
	const [color1, color2] = useToken("colors", ["primary.300", "secondary.300"]);

	const columns = [t("interval.period"), t("charts.inkomstenUitgaven.income"), t("charts.inkomstenUitgaven.expenses")];
	const aggregationByCategoryByMonth = createAggregationByCategoryByMonth(transactions);
	const data = [
		columns,
		...(aggregationByCategoryByMonth.length > 0 ? aggregationByCategoryByMonth : [["", 0, 0]])
	];

	return (
		<Section>
			<FormLeft title={t("charts.inkomstenUitgaven.title")} helperText={t("charts.inkomstenUitgaven.helperText")} />

			<ChakraChart
				height={"500px"}
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