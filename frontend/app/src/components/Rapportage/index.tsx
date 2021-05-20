import {FormControl, FormLabel, Input, Stack, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useInput} from "react-grapple";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Burger, Rubriek, useGetReportingDataQuery} from "../../generated/graphql";
import Transaction from "../../models/Transaction";
import d from "../../utils/dayjs";
import Queryable from "../../utils/Queryable";
import {formatBurgerName, useReactSelectStyles} from "../../utils/things";
import {FormLeft, FormRight} from "../Layouts/Forms";
import Page from "../Layouts/Page";
import RadioButtonGroup from "../Layouts/RadioButtons/RadioButtonGroup";
import Section from "../Layouts/Section";
import {Granularity} from "./Aggregator";
import BalanceTable from "./BalanceTable";
import {RapportageContext} from "./context";
import InkomstenUitgaven from "./InkomstenUitgaven";
import Saldo from "./Saldo";

const Rapportage = () => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();

	const $data = useGetReportingDataQuery({
		fetchPolicy: "no-cache",
	});

	const startDate = useInput({
		defaultValue: d().subtract(1, "year").startOf("month").format("L"),
	});
	const endDate = useInput({
		defaultValue: d().subtract(1, "month").endOf("month").format("L"),
	});

	const [granularity, setGranularity] = useState<Granularity>(Granularity.Monthly);
	const granularityOptions = {
		[Granularity.Daily]: t("granularity.daily"),
		[Granularity.Weekly]: t("granularity.weekly"),
		[Granularity.Monthly]: t("granularity.monthly"),
	};

	const [filterBurgerIds, setFilterBurgerIds] = useState<number[]>([]);
	const [filterRubriekIds, setFilterRubriekIds] = useState<number[]>([]);
	const onSelectBurger = (value) => setFilterBurgerIds(value ? value.map(v => v.value) : []);
	const onSelectRubriek = (value) => setFilterRubriekIds(value ? value.map(v => v.value) : []);
	const onChangeGranularity = (value) => setGranularity(value);

	return (
		<RapportageContext.Provider value={{startDate: d(startDate.value, "L"), endDate: d(endDate.value, "L"), granularity}}>
			<Page title={t("sidebar.rapportage")} position={"relative"}>
				<Section>
					<FormLeft title={t("sections.filterOptions.title")} helperText={t("sections.filterOptions.helperText")} />
					<FormRight>
						<Stack>
							<Stack direction={["column", "row"]} spacing={5} flex={1}>
								<FormControl as={Stack} flex={1} justifyContent={"flex-end"}>
									<FormLabel>{t("forms.common.fields.startDate")}</FormLabel>
									<DatePicker selected={d(startDate.value, "L").isValid() ? d(startDate.value, "L").toDate() : null}
										dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											if (value) {
												startDate.setValue(d(value).format("L"));
											}
										}} customInput={(<Input {...startDate.bind} />)} />
								</FormControl>
								<FormControl as={Stack} flex={1}>
									<FormLabel>{t("forms.common.fields.endDate")}</FormLabel>
									<DatePicker selected={d(endDate.value, "L").isValid() ? d(endDate.value, "L").toDate() : null}
										dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											if (value) {
												endDate.setValue(d(value).format("L"));
											}
										}} customInput={(<Input {...startDate.bind} />)} />
								</FormControl>
							</Stack>

							<Stack direction={["column", "row"]} spacing={5} flex={1}>
								<FormControl as={Stack} flex={1}>
									<FormLabel>{t("charts.filterBurgers")}</FormLabel>
									<Queryable query={$data} children={data => {
										const burgers: Burger[] = data.burgers || [];
										return (
											<Select onChange={onSelectBurger} options={burgers.map(b => ({
												key: b.id,
												value: b.id,
												label: formatBurgerName(b),
											}))} styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllBurgers")} />
										);
									}} />
								</FormControl>
								<FormControl as={Stack} flex={1}>
									<FormLabel>{t("charts.filterRubrics")}</FormLabel>
									<Queryable query={$data} children={data => {
										const rubrieken: Rubriek[] = data.rubrieken || [];
										return (
											<Select onChange={onSelectRubriek} options={rubrieken.map(r => ({
												key: r.id,
												value: r.id,
												label: r.naam,
											}))} styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllRubrics")} />
										);
									}} />
								</FormControl>
							</Stack>

							<Stack direction={["column", "row"]} spacing={5} flex={1}>
								<FormControl as={Stack} flex={1}>
									<FormLabel>{t("charts.granularity")}</FormLabel>
									<RadioButtonGroup name={"granularity"} onChange={onChangeGranularity} defaultValue={Granularity.Monthly} value={granularity} options={granularityOptions} />
								</FormControl>
							</Stack>
						</Stack>
					</FormRight>
				</Section>

				<Queryable query={$data} children={data => {
					const _startDate = d(startDate.value, "L").startOf("month");
					const _endDate = d(endDate.value, "L").endOf("month");

					const transactions: Transaction[] = data.bankTransactions.map(t => new Transaction(t));
					const burgers: Burger[] = data.burgers;

					const filteredTransactions = transactions
						.filter(t => filterRubriekIds.length > 0 ? t.hasAnyRubriek(filterRubriekIds) : true)
						.filter(t => filterBurgerIds.length > 0 ? t.belongsToAnyBurger(filterBurgerIds) : true)
						.filter(t => t.isBetweenDates(_startDate, _endDate));

					const selectedBurgers = burgers.filter(b => filterBurgerIds.includes(b.id!));

					return (<>
						<Tabs isLazy variant={"solid"} align={"end"} colorScheme={"primary"}>
							<Stack direction={"row"} as={TabList} spacing={2}>
								<Tab>Saldo</Tab>
								<Tab>Inkomsten en uitgaven</Tab>
							</Stack>
							<TabPanels>
								<TabPanel>
									<Saldo transactions={filteredTransactions} />
								</TabPanel>
								<TabPanel>
									<InkomstenUitgaven transactions={filteredTransactions} />
								</TabPanel>
							</TabPanels>
						</Tabs>

						<BalanceTable transactions={filteredTransactions} startDate={startDate.value} endDate={endDate.value} selectedBurgers={selectedBurgers} />
					</>);
				}} />
			</Page>
		</RapportageContext.Provider>
	);
};

export default Rapportage;