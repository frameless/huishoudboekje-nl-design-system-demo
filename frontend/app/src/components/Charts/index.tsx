import {
	Box, chakra, Divider, FormControl, FormLabel, Heading, Input, List, ListIcon, ListItem, Slider, Spinner, Stack, SliderTrack, SliderFilledTrack, SliderThumb, useToken, HStack, Flex
} from "@chakra-ui/react";
import moment from "moment";
import React, {useState} from "react";
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
		{time: moment("2020-01-01"), income: 1000, expense: 850},
		{time: moment("2020-02-01"), income: 1000, expense: 860},
		{time: moment("2020-03-01"), income: 1000, expense: 1100},
		{time: moment("2020-04-01"), income: 1000, expense: 700},
		{time: moment("2020-05-01"), income: 1000, expense: 850},
		{time: moment("2020-06-01"), income: 1250, expense: 850},
		{time: moment("2020-07-01"), income: 1000, expense: 880},
		{time: moment("2020-08-01"), income: 1000, expense: 860},
		{time: moment("2020-09-01"), income: 1000, expense: 1150},
		{time: moment("2020-10-01"), income: 1000, expense: 580},
		{time: moment("2020-11-01"), income: 1000, expense: 830},
		{time: moment("2020-12-01"), income: 1150, expense: 850},
	];

	const [startIdx, setStartIdx] = useState(0);
	const [endIdx, setEndIdx] = useState(data.length - 1);

	return (
		<Page title={"Charts test"} position={"relative"}>

			<Stack maxWidth={500} position={"absolute"} top={0} right={0}>
				<Stack bg={"white"} borderRadius={10} p={5}>
					<Heading size={"sm"}>Todo:</Heading>
					<List color={"gray.500"}>
						<ListItem textDecoration={"line-through"} color="green.500">
							<ListIcon as={MdCheckCircle} />
							Periode
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Granulariteit (dag/week/maand)
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Selectie op grootboek/rubriek
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Saldo vs. buffer
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Trendlijn?
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Todo verwijderen
						</ListItem>
					</List>
				</Stack>

				<Stack bg={"white"} borderRadius={10} p={5}>
					<Heading size={"sm"}>Acceptatiecriteria:</Heading>
					<List color={"gray.500"}>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Scherm met rapportage staat gelinkt in navigatiemenu.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Rapportageperiode is instelbaar van een datum tot en met eenzelfde of opvolgende datum.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Gegevens worden in een tabel weergegeven.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Inkomsten en uitgaven zijn per soort gegroepeerd weergegeven.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Inkomsten en uitgaven zijn per rubriek weergegeven.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Filteren gegevens op geen, een of meerdere burgers.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Filteren gegevens op geen, een of meerdere rubrieken.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Gegevens worden in een grafiek weergegeven.
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Trend saldo op balans wordt in een LineChart weergegeven
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Datapunt in grafiek is geaggregeerd op kalendermaand
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Datapunt in grafiek kan in detail bekeken worden: periode datapunt, metriek en waarde. Bijvoorbeeld: "1-1-2020 t/m 31-1-2020 Saldo: € 1.234,-"
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Trend inkomsten wordt in een AreaChart weergegeven
						</ListItem>
						<ListItem>
							<ListIcon as={MdCheckCircle} />
							Trend uitgaven wordt in een AreaChart weergegeven
						</ListItem>
					</List>
				</Stack>
			</Stack>

			<pre>{JSON.stringify({
				startIdx, endIdx
			}, null, 2)}</pre>

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

				<HStack maxWidth={"90%"}>
					<Box flex={1}>
						<Slider min={0} max={data.length - 1} step={1} onChange={val => setStartIdx(val)} value={startIdx}>
							<SliderTrack>
								<SliderFilledTrack />
							</SliderTrack>
							<SliderThumb />
						</Slider>
					</Box>
					<Box flex={1}>
						<Slider min={0} max={data.length - 1} step={1} onChange={val => setEndIdx(val)} value={endIdx}>
							<SliderTrack>
								<SliderFilledTrack />
							</SliderTrack>
							<SliderThumb />
						</Slider>
					</Box>
				</HStack>

				<Box>
					<ChakraChart
						height={"500px"}
						chartType="AreaChart"
						loader={<Spinner />}
						data={[columns, ...data.map(d => [
							d.time.format("MMM YYYY"),
							d.income,
							d.expense
						])]}
						options={{
							title: "Inkomsten en uitgaven",
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
				</Box>

			</Section>

		</Page>
	);
};

export default ChartsTest;