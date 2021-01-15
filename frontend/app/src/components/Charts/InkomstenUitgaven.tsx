import {BoxProps, chakra, Divider, Heading, Spinner, Stack, Text, useToken} from "@chakra-ui/react";
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
	let balance = 0;

	const _data = data.reduce((result, tr: BankTransaction & { rubriek: Rubriek }) => {
		let rubriekNaam: string = t("ongeboekt");
		if (tr.journaalpost?.grootboekrekening?.rubriek?.naam) {
			rubriekNaam = tr.journaalpost?.grootboekrekening?.rubriek?.naam;
		}

		const category = tr.isCredit ? t("inkomsten") : t("uitgaven");
		const bedrag = parseFloat(tr.bedrag);
		balance += bedrag;

		return {
			...result,
			[category]: {
				...result[category],
				[rubriekNaam]: (result[category][rubriekNaam] || 0) + bedrag,
			},
		}
	}, {
		inkomsten: {},
		uitgaven: {},
	});

	return {
		data: _data,
		balance
	};
};

const InkomstenUitgaven: React.FC<BoxProps & { startDate: Moment, endDate: Moment, transactions: BankTransaction[] }> = ({startDate, endDate, transactions}) => {
	const {t} = useTranslation();
	const [color1, color2] = useToken("colors", ["primary.300", "secondary.300"]);

	const chartData = useCreateAggregationByCategoryByMonth(transactions);
	const columns = [t("interval.period"), t("charts.inkomstenUitgaven.income"), t("charts.inkomstenUitgaven.expenses")];

	const tableData = useCreateAggregationByRubriek(transactions);
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

			<pre>{JSON.stringify(tableData, null, 2)}</pre>
		</Section>

		<Section>
			<Stack justifyContent={"center"} alignItems={"center"}>

				{Object.keys(tableData.data).map(c => {
					return (
						<Stack>
							<Heading>{c}</Heading>
							{Object.keys(tableData.data[c]).map((r, i) => {
								return (
									<Stack direction={"row"}>
										<Text><strong>{r}</strong></Text>
										<Text>{tableData.data[c][r]}</Text>
									</Stack>
								)
							})}
						</Stack>
					);
				})}

				<Divider />

				<Stack direction={"row"}>
					<Text><strong>{t("balance")}</strong></Text>
					<Text>{tableData.balance}</Text>
				</Stack>

			</Stack>
		</Section>
	</>);
};

export default InkomstenUitgaven;