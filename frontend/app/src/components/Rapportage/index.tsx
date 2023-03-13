import {Button, FormControl, FormLabel, Heading, Input, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";
import Select from "react-select";
import {Burger, Rubriek, useGetReportingDataQuery} from "../../generated/graphql";
import {DateRange} from "../../models/models";
import Transaction from "../../models/Transaction";
import d from "../../utils/dayjs";
import Queryable from "../../utils/Queryable";
import {formatBurgerName, humanJoin, useReactSelectStyles} from "../../utils/things";
import RadioButtonGroup from "../shared/RadioButtonGroup";
import Modal from "../shared/Modal";
import Page from "../shared/Page";
import SectionContainer from "../shared/SectionContainer";
import {Granularity} from "./Aggregator";
import BalanceTable from "./BalanceTable";
import {RapportageContext} from "./context";
import InkomstenUitgaven from "./InkomstenUitgaven";
import Saldo from "./Saldo";

const Rapportage = () => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();
	const {search: queryParams} = useLocation();
	const filterModal = useDisclosure();
	const $data = useGetReportingDataQuery();

	const [dateRange, setDateRange] = useState<Required<DateRange>>({
		from: d().subtract(1, "year").startOf("month").toDate(),
		through: d().subtract(1, "month").endOf("month").toDate(),
	});

	const [granularity, setGranularity] = useState<Granularity>(Granularity.Monthly);
	const granularityOptions = {
		[Granularity.Daily]: t("granularity.daily"),
		[Granularity.Weekly]: t("granularity.weekly"),
		[Granularity.Monthly]: t("granularity.monthly"),
	};

	const [filterBurgerIds, setFilterBurgerIds] = useState<number[]>(new URLSearchParams(queryParams).get("burgerId")?.split(",").map(p => parseInt(p)) || []);
	const [filterRubriekIds, setFilterRubriekIds] = useState<number[]>([]);
	const onSelectBurger = (value) => {
		setFilterBurgerIds(value ? value.map(v => v.value) : [])
	};

	function filterTransactions(transactions, startDate, endDate) {
		return transactions
			.filter(t => filterRubriekIds.length > 0 ? t.hasAnyRubriek(filterRubriekIds) : true)
			.filter(t => filterBurgerIds.length > 0 ? t.belongsToAnyBurger(filterBurgerIds) : true)
			.filter(t => t.isBetweenDates(startDate, endDate));

	}
	const onSelectRubriek = (value) => setFilterRubriekIds(value ? value.map(v => v.value) : []);
	const onChangeGranularity = (value) => setGranularity(value);

	return (
		<RapportageContext.Provider value={{startDate: d(dateRange.from), endDate: d(dateRange.through), granularity}}>
			<Queryable query={$data} children={data => {
				const _startDate = d(dateRange.from).startOf("month");
				const _endDate = d(dateRange.through).endOf("month");

				const transactions: Transaction[] = data.bankTransactions.map(t => new Transaction(t));
				const burgers: Burger[] = data.burgers;

				const filteredTransactions = filterTransactions(transactions, _startDate, _endDate);

				const selectedBurgers = burgers.filter(b => filterBurgerIds.includes(b.id!));

				return (
					<Page title={t("reports.title")} right={!$data.loading && (
						<Button size={"sm"} variant={"outline"} colorScheme={"primary"} onClick={() => filterModal.onOpen()}>{t("sections.filterOptions.title")}</Button>
					)}>
						{filterModal.isOpen && (
							<Modal title={t("sections.filterOptions.title")} onClose={filterModal.onClose}>
								<Stack>
									<Stack>
										<Stack direction={["column", "row"]} spacing={5} flex={1}>
											<FormControl as={Stack} flex={1} justifyContent={"flex-end"}>
												<FormLabel>{t("global.startDate")}</FormLabel>
												<DatePicker selected={dateRange.from || null}
													dateFormat={"dd-MM-yyyy"}
													startDate={dateRange.from}
													endDate={dateRange.through}
													isClearable={false}
													selectsRange={true}
													showYearDropdown
													dropdownMode={"select"}
													onChange={(value: [Date, Date]) => {
														if (value) {
															const [from, through] = value;
															if (from || through) {
																setDateRange(() => ({from, through}));
															}
														}
													}}
													customInput={(<Input />)}
												/>
											</FormControl>
										</Stack>

										<Stack direction={"column"} spacing={5} flex={1}>
											<FormControl as={Stack} flex={1}>
												<FormLabel>{t("charts.filterBurgers")}</FormLabel>
												<Queryable query={$data} children={data => {
													const burgers: Burger[] = data.burgers || [];
													const value = burgers.filter(b => filterBurgerIds.includes(b.id!)).map(b => ({
														key: b.id,
														value: b.id,
														label: formatBurgerName(b),
													}));
													return (
														<Select onChange={onSelectBurger} options={burgers.map(b => ({
															key: b.id,
															value: b.id,
															label: formatBurgerName(b),
														}))} styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllBurgers")} value={value} />
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
								</Stack>
							</Modal>
						)}

						<Heading size={"sm"} fontWeight={"normal"}>{selectedBurgers.length > 0 ? humanJoin(selectedBurgers.map(b => formatBurgerName(b))) : t("allBurgers")}</Heading>
						<SectionContainer>
							<Tabs isLazy variant={"solid"} align={"start"} colorScheme={"primary"}>
								<Stack direction={"row"} as={TabList} spacing={2}>
									<Tab>{t("charts.saldo.title")}</Tab>
									<Tab>{t("charts.inkomstenUitgaven.title")}</Tab>
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
						</SectionContainer>
						<BalanceTable transactions={filteredTransactions} startDate={d(dateRange.from).format("L")} endDate={d(dateRange.through).format("L")} />
					</Page>
				);

			}} />
		</RapportageContext.Provider>
	);
};

export default Rapportage;