import {Box, BoxProps, chakra, Divider, Heading, Spinner, Stack, Text, useToken} from "@chakra-ui/react";
import React from "react";
import {Chart} from "react-google-charts";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../generated/graphql";
import {Category, useCreateAggregationByCategoryByMonth, useCreateAggregationByRubriek} from "../../utils/DataEngine";
import {currencyFormat2} from "../../utils/things";
import {FormLeft} from "../Forms/FormLeftRight";
import Section from "../Layouts/Section";

const ChakraChart = chakra(Chart);

const InkomstenUitgaven: React.FC<BoxProps & { transactions: BankTransaction[] }> = ({transactions = []}) => {
	const {t} = useTranslation();
	const [color1, color2] = useToken("colors", ["primary.300", "secondary.300"]);

	const columns = [t("interval.period"), t("charts.inkomstenUitgaven.income"), t("charts.inkomstenUitgaven.expenses")];
	const aggregationByCategoryByMonth = useCreateAggregationByCategoryByMonth(transactions);
	const aggregationByRubriek = useCreateAggregationByRubriek(transactions);

	const translatedCategory = {
		[Category.Inkomsten]: t("charts.inkomstenUitgaven.income"),
		[Category.Uitgaven]: t("charts.inkomstenUitgaven.expenses"),
	};

	const data = [
		columns,
		...(aggregationByCategoryByMonth.length > 0 ? aggregationByCategoryByMonth : [["", 0, 0]])
	];

	return (<>
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

		<Section>
			{Object.keys(aggregationByRubriek.rubrieken).map(c => {
				const categories = Object.keys(aggregationByRubriek.rubrieken[c]);
				return categories.length === 0 ? null : (
					<Stack key={c}>
						<Heading size={"md"}>{translatedCategory[c]}</Heading>
						{categories.map((r, i) => {
							return (
								<Stack direction={"row"} maxW={"500px"} pl={4} key={i}>
									<Box flex={1}>
										<Text><strong>{r === Category.Ongeboekt ? t("charts.inkomstenUitgaven.unbooked") : r}</strong></Text>
									</Box>
									<Box flex={2} textAlign={"right"}>
										<Text>{currencyFormat2(false).format(aggregationByRubriek.rubrieken[c][r])}</Text>
									</Box>
								</Stack>
							)
						})}
					</Stack>
				);
			})}

			<Divider />

			<Stack direction={"row"} maxW={"500px"} pl={4}>
				<Box flex={1}>
					<Text><strong>{t("balance")}</strong></Text>
				</Box>
				<Box flex={2} textAlign={"right"}>
					<Text>{currencyFormat2(false).format(aggregationByRubriek.balance)}</Text>
				</Box>
			</Stack>
		</Section>
	</>);
};

export default InkomstenUitgaven;