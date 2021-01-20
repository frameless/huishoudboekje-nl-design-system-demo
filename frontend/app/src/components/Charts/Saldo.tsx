import {BoxProps, chakra, Spinner, Stack, Table, Tbody, Td, Th, Thead, Tr, useToken} from "@chakra-ui/react";
import moment, {Moment} from "moment";
import React from "react";
import {Chart} from "react-google-charts";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../generated/graphql";
import {currencyFormat2} from "../../utils/things";
import {FormLeft} from "../Forms/FormLeftRight";
import Section from "../Layouts/Section";

const ChakraChart = chakra(Chart);

const InkomstenUitgaven: React.FC<BoxProps & {transactions: BankTransaction[]}> = ({transactions}) => {
	const {t} = useTranslation();
	const [color1, color2] = useToken("colors", ["primary.300", "secondary.300"]);

	const columns = [t("interval.month", {count: 2}), t("charts.saldo.title")];
	const data = [
		{time: moment("2020-01-01"), saldo: 1000},
		{time: moment("2020-02-01"), saldo: 1200},
		{time: moment("2020-03-01"), saldo: 1400},
		{time: moment("2020-04-01"), saldo: 1600},
		{time: moment("2020-05-01"), saldo: 150},
		{time: moment("2020-06-01"), saldo: -500},
		{time: moment("2020-07-01"), saldo: -250},
		{time: moment("2020-08-01"), saldo: 1150},
		{time: moment("2020-09-01"), saldo: 1000},
		{time: moment("2020-10-01"), saldo: 975},
		{time: moment("2020-11-01"), saldo: 800},
		{time: moment("2020-12-01"), saldo: 500},
	];

	const filteredData = data;

	return (<>
		<Section>
			<FormLeft title={t("charts.saldo.title")} helperText={t("charts.saldo.helperText")} />

			<ChakraChart
				height={"500px"}
				chartType="AreaChart"
				loader={<Spinner />}
				data={[columns, ...filteredData.map(d => [
					d.time.format("MMM YYYY"),
					d.saldo,
				])]}
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

		<Section>
			<Stack justifyContent={"center"} alignItems={"center"}>

				<Table maxW={800} size={"sm"}>
					<Thead>
						<Tr>
							<Th>{t("month")}</Th>
							<Th isNumeric>{t("charts.saldo.saldo")}</Th>
						</Tr>
					</Thead>
					<Tbody>
						{filteredData.map((d, i) => (
							<Tr key={i}>
								<Td>{d.time.format("MMM YYYY")}</Td>
								<Td isNumeric>{currencyFormat2(false).format(d.saldo)}</Td>
							</Tr>
						))}
					</Tbody>
				</Table>

			</Stack>
		</Section>
	</>);
};

export default InkomstenUitgaven;