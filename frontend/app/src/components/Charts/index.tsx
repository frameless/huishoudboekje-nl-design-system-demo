import {Box, chakra, Divider, FormControl, FormLabel, Heading, Input, List, ListIcon, ListItem, Spinner, Stack, useToken} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import {Chart} from "react-google-charts";
import {useInput} from "react-grapple";
import {useTranslation} from "react-i18next";
import {MdCheckCircle} from "react-icons/all";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";

const ChakraChart = chakra(Chart);

const ChartsTest = () => {
	const {t} = useTranslation();
	const [color1, color2] = useToken("colors", ["primary.300", "secondary.300"]);

	const startDate = useInput({
		defaultValue: moment().year(2020).startOf("year").format("L"),
	});
	const endDate = useInput({
		defaultValue: moment().year(2020).endOf("year").format("L"),
	});

	const columns = [t("interval.month", {count: 2}), t("forms.agreements.fields.income"), t("forms.agreements.fields.expenses")];
	const data = [
		[moment("2020-01-01").format("MMM YYYY"), 1000, 850],
		[moment("2020-02-01").format("MMM YYYY"), 1000, 860],
		[moment("2020-03-01").format("MMM YYYY"), 1000, 1100],
		[moment("2020-04-01").format("MMM YYYY"), 1000, 700],
		[moment("2020-05-01").format("MMM YYYY"), 1000, 850],
		[moment("2020-06-01").format("MMM YYYY"), 1250, 850],
		[moment("2020-07-01").format("MMM YYYY"), 1000, 880],
		[moment("2020-08-01").format("MMM YYYY"), 1000, 860],
		[moment("2020-09-01").format("MMM YYYY"), 1000, 1150],
		[moment("2020-10-01").format("MMM YYYY"), 1000, 580],
		[moment("2020-11-01").format("MMM YYYY"), 1000, 830],
		[moment("2020-12-01").format("MMM YYYY"), 1150, 850],
	].filter((d, i) => {
		const isAfter = moment(d[0], "MMM YYYY").isSameOrAfter(moment(startDate.value, "L"));
		const isBefore = moment(d[0], "MMM YYYY").isSameOrBefore(moment(endDate.value, "L"));

		return isAfter && isBefore;
	});

	return (
		<Page title={"Charts test"} position={"relative"}>

			<Stack maxWidth={500} position={"absolute"} top={0} right={0}>
				<Stack bg={"white"} borderRadius={10} p={5}>
					<Heading size={"sm"}>Todo:</Heading>
					<List>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="green.500" />
							Periode
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Granulariteit (dag/week/maand)
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Selectie op grootboek/rubriek
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Saldo vs. buffer
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Trendlijn?
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Todo verwijderen
						</ListItem>
					</List>
				</Stack>

				<Stack bg={"white"} borderRadius={10} p={5}>
					<Heading size={"sm"}>Acceptatiecriteria:</Heading>
					<List>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Scherm met rapportage staat gelinkt in navigatiemenu.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Rapportageperiode is instelbaar van een datum tot en met eenzelfde of opvolgende datum.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Gegevens worden in een tabel weergegeven.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Inkomsten en uitgaven zijn per soort gegroepeerd weergegeven.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Inkomsten en uitgaven zijn per rubriek weergegeven.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Filteren gegevens op geen, een of meerdere burgers.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Filteren gegevens op geen, een of meerdere rubrieken.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Gegevens worden in een grafiek weergegeven.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Trend saldo op balans wordt in een LineChart weergegeven
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Datapunt in grafiek is geaggregeerd op kalendermaand
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Datapunt in grafiek kan in detail bekeken worden: periode datapunt, metriek en waarde. Bijvoorbeeld: "1-1-2020 t/m 31-1-2020 Saldo: € 1.234,-"
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Trend inkomsten wordt in een AreaChart weergegeven
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} color="gray.500" />
							Trend uitgaven wordt in een AreaChart weergegeven
						</ListItem>
					</List>
				</Stack>
			</Stack>

			<Section title={"Area chart"}>

				<Stack direction={["column", "row"]}>
					<FormLeft title={t("Inkomsten en uitgaven")} helperText={"Een overzicht van inkomsten en uitgaven over tijd."} />
					<FormRight>

						<Stack direction={["column", "row"]} justifyContent={["space-around"]} maxW={500}>
							<FormControl as={Stack} flex={1} justifyContent={"flex-end"}>
								<FormLabel>{t("forms.common.fields.startDate")}</FormLabel>
								<DatePicker selected={moment(startDate.value, "L").isValid() ? moment(startDate.value, "L").toDate() : null}
								            dateFormat={"dd-MM-yyyy"}
								            onChange={(value: Date) => {
									            if (value) {
										            startDate.setValue(moment(value).format("L"));
									            }
								            }} customInput={(<Input {...startDate.bind} />)} />
							</FormControl>
							<FormControl as={Stack} flex={1}>
								<FormLabel>{t("forms.common.fields.endDate")}</FormLabel>
								<DatePicker selected={moment(endDate.value, "L").isValid() ? moment(endDate.value, "L").toDate() : null}
								            dateFormat={"dd-MM-yyyy"}
								            onChange={(value: Date) => {
									            if (value) {
										            endDate.setValue(moment(value).format("L"));
									            }
								            }} customInput={(<Input {...startDate.bind} />)} />
							</FormControl>
						</Stack>
					</FormRight>
				</Stack>

				<Divider />

				<Box justifyContent={"center"}>
					<ChakraChart
						height={"500px"}
						chartType="AreaChart"
						loader={<Spinner />}
						data={[columns, ...data]}
						options={{
							title: "Inkomsten en uitgaven per maand",
							hAxis: {title: t("interval.month", {count: 2})},
							vAxis: {minValue: 0},
							chartArea: {width: "90%", height: "80%"},
							legend: {position: "top"},
							lineWidth: 0,
							colors: [color1, color2]
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