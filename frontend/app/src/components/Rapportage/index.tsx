import {Button, FormControl, FormLabel, Heading, Input, Stack, useDisclosure} from "@chakra-ui/react";
import  {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";
import Select from "react-select";
import {Burger, Rubriek, useGetBurgersQuery} from "../../generated/graphql";
import {DateRange} from "../../models/models";
import d from "../../utils/dayjs";
import Queryable from "../../utils/Queryable";
import {formatBurgerName, humanJoin, useReactSelectStyles} from "../../utils/things";
import RadioButtonGroup from "../shared/RadioButtonGroup";
import Modal from "../shared/Modal";
import Page from "../shared/Page";
import {Granularity} from "./Aggregator";
import {RapportageContext} from "./context";
import RapportageComponent from "./RapportageComponent";

const Rapportage = () => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();
	const {search: queryParams} = useLocation();
	const filterModal = useDisclosure();

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

	const onSelectRubriek = (value) => setFilterRubriekIds(value ? value.map(v => v.value) : []);
	const onChangeGranularity = (value) => setGranularity(value);
	const $burgers = useGetBurgersQuery();
	//const $rubrieken = useGetRubriekenQuery();

	return (
		<Queryable query={$burgers} children={data => {

			const burgers: Burger[] = data.burgers || [];
			const selectedBurgers = burgers.filter(b => filterBurgerIds.includes(b.id!));
			const value = burgers.filter(b => filterBurgerIds.includes(b.id!)).map(b => ({
				key: b.id,
				value: b.id,
				label: formatBurgerName(b),
			}));

			return (
				<RapportageContext.Provider value={{startDate: d(dateRange.from), endDate: d(dateRange.through), granularity}}>
					<Page title={t("reports.title")} right={!$burgers.loading && (
						<Button size={"sm"} variant={"outline"} colorScheme={"primary"} onClick={() => filterModal.onOpen()}>{t("sections.filterOptions.title")}</Button>
					)}>
						{/* filteropties */}
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
													<Select onChange={onSelectBurger} options={burgers.map(b => ({
														key: b.id,
														value: b.id,
														label: formatBurgerName(b),
													}))} styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllBurgers")} value={value} />
											</FormControl>
											<FormControl as={Stack} flex={1}>
												<FormLabel>{t("charts.filterRubrics")}</FormLabel>
												<p>Filteren op rubriek wordt momenteel niet ondersteund</p>
												{/* <Queryable query={$rubrieken} children={data => {
													const rubrieken: Rubriek[] = data.rubrieken || [];
													return (
														<Select onChange={onSelectRubriek} options={rubrieken.map(r => ({
															key: r.id,
															value: r.id,
															label: r.naam,
														}))} styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllRubrics")} />
													);
												}} /> */}
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
						{/* pagina */}
						<Heading size={"sm"} fontWeight={"normal"}>{selectedBurgers.length > 0 ? humanJoin(selectedBurgers.map(b => formatBurgerName(b))) : t("allBurgers")}</Heading>
						<RapportageComponent burgerIds={filterBurgerIds} startDate={dateRange.from} endDate={dateRange.through}></RapportageComponent>
					</Page>
				</RapportageContext.Provider>
			)
		}} />
	);
};

export default Rapportage;