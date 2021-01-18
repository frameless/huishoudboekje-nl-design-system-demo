import {FormControl, FormLabel, Heading, Input, List, ListIcon, ListItem, ListItemProps, Stack} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import {useInput} from "react-grapple";
import {useTranslation} from "react-i18next";
import {MdCheckCircle} from "react-icons/all";
import {Route, Switch} from "react-router-dom";
import Routes from "../../config/routes";
import {useGetAllTransactionsQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";
import InkomstenUitgaven from "./InkomstenUitgaven";
import Saldo from "./Saldo";

const Charts = () => {
	const {t} = useTranslation();

	const $transactions = useGetAllTransactionsQuery({
		fetchPolicy: "no-cache",
	});

	const startDate = useInput({
		defaultValue: moment().year(2020).startOf("year").format("L"),
	});
	const endDate = useInput({
		defaultValue: moment().year(2020).endOf("year").format("L"),
	});

	return (
		<Page title={"Charts test"} position={"relative"}>

			{/* Todo: remove TodoList */}
			<TodoList />

			<Section>

				<Stack direction={["column", "row"]}>
					<Switch>
						<Route path={Routes.RapportagesInkomstenUitgaven}>
							<FormLeft title={t("charts.inkomstenUitgaven.title")} helperText={t("charts.inkomstenUitgaven.helperText")} />
						</Route>
						<Route path={Routes.RapportagesSaldo}>
							<FormLeft title={t("charts.saldo.title")} helperText={t("charts.saldo.helperText")} />
						</Route>
					</Switch>

					<FormRight>

						<Stack direction={["column", "row"]} justifyContent={["space-around"]} maxW={500}>
							<FormControl as={Stack} flex={1} justifyContent={"flex-end"}>
								<FormLabel>{t("forms.common.fields.startDate")}</FormLabel>
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
								<FormLabel>{t("forms.common.fields.endDate")}</FormLabel>
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
					</FormRight>
				</Stack>
			</Section>

			<Queryable query={$transactions} children={data => {
				const {bankTransactions} = data;

				return (
					<Switch>
						<Route path={Routes.RapportagesInkomstenUitgaven}>
							<InkomstenUitgaven startDate={moment(startDate.value, "L")} endDate={moment(endDate.value, "L")} transactions={bankTransactions} />
						</Route>
						<Route path={Routes.RapportagesSaldo}>
							<Saldo startDate={moment(startDate.value, "L")} endDate={moment(endDate.value, "L")} transactions={bankTransactions} />
						</Route>
					</Switch>
				)
			}} />
		</Page>
	);
};

export default Charts;

const MyListItem: React.FC<ListItemProps & { done?: boolean }> = ({done = false, ...props}) => (
	<ListItem {...done && {textDecoration: "line-through", color: "green.500"}} {...props}>
		<ListIcon as={MdCheckCircle} />
		{props.children}
	</ListItem>
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
				<MyListItem>Filteren gegevens op geen, een of meerdere burgers. </MyListItem>
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