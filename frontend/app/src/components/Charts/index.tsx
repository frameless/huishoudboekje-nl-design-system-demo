import {Box, chakra, Spinner} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import {Chart} from "react-google-charts";
import {useTranslation} from "react-i18next";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";

const ChakraChart = chakra(Chart);

const ChartsTest = () => {
	const {t} = useTranslation();

	const data = [
		[t("interval.month", {count: 2}), t("forms.agreements.fields.income"), t("forms.agreements.fields.expenses")],
		[moment("2020-01-01").format("MMM YYYY"), 1000,  850],
		[moment("2020-02-01").format("MMM YYYY"), 1000,  860],
		[moment("2020-03-01").format("MMM YYYY"), 1000, 1100],
		[moment("2020-04-01").format("MMM YYYY"), 1000,  700],
		[moment("2020-05-01").format("MMM YYYY"), 1000,  850],
		[moment("2020-06-01").format("MMM YYYY"), 1250,  850],
		[moment("2020-07-01").format("MMM YYYY"), 1000,  880],
		[moment("2020-08-01").format("MMM YYYY"), 1000,  860],
		[moment("2020-09-01").format("MMM YYYY"), 1000, 1150],
		[moment("2020-10-01").format("MMM YYYY"), 1000,  580],
		[moment("2020-11-01").format("MMM YYYY"), 1000,  830],
		[moment("2020-12-01").format("MMM YYYY"), 1150,  850],
	];

	return (
		<Page title={"Charts test"}>

			<Section title={"Area chart"}>

				<Box bg={"blue.500"} justifyContent={"center"}>
					<ChakraChart
						height={"500px"}
						chartType="AreaChart"
						loader={<Spinner />}
						data={data}
						options={{
							title: "Inkomsten en uitgaven per maand",
							hAxis: {title: t("interval.month", {count: 2})},
							vAxis: {minValue: 0},
							// For the legend to fit, we make the chart area smaller
							chartArea: {width: "50%", height: "70%"},
							// lineWidth: 25
						}}
						// For tests
						rootProps={{"data-testid": "1"}}
					/>
				</Box>

			</Section>

		</Page>
	);
};

export default ChartsTest;