import {FormControl, Grid, Heading, Input, List, ListIcon, ListItem, ListItemProps, Stack, Text} from "@chakra-ui/react";
import moment from "moment";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useInput} from "react-grapple";
import {useTranslation} from "react-i18next";
import {MdCheckCircle, RiBarChartFill} from "react-icons/all";
import {NavLink, Route, Switch} from "react-router-dom";
import Select from "react-select";
import Routes from "../../config/routes";
import {Gebruiker, Rubriek, useGetReportingDataQuery} from "../../generated/graphql";
import Transaction from "../../models/Transaction";
import Queryable from "../../utils/Queryable";
import {formatBurgerName, isDev, useReactSelectStyles} from "../../utils/things";
import {FormLeft, FormRight, Label} from "../Forms/FormLeftRight";
import GridCard from "../GridCard";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";
import InkomstenUitgaven from "./InkomstenUitgaven";
import Saldo from "./Saldo";

const Charts = () => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();

	const $data = useGetReportingDataQuery({
		fetchPolicy: "no-cache",
	});

	const startDate = useInput({
		defaultValue: moment().year(2020).startOf("year").format("L"),
	});
	const endDate = useInput({
		defaultValue: moment().year(2020).endOf("year").format("L"),
	});
	const [filterBurgerIds, setFilterBurgerIds] = useState<number[]>([]);
	const [filterRubriekIds, setFilterRubriekIds] = useState<number[]>([]);
	const onSelectBurger = (value) => setFilterBurgerIds(value ? value.map(v => v.value) : []);
	const onSelectRubriek = (value) => setFilterRubriekIds(value ? value.map(v => v.value) : []);

	return (
		<Page title={t("sidebar.rapportages")} position={"relative"}>

			{/* Todo: remove TodoList */}
			{isDev && <TodoList />}

			<Section>

				<Stack direction={["column", "row"]}>
					<Stack spacing={5}>
						<Stack direction={["column", "row"]} justifyContent={["space-around"]} maxW={500}>
							<FormControl as={Stack} flex={1} justifyContent={"flex-end"}>
								<Label>{t("forms.common.fields.startDate")}</Label>
								<DatePicker selected={moment(startDate.value, "L").isValid() ? moment(startDate.value, "L").toDate() : null}
								            dateFormat={"MMM yyyy"}
								            showMonthYearPicker
								            showFullMonthYearPicker
								            onChange={(value: Date) => {
									            if (value) {
										            startDate.setValue(moment(value).format("L"));
									            }
								            }} customInput={(<Input {...startDate.bind} />)} />
							</FormControl>
							<FormControl as={Stack} flex={1}>
								<Label>{t("forms.common.fields.endDate")}</Label>
								<DatePicker selected={moment(endDate.value, "L").isValid() ? moment(endDate.value, "L").toDate() : null}
								            dateFormat={"MMM yyyy"}
								            showMonthYearPicker
								            showFullMonthYearPicker
								            onChange={(value: Date) => {
									            if (value) {
										            endDate.setValue(moment(value).format("L"));
									            }
								            }} customInput={(<Input {...startDate.bind} />)} />
							</FormControl>
						</Stack>
						<Stack direction={["column", "row"]} justifyContent={["space-around"]} maxW={500}>
							<FormControl as={Stack} flex={1}>
								<Label>{t("Filter op burgers")}</Label>
								<Queryable query={$data} children={data => {
									const burgers: Gebruiker[] = data.gebruikers || [];
									return (
										<Select onChange={onSelectBurger} options={burgers.map(b => ({key: b.id, value: b.id, label: formatBurgerName(b)}))} styles={reactSelectStyles}
										        isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("Alle burgers")} />
									)
								}} />
							</FormControl>
						</Stack>
						<Stack direction={["column", "row"]} justifyContent={["space-around"]} maxW={500}>
							<FormControl as={Stack} flex={1}>
								<Label>{t("Filter op rubrieken")}</Label>
								<Queryable query={$data} children={data => {
									const rubrieken: Rubriek[] = data.rubrieken || [];
									return (
										<Select onChange={onSelectRubriek} options={rubrieken.map(r => ({key: r.id, value: r.id, label: r.naam}))} styles={reactSelectStyles}
										        isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("Alle rubrieken")} />
									)
								}} />
							</FormControl>
						</Stack>
					</Stack>
				</Stack>
			</Section>

			<Queryable query={$data} children={data => {
				const _startDate = moment(startDate.value, "L").startOf("month");
				const _endDate = moment(endDate.value, "L").endOf("month");

				const transactions: Transaction[] = data.bankTransactions.map(t => new Transaction(t));
				const filteredTransactions = transactions
					.filter(t => filterBurgerIds.length > 0 ? t.belongsToAnyBurger(filterBurgerIds) : true)
					.filter(t => t.isBetweenDates(_startDate, _endDate));

				return (
					<Switch>
						<Route path={Routes.RapportagesInkomstenUitgaven}>
							<InkomstenUitgaven transactions={filteredTransactions} />
						</Route>
						<Route path={Routes.RapportagesSaldo}>
							<Saldo transactions={filteredTransactions} />
						</Route>
						<Route>
							<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"]} gap={5}>
								<GridCard as={NavLink} to={Routes.RapportagesInkomstenUitgaven}>
									<Stack direction={"row"} spacing={3} alignItems={"center"}>
										<RiBarChartFill />
										<Text>{t("charts.inkomstenUitgaven.title")}</Text>
									</Stack>
								</GridCard>
								{isDev && (
									<GridCard as={NavLink} to={Routes.RapportagesSaldo}>
										<Stack direction={"row"} spacing={3} alignItems={"center"}>
											<RiBarChartFill />
											<Text>{t("charts.saldo.title")}</Text>
										</Stack>
									</GridCard>
								)}
							</Grid>
						</Route>
					</Switch>
				)
			}} />
		</Page>
	);
};

