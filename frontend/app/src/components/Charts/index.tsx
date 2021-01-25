import {Box, Divider, FormControl, Heading, HStack, Input, Stack, Text} from "@chakra-ui/react";
import moment from "moment";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useInput} from "react-grapple";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Gebruiker, Rubriek, useGetReportingDataQuery} from "../../generated/graphql";
import Transaction from "../../models/Transaction";
import {Category, createAggregationByRubriek} from "../../utils/DataEngine";
import Queryable from "../../utils/Queryable";
import {currencyFormat2, formatBurgerName, humanJoin, useReactSelectStyles} from "../../utils/things";
import {FormLeft, FormRight, Label} from "../Forms/FormLeftRight";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";
import InkomstenUitgaven from "./InkomstenUitgaven";
import Saldo from "./Saldo";

const Charts = () => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();

	const translatedCategory = {
		[Category.Inkomsten]: t("charts.inkomstenUitgaven.income"),
		[Category.Uitgaven]: t("charts.inkomstenUitgaven.expenses"),
	};

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
			<Section>
				<FormLeft title={t("sections.filterOptions.title")} helperText={t("sections.filterOptions.helperText")} />
				<FormRight>
					<Stack>
						<Stack direction={["column", "row"]} spacing={5} flex={1}>
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

						<Stack direction={["column", "row"]} spacing={5} flex={1}>
							<FormControl as={Stack} flex={1}>
								<Label>{t("charts.filterBurgers")}</Label>
								<Queryable query={$data} children={data => {
									const burgers: Gebruiker[] = data.gebruikers || [];
									return (
										<Select onChange={onSelectBurger} options={burgers.map(b => ({key: b.id, value: b.id, label: formatBurgerName(b)}))} styles={reactSelectStyles}
										        isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllBurgers")} />
									)
								}} />
							</FormControl>
							<FormControl as={Stack} flex={1}>
								<Label>{t("charts.filterRubrics")}</Label>
								<Queryable query={$data} children={data => {
									const rubrieken: Rubriek[] = data.rubrieken || [];
									return (
										<Select onChange={onSelectRubriek} options={rubrieken.map(r => ({key: r.id, value: r.id, label: r.naam}))} styles={reactSelectStyles}
										        isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllRubrics")} />
									)
								}} />
							</FormControl>
						</Stack>
					</Stack>
				</FormRight>
			</Section>

			<Queryable query={$data} children={data => {
				const _startDate = moment(startDate.value, "L").startOf("month");
				const _endDate = moment(endDate.value, "L").endOf("month");

				const transactions: Transaction[] = data.bankTransactions.map(t => new Transaction(t));
				const burgers: Gebruiker[] = data.gebruikers;

				const filteredTransactions = transactions
					.filter(t => filterRubriekIds.length > 0 ? t.hasAnyRubriek(filterRubriekIds) : true)
					.filter(t => filterBurgerIds.length > 0 ? t.belongsToAnyBurger(filterBurgerIds) : true)
					.filter(t => t.isBetweenDates(_startDate, _endDate));

				const aggregationByRubriek = createAggregationByRubriek(filteredTransactions);
				const selectedBurgers = burgers.filter(b => filterBurgerIds.includes(b.id!));
				const burgerNamesList: string[] = selectedBurgers.map(b => formatBurgerName(b));

				return (<>
					<Section direction={["column", "row"]}>
						<FormLeft title={t("balance")} helperText={selectedBurgers.length > 0 ? humanJoin(burgerNamesList) : t("allBurgers")} />
						<FormRight>
							<Stack spacing={4}>
								{Object.keys(aggregationByRubriek.rubrieken).map(c => {
									const categories = Object.keys(aggregationByRubriek.rubrieken[c]);
									let total = 0;
									return categories.length === 0 ? null : (
										<Stack key={c} spacing={0}>
											<Text fontWeight={"bold"}>{translatedCategory[c]}</Text>
											{categories.map((r, i) => {
												total += aggregationByRubriek.rubrieken[c][r];
												return (
													<Stack direction={"row"} key={i}>
														<Box flex={1}>
															<Text>{r === Category.Ongeboekt ? t("charts.inkomstenUitgaven.unbooked") : r}</Text>
														</Box>
														<Box flex={2} textAlign={"right"}>
															<Text fontWeight={"bold"}>{currencyFormat2(false).format(aggregationByRubriek.rubrieken[c][r])}</Text>
															{/*<Text fontWeight={"bold"}>{currencyFormat2(false).format(Math.abs(aggregationByRubriek.rubrieken[c][r]))}</Text>*/}
														</Box>
													</Stack>
												)
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
													<Text fontWeight={"bold"}>{currencyFormat2(false).format(total)}</Text>
													{/*<Text fontWeight={"bold"}>{currencyFormat2(false).format(Math.abs(total))}</Text>*/}
												</Box>
											</Stack>
										</Stack>
									);
								})}

								<Stack direction={"row"}>
									<Box flex={1}>
										<Text>{t("balance")}</Text>
									</Box>
									<Box flex={2} textAlign={"right"}>
										<Text fontWeight={"bold"}>{currencyFormat2(false).format(aggregationByRubriek.balance)}</Text>
									</Box>
								</Stack>
							</Stack>
						</FormRight>
					</Section>

					<InkomstenUitgaven transactions={filteredTransactions} />
					<Saldo transactions={filteredTransactions} />
				</>)
			}} />
		</Page>
	);
};

export default Charts;