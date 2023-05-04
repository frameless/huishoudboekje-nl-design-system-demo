import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, ButtonGroup, FormControl, FormLabel, HStack, Input, Radio, RadioGroup, Stack, Text, VStack} from "@chakra-ui/react";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import { GetTransactiesDocument, useStartAutomatischBoekenMutation, useSearchTransactiesQuery, BankTransaction, SearchTransactiesQueryVariables, useGetBurgersQuery, Burger, BankTransactionSearchFilter} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import usePagination from "../../../utils/usePagination";
import Page from "../../shared/Page";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import TransactiesList from "./TransactiesList";
import useStore from "../../../store";
import { defaultBanktransactieFilters } from "./defaultBanktransactieFilters";
import { formatBurgerName, useReactSelectStyles } from "../../../utils/things";
import Select from "react-select";
import DatePicker from "react-datepicker";


const Transactions = () => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();
	const [customPageSize, setCustomPageSize] = useState<number>(50);
	const {offset, total, setTotal, goFirst, PaginationButtons} = usePagination({pageSize: customPageSize});
	const handleMutation = useHandleMutation();

	const banktransactieFilters = useStore(store => store.banktransactieFilters) || defaultBanktransactieFilters;
	const setBanktransactieFilters = useStore(store => store.setBanktransactieFilters);

	const setBanktransactieQueryVariables = useStore(store => store.setBanktransactieQueryVariables);

	const onClickStartBoekenButton = () => {
		handleMutation(startAutomatischBoeken(), t("messages.automatischBoeken.successMessage"));
	};

    const onChangeBookedRadio = (value) => {
        let onlyBooked : boolean | undefined = undefined
		if(value === "1"){
            onlyBooked = false
		}
		if(value === "2"){
            onlyBooked = true
		}
		setBanktransactieFilters({
			...banktransactieFilters,
			onlyBooked: onlyBooked
		})
	}

	const onChangeCreditRadio = (value) => {
        let onlyCredit : boolean | undefined = undefined
		if(value === "1"){
            onlyCredit = false
		}
		if(value === "2"){
            onlyCredit = true
		}
		setBanktransactieFilters({
			...banktransactieFilters,
			onlyCredit: onlyCredit
		})
	}

	const defaultValueRadio = (value) => {
		if(value === undefined ){
            return "3"
		}
		if(value){
            return "1"
		}
		else {
            return "2"
        }
	}

	const [filterBurgerIds, setFilterBurgerIds] = useState<number[]>(banktransactieFilters.burgerIds || []);
	const $burgers = useGetBurgersQuery();

	const onSelectBurger = (value) => {
		const newValue = value ? value.map(v => v.value) : []
		setFilterBurgerIds(newValue)		
		setBanktransactieFilters({
			...banktransactieFilters,
			burgerIds: newValue.length > 0 ? newValue : undefined
		})
	};

	const queryVariables : SearchTransactiesQueryVariables = {
		offset: offset -1,
		limit: customPageSize,
		filters: banktransactieFilters,
	};

	const $transactions = useSearchTransactiesQuery({
		fetchPolicy: "no-cache", // This "no-cache" is to make sure the list is refreshed after uploading a Bankafschrift in CsmUploadModal.tsx (24-02-2022)
		variables: queryVariables,
		onCompleted: data => {
			if (data && total !== data.searchTransacties?.pageInfo?.count) {
				setTotal(data.searchTransacties?.pageInfo?.count);
				goFirst();
			}

			setBanktransactieQueryVariables(queryVariables);
		},
	});

	const [startAutomatischBoeken] = useStartAutomatischBoekenMutation({
		refetchQueries: [
			{query: GetTransactiesDocument, variables: queryVariables},
		],
	});

	return (
		<Page title={t("forms.bankzaken.sections.transactions.title")} right={(
			<Button size={"sm"} variant={"outline"} colorScheme={"primary"} onClick={onClickStartBoekenButton}>{t("global.actions.startBoeken")}</Button>
		)}>
			<SectionContainer>
				<Queryable query={$transactions} children={(data) => {
					const transacties : BankTransaction[] = data.searchTransacties?.banktransactions || []

					return (
						<Section title={t("transactionsPage.title")} helperText={t("transactionsPage.helperText")}>
							<Stack>
								<VStack>
									<HStack>
										<FormControl as={Stack} flex={1} justifyContent={"flex-end"}>
											<FormLabel>{t("global.period")}</FormLabel>
											<DatePicker selected={banktransactieFilters.startDate ? new Date(banktransactieFilters.startDate) : null}
												dateFormat={"dd-MM-yyyy"} isClearable={true} selectsRange={true}
												startDate={banktransactieFilters.startDate ? new Date(banktransactieFilters.startDate) : null} 
												endDate={banktransactieFilters.endDate ? new Date(banktransactieFilters.endDate) : null}
												showYearPicker={true}
												onChange={(value: [Date, Date]) => {
													if (value) {
														const [from, through] = value;
														if (!from && !through) {
															setBanktransactieFilters({
																...banktransactieFilters,
																startDate: undefined,
															});
														}
														else {
															setBanktransactieFilters({
																...banktransactieFilters,
																startDate: from ? from.toISOString() : undefined,
																endDate: through ? through.toISOString() : undefined,
															});
														}
													}
												}} customInput={(<Input />)} />
										</FormControl>
									</HStack>
									<FormControl>
										<RadioGroup defaultValue={defaultValueRadio(banktransactieFilters?.onlyBooked || undefined)} onChange={onChangeBookedRadio}>
											<Stack spacing={5} direction={"row"}>
												<Radio colorScheme={"blue"} value={"1"}>
													Niet geboekt
												</Radio>
												<Radio colorScheme={"blue"} value={"2"}>
													geboekt
												</Radio>
												<Radio colorScheme={"blue"} value={"3"}>
													alles
												</Radio>
											</Stack>
										</RadioGroup>
										<RadioGroup defaultValue={defaultValueRadio(banktransactieFilters?.onlyCredit || undefined)} onChange={onChangeCreditRadio}>
											<Stack spacing={5} direction={"row"}>
												<Radio colorScheme={"blue"} value={"1"}>
													Uitgaven
												</Radio>
												<Radio colorScheme={"blue"} value={"2"}>
													Inkomsten
												</Radio>
												<Radio colorScheme={"blue"} value={"3"}>
													alles
												</Radio>
											</Stack>
										</RadioGroup>
										<FormLabel>{t("filters.transactions.pageSize")}</FormLabel>
										<ButtonGroup size={"sm"} isAttached>
											<Button colorScheme={customPageSize === 25 ? "primary" : "gray"} onClick={() => setCustomPageSize(25)}>25</Button>
											<Button colorScheme={customPageSize === 50 ? "primary" : "gray"} onClick={() => setCustomPageSize(50)}>50</Button>
											<Button colorScheme={customPageSize === 100 ? "primary" : "gray"} onClick={() => setCustomPageSize(100)}>100</Button>
											<Button colorScheme={customPageSize === 250 ? "primary" : "gray"} onClick={() => setCustomPageSize(250)}>250</Button>
										</ButtonGroup>
									</FormControl>
								</VStack>
								<Accordion allowToggle>
									<AccordionItem>
										<AccordionButton>
											<Box as={"span"} flex={1} textAlign={"right"}>
												Uitgebreid zoeken
											</Box>
											<AccordionIcon />
										</AccordionButton>
										<AccordionPanel pb={4}>
											<FormControl>
											<Queryable query={$burgers} children={data => {
											const burgers: Burger[] = data.burgers || [];
											const burgers_filter = burgers.filter(b => filterBurgerIds.includes(b.id!)).map(b => ({
												key: b.id,
												value: b.id,
												label: formatBurgerName(b),
											}));
											return (
												<Stack direction={"column"} spacing={5} flex={1}>
													<HStack >
														<FormControl as={Stack} flex={1}>
															<FormLabel>{t("charts.filterBurgers")}</FormLabel>
															<Select onChange={onSelectBurger} options={burgers.map(b => ({
																key: b.id,
																value: b.id,
																label: formatBurgerName(b),
															}))} styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllBurgers")} value={burgers_filter} />
														</FormControl>
													</HStack>
												</Stack>
											);
										}} />
											</FormControl>
										</AccordionPanel>
									</AccordionItem>
								</Accordion>
							</Stack>
							{transacties.length > 0 ? (
								<Stack>
									<TransactiesList transacties={transacties} />
									<HStack justify={"center"}>
										<PaginationButtons />
									</HStack>
								</Stack>
							) : (
								<Text>{t("messages.transactions.noResults")}</Text>
							)}
						</Section>
					);
				}} />
			</SectionContainer>
		</Page>
	);
};

export default Transactions;