export default Charts;

const MyListItem: React.FC<ListItemProps & { done?: boolean, hideDone?: boolean }> = ({done = false, hideDone = false, ...props}) => (
	!(done && hideDone) ? <ListItem {...done && {textDecoration: "line-through", color: "green.500"}} {...props}>
		<ListIcon as={MdCheckCircle} />
		{props.children}
	</ListItem> : null
);

const TodoList = () => (
	<Stack maxWidth={500} position={"absolute"} top={0} right={0}>
		<Stack bg={"white"} borderRadius={10} p={5}>
			<Heading size={"sm"}>Todo:</Heading>
			<List color={"gray.500"}>
				<MyListItem done>Periode</MyListItem>
				<MyListItem>Granulariteit (dag/week/maand) </MyListItem>
				<MyListItem>Selectie op grootboek/rubriek </MyListItem>
				<MyListItem>Saldo vs. buffer </MyListItem>
				<MyListItem>Todo verwijderen </MyListItem>
			</List>
		</Stack>

		<Stack bg={"white"} borderRadius={10} p={5}>
			<Heading size={"sm"}>Acceptatiecriteria:</Heading>
			<List color={"gray.500"}>
				<MyListItem done>Scherm met rapportage staat gelinkt in navigatiemenu. </MyListItem>
				<MyListItem done>Rapportageperiode is instelbaar van een datum tot en met eenzelfde of opvolgende datum. </MyListItem>
				<MyListItem done>Gegevens worden in een tabel weergegeven. </MyListItem>
				<MyListItem done>Inkomsten en uitgaven zijn per soort gegroepeerd weergegeven. </MyListItem>
				<MyListItem done>Inkomsten en uitgaven zijn per rubriek weergegeven. </MyListItem>
				<MyListItem done>Filteren gegevens op geen, een of meerdere burgers. </MyListItem>
				<MyListItem>Filteren gegevens op geen, een of meerdere rubrieken. </MyListItem>
				<MyListItem done>Gegevens worden in een grafiek weergegeven. </MyListItem>
				<MyListItem done>Trend saldo op balans wordt in een LineChart weergegeven </MyListItem>
				<MyListItem done>Datapunt in grafiek is geaggregeerd op kalendermaand </MyListItem>
				<MyListItem done>Datapunt in grafiek kan in detail bekeken worden: periode datapunt, metriek en waarde. Bijvoorbeeld: "1-1-2020 t/m 31-1-2020 Saldo: € 1.234,-" </MyListItem>
				<MyListItem done>Trend inkomsten wordt in een AreaChart weergegeven </MyListItem>
				<MyListItem done>Trend uitgaven wordt in een AreaChart weergegeven </MyListItem>
			</List>
		</Stack>
	</Stack>
);