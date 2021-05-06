import {Box, Divider, FormControl, HStack, Input, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useInput} from "react-grapple";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Burger, Rubriek, useGetReportingDataQuery} from "../../generated/graphql";
import Transaction from "../../models/Transaction";
import d from "../../utils/dayjs";
import Queryable from "../../utils/Queryable";
import {currencyFormat2, formatBurgerName, humanJoin, useReactSelectStyles} from "../../utils/things";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import Label from "../Layouts/Label";
import Page from "../Layouts/Page";
import RadioButtonGroup from "../Layouts/RadioButtons/RadioButtonGroup";
import Section from "../Layouts/Section";
import {createAggregation, Granularity, Type} from "./Aggregator";
import {RapportageContext} from "./context";
import InkomstenUitgaven from "./InkomstenUitgaven";
import Saldo from "./Saldo";

const Rapportage = () => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();

	const translatedCategory = {
		[Type.Inkomsten]: t("charts.inkomstenUitgaven.income"),
		[Type.Uitgaven]: t("charts.inkomstenUitgaven.expenses"),
	};

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
									<Label>{t("forms.common.fields.startDate")}</Label>
									<DatePicker selected={d(startDate.value, "L").isValid() ? d(startDate.value, "L").toDate() : null}
										dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											if (value) {
												startDate.setValue(d(value).format("L"));
											}
										}} customInput={(<Input {...startDate.bind} />)} />
								</FormControl>
								<FormControl as={Stack} flex={1}>
									<Label>{t("forms.common.fields.endDate")}</Label>
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
									<Label>{t("charts.filterBurgers")}</Label>
									<Queryable query={$data} children={data => {
										const burgers: Burger[] = data.burgers || [];
										return (
											<Select onChange={onSelectBurger} options={burgers.map(b => ({
												key: b.id,
												value: b.id,
												label: formatBurgerName(b),
											}))} styles={reactSelectStyles.default}
											isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllBurgers")} />
										);
									}} />
								</FormControl>
								<FormControl as={Stack} flex={1}>
									<Label>{t("charts.filterRubrics")}</Label>
									<Queryable query={$data} children={data => {
										const rubrieken: Rubriek[] = data.rubrieken || [];
										return (
											<Select onChange={onSelectRubriek} options={rubrieken.map(r => ({
												key: r.id,
												value: r.id,
												label: r.naam,
											}))} styles={reactSelectStyles.default}
											isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllRubrics")} />
										);
									}} />
								</FormControl>
							</Stack>

							<Stack direction={["column", "row"]} spacing={5} flex={1}>
								<FormControl as={Stack} flex={1}>
									<Label>{t("charts.granularity")}</Label>
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

					// const aggregationByRubriek = createAggregationByRubriek(filteredTransactions);
					const [, aggregationByRubriek, saldo] = createAggregation(filteredTransactions);
					const selectedBurgers = burgers.filter(b => filterBurgerIds.includes(b.id!));
					const burgerNamesList: string[] = selectedBurgers.map(b => formatBurgerName(b));

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

						{/* Balance table */}
						<Section direction={["column", "row"]}>
							<FormLeft title={t("balance")} helperText={selectedBurgers.length > 0 ? humanJoin(burgerNamesList) : t("allBurgers")} />
							<FormRight>
								<Stack spacing={4}>
									<HStack>
										<Text>Rapportageperiode: <strong>{d(startDate.value, "L").startOf("day").format("L")}</strong> tot en
											  met <strong>{d(endDate.value, "L").endOf("day").format("L")}</strong>.</Text>
									</HStack>

									{Object.keys(aggregationByRubriek).map(c => {
										const categories = Object.keys(aggregationByRubriek[c]);
										let total = 0;
										return (
											<Stack key={c} spacing={0}>
												<Text fontWeight={"bold"}>{translatedCategory[c]}</Text>
												{categories.map((r, i) => {
													total += aggregationByRubriek[c][r];
													return (
														<Stack direction={"row"} key={i}>
															<Box flex={1}>
																<Text>{r === Type.Ongeboekt ? t("charts.inkomstenUitgaven.unbooked") : r}</Text>
															</Box>
															<Box flex={2} textAlign={"right"}>
																<Text fontWeight={"bold"}>{currencyFormat2(false).format(Math.abs(aggregationByRubriek[c][r]))}</Text>
															</Box>
														</Stack>
													);
												})}
												<HStack alignItems={"center"}>
													<Divider borderColor={"black"} flex={1} pt={1} />
													<Text flex={0}>+</Text>
												</HStack>
												<Stack direction={"row"}>
													<Box flex={1}>
														<Text>{t("total")}</Text>
													</Box>
													<Box flex={2} textAlign={"right"}>
														<Text fontWeight={"bold"}>{currencyFormat2(false).format(Math.abs(total))}</Text>
													</Box>
												</Stack>
											</Stack>
										);
									})}

									<Stack direction={"row"}>
										<Box flex={1}>
											<Text>{t("saldo")}</Text>
										</Box>
										<Box flex={2} textAlign={"right"}>
											<Text fontWeight={"bold"}>{currencyFormat2(false).format(saldo)}</Text>
										</Box>
									</Stack>
								</Stack>
							</FormRight>
						</Section>
					</>);
				}} />
			</Page>
		</RapportageContext.Provider>
	);
};

export default Rapportage;