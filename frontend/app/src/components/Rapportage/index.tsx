import {FormControl, HStack, Heading, Text, Input, Stack, Button, Box} from "@chakra-ui/react";
import {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";
import Select from "react-select";
import {Burger, Rubriek, useGetBurgersQuery, useGetRubriekenQuery} from "../../generated/graphql";
import d from "../../utils/dayjs";
import Queryable from "../../utils/Queryable";
import {formatBurgerName, getBurgerHhbId, humanJoin, useReactSelectStyles} from "../../utils/things";
import Page from "../shared/Page";
import {RapportageContext} from "./context";
import RapportageComponent from "./RapportageComponent";
import SectionContainer from "../shared/SectionContainer";

const Rapportage = () => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();
	const {search: queryParams} = useLocation();

	const [startDate, setStartDate] = useState<Date>(d().subtract(1, "month").startOf("month").toDate());
	const [endDate, setEndDate] = useState<Date>(d().subtract(1, "month").endOf("month").toDate());

	const [filterBurgerIds, setFilterBurgerIds] = useState<number[]>(new URLSearchParams(queryParams).get("burgerId")?.split(",").map(p => parseInt(p)) || []);
	const [filterRubriekIds, setFilterRubriekIds] = useState<number[]>([]);
	const onSelectBurger = (value) => {
		setFilterBurgerIds(value ? value.map(v => v.value) : [])
	};

	const setCurrentMonth = () =>{
		setStartDate(d().startOf("month").toDate())
		setEndDate(d().endOf("month").toDate())
	}

	const setLastMonth = () =>{
		setStartDate(d().subtract(1, "month").startOf("month").toDate())
		setEndDate(d().subtract(1, "month").endOf("month").toDate())
	}

	const onSelectRubriek = (value) => setFilterRubriekIds(value ? value.map(v => v.value) : []);
	const $burgers = useGetBurgersQuery();
	const $rubrieken = useGetRubriekenQuery();

	return (
		<Queryable query={$burgers} children={data => {

			const burgers: Burger[] = data.burgers || [];
			const selectedBurgers = burgers.filter(b => filterBurgerIds.includes(b.id!));
			const burgers_filter = burgers.filter(b => filterBurgerIds.includes(b.id!)).map(b => ({
				key: b.id,
				value: b.id,
				label: formatBurgerName(b) + " " + getBurgerHhbId(b),
			}));

			return (
				<RapportageContext.Provider value={{startDate: d(startDate), endDate: d(endDate)}}>
					{/* filteropties */}
					<Page title={t("reports.title")}>
						<SectionContainer>
							<Stack className={"do-not-print"} alignItems={"start"}>
								<HStack width={"100%"} alignItems={"start"}>
									<HStack width={"50%"}>
										<FormControl maxWidth={"40%"}>
											<DatePicker
												selected={startDate || null}
												autoComplete="no"
												aria-autocomplete="none"
												dateFormat={"dd-MM-yyyy"}
												onChange={(value: Date) => {
													if(value){
														setStartDate(value)
													}
												}}
												showYearDropdown
												dropdownMode={"select"}
												customInput={<Input autoComplete="no" aria-autocomplete="none"/>}
											>
												<Box>
													<Button width={"45%"} marginX={"2.5%"} colorScheme={"primary"} size={"xs"} onClick={setCurrentMonth}>{t("reports.currentMonth")}</Button>
													<Button width={"45%"} marginX={"2.5%"} colorScheme={"primary"} size={"xs"} onClick={setLastMonth}>{t("reports.lastMonth")}</Button>
												</Box>
											</DatePicker>
										</FormControl>
										<Text maxWidth={"20%"}fontSize={"sm"}>{t("reports.till")}</Text>
										<FormControl maxWidth={"40%"}>
											<DatePicker
												selected={endDate || null}
												autoComplete="no"
												aria-autocomplete="none"
												dateFormat={"dd-MM-yyyy"}
												onChange={(value: Date) => {
													if(value){
														setEndDate(value)
													}
												}}
												showYearDropdown
												dropdownMode={"select"}
												customInput={<Input autoComplete="no" aria-autocomplete="none"/>}
											>
												<Box>
													<Button width={"45%"} marginX={"2.5%"} colorScheme={"primary"} size={"xs"} onClick={setCurrentMonth}>{t("reports.currentMonth")}</Button>
													<Button width={"45%"} marginX={"2.5%"} colorScheme={"primary"} size={"xs"} onClick={setLastMonth}>{t("reports.lastMonth")}</Button>
												</Box>
											</DatePicker>
										</FormControl>
									</HStack>
									<HStack width={"50%"}>
										<FormControl >
											<Queryable query={$rubrieken} children={data => {
												const rubrieken: Rubriek[] = data.rubrieken || [];
												const rubrieken_filter = rubrieken.filter(r => filterRubriekIds.includes(r.id!)).map(r => ({
													key: r.id,
													value: r.id,
													label: r.naam,
												}));
												return (
													<Select onChange={onSelectRubriek} options={rubrieken.map(r => ({
														key: r.id,
														value: r.id,
														label: r.naam,
													}))} styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllRubrics")} value={rubrieken_filter} />
												);
											}} />
										</FormControl>
									</HStack>
								</HStack>
								<FormControl className={"do-not-print"} minWidth={300}>
									<Select onChange={onSelectBurger} options={burgers.map(b => ({
										key: b.id,
										value: b.id,
										label: formatBurgerName(b) + " " + getBurgerHhbId(b),
									}))} styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllBurgers")} value={burgers_filter} />
								</FormControl>
							</Stack>

						</SectionContainer>
						{/* pagina */}
						<Heading className={"only-show-on-print print"}  size={"sm"} fontWeight={"normal"}>{selectedBurgers.length > 0 ? humanJoin(selectedBurgers.map(b => formatBurgerName(b) + " " + getBurgerHhbId(b))) : t("allBurgers")}</Heading>
						<RapportageComponent burgerIds={filterBurgerIds} startDate={startDate} endDate={endDate} rubrieken={filterRubriekIds} />
					</Page>
				</RapportageContext.Provider>
			)
		}} />
	);
};

export default Rapportage;