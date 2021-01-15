import {BoxProps, chakra, Spinner, Stack, Table, Tbody, Th, Thead, Tr, useToken} from "@chakra-ui/react";
import {Moment} from "moment";
import React from "react";
import {Chart} from "react-google-charts";
import {useTranslation} from "react-i18next";
import {BankTransaction, Rubriek} from "../../generated/graphql";
import {useCreateAggregationByCategoryByMonth} from "../../utils/DataEngine";
import Section from "../Layouts/Section";

const ChakraChart = chakra(Chart);

const useCreateAggregationByRubriek = data => {
	const {t} = useTranslation();
	const _data = data.reduce((result, tr: BankTransaction & { rubriek: Rubriek }) => {
		const rubriek: string = tr.journaalpost?.grootboekrekening?.rubriek?.naam || t("ongeboekt");
		return {
			...result,
			[rubriek]: [
				...result[rubriek] || [],
				tr
			]
		};
	}, {inkomsten: {}, uitgaven: {}});

	return _data;
};

const InkomstenUitgaven: React.FC<BoxProps & { startDate: Moment, endDate: Moment, transactions: BankTransaction[] }> = ({startDate, endDate, transactions}) => {
	const {t} = useTranslation();
	const [color1, color2] = useToken("colors", ["primary.300", "secondary.300"]);

	const chartData = useCreateAggregationByCategoryByMonth(transactions);
	const columns = [t("interval.period"), t("charts.inkomstenUitgaven.income"), t("charts.inkomstenUitgaven.expenses")];

	return (<>
		<Section>
			<ChakraChart
				height={"500px"}
				chartType="AreaChart"
				loader={<Spinner />}
				data={[columns, ...chartData]}
				options={{
					title: t("charts.inkomstenUitgaven.title"),
					chartArea: {width: "90%", height: "80%"},
					legend: {position: "top"},
					colors: [color1, color2],
					lineWidth: 1,
					pointSize: 5
				}}
				// For tests
				// rootProps={{"data-testid": "1"}}
			/>

			<pre>{JSON.stringify(useCreateAggregationByRubriek(transactions), null, 2)}</pre>
		</Section>

		<Section>
			<Stack justifyContent={"center"} alignItems={"center"}>

				<Table maxW={800} size={"sm"}>
					<Thead>
						<Tr>
							<Th>{t("month")}</Th>
							<Th isNumeric>{t("income")}</Th>
							<Th isNumeric>{t("expenses")}</Th>
						</Tr>
					</Thead>
					<Tbody>
						{/*{filteredData.map((d, i) => (*/}
						{/*	<Tr key={i}>*/}
						{/*		<Td>{d.time.format("MMM YYYY")}</Td>*/}
						{/*		<Td isNumeric>{currencyFormat2(false).format(d.income)}</Td>*/}
						{/*		<Td isNumeric>{currencyFormat2(false).format(d.expense)}</Td>*/}
						{/*	</Tr>*/}
						{/*))}*/}
					</Tbody>
				</Table>

			</Stack>
		</Section>
	</>);
};

export default InkomstenUitgaven;