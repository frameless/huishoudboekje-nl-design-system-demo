import {Box, BoxProps, chakra, Divider, Heading, Spinner, Stack, Text, useToken} from "@chakra-ui/react";
import {Moment} from "moment";
import React from "react";
import {Chart} from "react-google-charts";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../generated/graphql";
import {Category, useCreateAggregationByCategoryByMonth, useCreateAggregationByRubriek} from "../../utils/DataEngine";
import {currencyFormat2} from "../../utils/things";
import Section from "../Layouts/Section";

const ChakraChart = chakra(Chart);

const InkomstenUitgaven: React.FC<BoxProps & { startDate: Moment, endDate: Moment, transactions: BankTransaction[] }> = ({startDate, endDate, transactions}) => {
	const {t} = useTranslation();
	const [color1, color2] = useToken("colors", ["primary.300", "secondary.300"]);

	const columns = [t("interval.period"), t("charts.inkomstenUitgaven.income"), t("charts.inkomstenUitgaven.expenses")];
	const aggregationByCategoryByMonth = useCreateAggregationByCategoryByMonth(transactions);
	const aggregationByRubriek = useCreateAggregationByRubriek(transactions);

	const translatedCategory = {
		[Category.Inkomsten]: t("charts.inkomstenUitgaven.income"),
		[Category.Uitgaven]: t("charts.inkomstenUitgaven.expenses"),
	}

	return (<>
		<Section>
			<ChakraChart
				height={"500px"}
				chartType="AreaChart"
				loader={<Spinner />}
				data={[columns, ...aggregationByCategoryByMonth]}
				options={{
					title: t("charts.inkomstenUitgaven.title"),
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
				return (
					<Stack key={c}>
						<Heading size={"md"}>{translatedCategory[c]}</Heading>
						{Object.keys(aggregationByRubriek.rubrieken[c]).map((r, i) => {
							return (
								<Stack direction={"row"} maxW={"500px"} pl={2} key={i}>
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

			<Stack direction={"row"} maxW={"500px"} pl={2}>
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