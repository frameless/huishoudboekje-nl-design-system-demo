import {Box, Button, ButtonGroup, Collapse, FormControl, FormLabel, HStack, Icon, IconButton, Input, InputGroup, InputLeftAddon, InputRightElement, NumberInput, NumberInputField, Radio, RadioGroup, Spinner, Stack, Tag, Text, useDisclosure} from "@chakra-ui/react";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useStartAutomatischBoekenMutation, useSearchTransactiesQuery, BankTransaction, SearchTransactiesQueryVariables, useGetBurgersQuery, Burger, Rekening, SearchTransactiesDocument, useGetRekeningenQuery, Organisatie, useGetSimpleOrganisatiesQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import usePagination from "../../../utils/usePagination";
import Page from "../../shared/Page";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import TransactiesList from "./TransactiesList";
import useStore from "../../../store";
import {defaultBanktransactieFilters} from "./defaultBanktransactieFilters";
import {formatBurgerName, getBurgerHhbId, useReactSelectStyles} from "../../../utils/things";
import Select from "react-select";
import DatePicker from "react-datepicker";
import d from "../../../utils/dayjs";
import ZoektermenList from "../../shared/ZoektermenList";
import {TriangleUpIcon, TriangleDownIcon, WarningTwoIcon, RepeatIcon} from "@chakra-ui/icons";


const Transactions = () => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();
	const {offset, total, pageSize, setTotal, setPageSize, goFirst, PaginationButtons} = usePagination({pageSize: 50});
	const handleMutation = useHandleMutation();

	const [timeLastUpdate, setTimeLAstUpdate] = useState<Date | undefined>(undefined);

	const banktransactieFilters = useStore(store => store.banktransactieFilters || defaultBanktransactieFilters);
	const setBanktransactieFilters = useStore(store => store.setBanktransactieFilters);

	const setBanktransactieQueryVariables = useStore(store => store.setBanktransactieQueryVariables);

	const onClickStartBoekenButton = () => {
		handleMutation(startAutomatischBoeken(), t("messages.automatischBoeken.successMessage"));
	};


	const defaultValueRadio = (value) => {
		if (value === undefined) {
			return "3"
		}
		if (value) {
			return "2"
		}
		else {
			return "1"
		}
	}

	const onChangeCreditRadio = (value) => {
		let onlyCredit: boolean | undefined = undefined
		if (value === "1") {
			onlyCredit = false
		}
		if (value === "2") {
			onlyCredit = true
		}
		setBanktransactieFilters({
			...banktransactieFilters,
			onlyCredit: onlyCredit
		})
	}

	const [filterBurgerIds, setFilterBurgerIds] = useState<number[]>(banktransactieFilters.burgerIds || []);
	const [filterRekeningIbans, setFilterRekeingIbans] = useState<string[]>(banktransactieFilters.ibans || []);
	const [filterOrganisatieIds, setFilterOrganisatieIds] = useState<number[]>(banktransactieFilters.organisatieIds || []);
	const $burgers = useGetBurgersQuery();
	const $rekeningen = useGetRekeningenQuery();
	const $organisaties = useGetSimpleOrganisatiesQuery();

	const onSelectBurger = (value) => {
		const newValue = value ? value.map(v => v.value) : []
		setFilterBurgerIds(newValue)
		setBanktransactieFilters({
			...banktransactieFilters,
			burgerIds: newValue.length > 0 ? newValue : undefined
		})
	};

	const onSelectOrganisatie = (value) => {
		const newValue = value ? value.map(v => v.value) : []
		setFilterOrganisatieIds(newValue)
		setBanktransactieFilters({
			...banktransactieFilters,
			organisatieIds: newValue.length > 0 ? newValue : undefined
		})
	};

	const onSelectRekening = (value) => {
		const newValue = value ? value.map(v => v.value) : []
		setFilterRekeingIbans(newValue)
		setBanktransactieFilters({
			...banktransactieFilters,
			ibans: newValue.length > 0 ? newValue : undefined
		})
	};

	const onChangeBookedRadio = (value) => {
		let onlyBooked: boolean | undefined = undefined
		if (value === "1") {
			onlyBooked = false
		}
		if (value === "2") {
			onlyBooked = true
		}
		setBanktransactieFilters({
			...banktransactieFilters,
			onlyBooked: onlyBooked,
			burgerIds: !onlyBooked ? undefined : banktransactieFilters.burgerIds
		})
		if (onlyBooked !== undefined && !onlyBooked) {
			if (filterBurgerIds.length > 0) {
				setFilterBurgerIds([])
			}
			if (filterBurgerIds.length > 0) {
				setFilterRekeingIbans([])
			}
		}
	}

	const [zoekterm, setZoekterm] = useState<string>("");
	const [zoektermen, setZoektermen] = useState<string[]>(banktransactieFilters.zoektermen || []);
	const onAddzoekterm = (e) => {
		e.preventDefault();
		if (zoekterm !== "") {
			const list: string[] = []
			list.push(zoekterm)
			const newZoektermen = zoektermen.concat(list)
			setBanktransactieFilters({
				...banktransactieFilters,
				zoektermen: newZoektermen.length > 0 ? newZoektermen : undefined
			})
			setZoektermen(newZoektermen)
			setZoekterm("")
			goFirst()
		}
	};

	const onDeleteZoekterm = (value) => {
		const list: string[] = zoektermen.slice()
		const index = zoektermen.indexOf(value)
		list.splice(index, 1)
		setBanktransactieFilters({
			...banktransactieFilters,
			zoektermen: list.length > 0 ? list : undefined
		})
		setZoektermen(list)
		setZoekterm(zoekterm)
		goFirst()
	}

	const defaultvalueBedrag = (value) => {
		return value ? (value / 100).toString() : ""
	}

	const [minBedrag, setMinBedrag] = useState(defaultvalueBedrag(banktransactieFilters.minBedrag))
	const [maxBedrag, setMaxBedrag] = useState(defaultvalueBedrag(banktransactieFilters.maxBedrag))

	const onChangeMaxbedrag = (valueAsString) => {
		setMaxBedrag(valueAsString)
		setBanktransactieFilters({
			...banktransactieFilters,
			maxBedrag: valueAsString !== "" ? Math.round(+valueAsString * 100) : undefined
		})
	}
	const onChangeMinbedrag = (valueAsString) => {
		setMinBedrag(valueAsString)
		setBanktransactieFilters({
			...banktransactieFilters,
			minBedrag: valueAsString !== "" ? Math.round(+valueAsString * 100) : undefined
		})
	}

	const invalidBedrag = () => {
		let result = false;
		if (banktransactieFilters.maxBedrag !== undefined && banktransactieFilters.minBedrag !== undefined) {
			if (banktransactieFilters.maxBedrag < banktransactieFilters.minBedrag) {
				result = true
			}
		}
		return result
	}

	const queryVariables: SearchTransactiesQueryVariables = {
		offset: offset <= 1 ? 0 : offset,
		limit: pageSize,
		filters: banktransactieFilters,
	};



	const $transactions = useSearchTransactiesQuery({
		fetchPolicy: "no-cache", // This "no-cache" is to make sure the list is refreshed after uploading a Bankafschrift in CsmUploadModal.tsx (24-02-2022)
		variables: queryVariables,
		context: {debounceKey: "banktransactieFilters"},
		onCompleted: data => {
			if (data && total !== data.searchTransacties?.pageInfo?.count) {
				setTotal(data.searchTransacties?.pageInfo?.count);
				goFirst();
			}
			setBanktransactieQueryVariables(queryVariables);
			setTimeLAstUpdate(new Date())
		},
		notifyOnNetworkStatusChange: true
	});

	const [startAutomatischBoeken] = useStartAutomatischBoekenMutation({
		refetchQueries: [
			{query: SearchTransactiesDocument, variables: queryVariables},
		],
	});

	const blockBookedFilters = () => {
		return !banktransactieFilters.onlyBooked
	}

	const extraFiltersUsed = () => {
		return banktransactieFilters.minBedrag !== undefined ||
			banktransactieFilters.maxBedrag !== undefined ||
			banktransactieFilters.zoektermen !== undefined ||
			banktransactieFilters.ibans !== undefined ||
			banktransactieFilters.burgerIds !== undefined
	}

	const {isOpen, onToggle} = useDisclosure()

	return (
		<Page title={t("forms.bankzaken.sections.transactions.title")} right={(
			<Button size={"sm"} variant={"outline"} colorScheme={"primary"} onClick={onClickStartBoekenButton}>{t("global.actions.startBoeken")}</Button>
		)}>
			<SectionContainer>
				<Queryable query={$transactions} children={(data) => {
					const transacties: BankTransaction[] = data.searchTransacties?.banktransactions || []
					return (
						<Section title={t("transactionsPage.title")} helperText={t("transactionsPage.helperText")}>
							<Stack>
								<Stack>
									<Stack>
										<HStack>
											<FormControl>
												<FormLabel>{t("transactionsPage.filters.status")}</FormLabel>
												<RadioGroup defaultValue={defaultValueRadio(banktransactieFilters.onlyBooked)} onChange={onChangeBookedRadio}>
													<Stack spacing={5} direction={"row"}>
														<Radio colorScheme={"blue"} value={"1"}>
															{t("transactionsPage.filters.unbooked")}
														</Radio>
														<Radio colorScheme={"blue"} value={"2"}>
															{t("transactionsPage.filters.booked")}
														</Radio>
														<Radio colorScheme={"blue"} value={"3"}>
															{t("transactionsPage.filters.all")}
														</Radio>
													</Stack>
												</RadioGroup>
											</FormControl>
											<FormControl paddingLeft={15}>
												<FormLabel>{t("transactionsPage.filters.direction")}</FormLabel>
												<RadioGroup defaultValue={defaultValueRadio(banktransactieFilters.onlyCredit)} onChange={onChangeCreditRadio}>
													<Stack spacing={5} direction={"row"}>
														<Radio colorScheme={"blue"} value={"3"}>
															{t("transactionsPage.filters.all")}
														</Radio>
														<Radio colorScheme={"blue"} value={"2"}>
															{t("transactionsPage.filters.incomes")}
														</Radio>
														<Radio colorScheme={"blue"} value={"1"}>
															{t("transactionsPage.filters.expenses")}
														</Radio>
													</Stack>
												</RadioGroup>
											</FormControl>
										</HStack>
										<HStack>
											<FormControl>
												<HStack>
													<FormControl>
														<FormLabel>{t("transactionsPage.filters.from")}</FormLabel>
														<DatePicker
															selected={banktransactieFilters.startDate ? new Date(banktransactieFilters.startDate) : null}
															autoComplete="no"
															aria-autocomplete="none"
															dateFormat={"dd-MM-yyyy"}
															onChange={(value: Date) => {
																setBanktransactieFilters({
																	...banktransactieFilters,
																	startDate: value ? d(value).format("YYYY-MM-DD") : undefined
																});
															}}
															showYearDropdown
															dropdownMode={"select"}
															customInput={<Input type={"text"} autoComplete="no" aria-autocomplete="none" />}
															isClearable={true}
														/>
													</FormControl>
													<FormControl>
														<FormLabel>{t("transactionsPage.filters.to")}</FormLabel>
														<DatePicker
															selected={banktransactieFilters.endDate ? new Date(banktransactieFilters.endDate) : null}
															autoComplete="no"
															aria-autocomplete="none"
															dateFormat={"dd-MM-yyyy"}
															onChange={(value: Date) => {
																setBanktransactieFilters({
																	...banktransactieFilters,
																	endDate: value ? d(value).format("YYYY-MM-DD") : undefined
																});
															}}
															onChangeRaw={(val) => {
																if (!isNaN(Date.parse(val.toString()))) {
																	const value = d(val.toString()).format("YYYY-MM-DD")
																	setBanktransactieFilters({
																		...banktransactieFilters,
																		endDate: value ? d(value).format("YYYY-MM-DD") : undefined
																	});
																}
															}}
															showYearDropdown={true}
															customInput={<Input type={"text"} autoComplete="no" aria-autocomplete="none" />}
															isClearable={true}
														/>
													</FormControl>
												</HStack>
											</FormControl>
											<FormControl paddingLeft={15}>
												<Stack>
													<FormLabel>{t("filters.transactions.pageSize")}</FormLabel>
													<ButtonGroup size={"sm"} isAttached>
														<Button colorScheme={pageSize === 50 ? "primary" : "gray"} onClick={() => setPageSize(50)}>50</Button>
														<Button colorScheme={pageSize === 100 ? "primary" : "gray"} onClick={() => setPageSize(100)}>100</Button>
														<Button colorScheme={pageSize === 250 ? "primary" : "gray"} onClick={() => setPageSize(250)}>250</Button>
													</ButtonGroup>
												</Stack>
											</FormControl>
										</HStack>
									</Stack>
									<Stack>
										<Collapse in={isOpen} animateOpacity>
											<Stack paddingBottom={"20px"}>
												<HStack paddingBottom={"10px"}>
													<Queryable query={$rekeningen} children={data => {
														const rekeningen: Rekening[] = data.rekeningen || [];
														const rekeningen_filter = rekeningen.filter(rekening => filterRekeningIbans.includes(rekening.iban!)).map(rekening => ({
															key: rekening.iban,
															value: rekening.iban,
															label: rekening.rekeninghouder,
														}));
														return (
															<Stack direction={"column"} spacing={5} flex={1}>
																<HStack >
																	<FormControl as={Stack} flex={1}>
																		<FormLabel>{t("transactionsPage.filters.accounts")}</FormLabel>
																		<Select onChange={onSelectRekening} options={rekeningen.map(rekening => ({
																			key: rekening.iban,
																			value: rekening.iban,
																			label: rekening.rekeninghouder + " (" + rekening.iban + ")",
																		}))}
																		styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200}
																		placeholder={t("transactionsPage.filters.none")} value={rekeningen_filter} />
																	</FormControl>
																</HStack>
															</Stack>
														);
													}} />
													<Queryable query={$organisaties} children={data => {
														const organisaties: Organisatie[] = data.organisaties || [];
														const organisatie_filter = organisaties.filter(organisatie => filterOrganisatieIds.includes(organisatie.id!)).map(organisatie => ({
															key: organisatie.id,
															value: organisatie.id,
															label: organisatie.naam,
														}));
														return (
															<Stack direction={"column"} spacing={5} flex={1} paddingLeft={15}>
																<HStack>
																	<FormControl as={Stack} flex={1}>
																		<FormLabel>{t("transactionsPage.filters.organisatie")}</FormLabel>
																		<Select onChange={onSelectOrganisatie} options={organisaties.map(organisatie => ({
																			key: organisatie.id,
																			value: organisatie.id,
																			label: organisatie.naam,
																		}))}
																		styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200}
																		placeholder={t("transactionsPage.filters.none")} value={organisatie_filter} />
																	</FormControl>
																</HStack>
															</Stack>
														);
													}} />
												</HStack>
												<Queryable query={$burgers} children={data => {
													const burgers: Burger[] = data.burgers || [];
													const burgers_filter = burgers.filter(b => filterBurgerIds.includes(b.id!)).map(b => ({
														key: b.id,
														value: b.id,
														label: formatBurgerName(b) + " " + getBurgerHhbId(b),
													}));
													return (
														<Stack direction={"column"} spacing={5} flex={1}>
															<HStack>
																<FormControl as={Stack} flex={1} paddingBottom={15}>
																	<FormLabel>{t("transactionsPage.filters.burgers")}</FormLabel>
																	<Select onChange={onSelectBurger} options={burgers.map(b => ({
																		key: b.id,
																		value: b.id,
																		label: formatBurgerName(b) + " " + getBurgerHhbId(b),
																	}))}
																	isDisabled={blockBookedFilters()}
																	styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200}
																	placeholder={blockBookedFilters() ? t("transactionsPage.filters.none") : t("charts.optionAllBurgers")} value={burgers_filter} />
																</FormControl>
															</HStack>
														</Stack>
													);
												}} />
												<HStack paddingBottom={15}>
													<FormControl>
														<FormLabel>{t("transactionsPage.filters.amountFrom")}</FormLabel>
														<InputGroup>
															<InputLeftAddon>€</InputLeftAddon>
															<NumberInput
															 	aria-autocomplete="none"
																w={"100%"}
																precision={2}
																value={minBedrag}
															>
																<NumberInputField
																	borderLeftRadius={0}
																	autoComplete="no"
																	aria-autocomplete="none"
																	onChange={(value) => {
																		onChangeMinbedrag(value.target.value)
																	}}
																	value={minBedrag}
																	placeholder={t("transactionsPage.filters.none")}
																/>
															</NumberInput>
														</InputGroup>
													</FormControl>
													<FormControl paddingLeft={15}>
														<FormLabel>{t("transactionsPage.filters.amountTo")}</FormLabel>
														<InputGroup>
															<InputLeftAddon>€</InputLeftAddon>
															<NumberInput
															 	aria-autocomplete="none"
																w={"100%"}
																precision={2}
																value={maxBedrag}
															>
																<NumberInputField
																	borderLeftRadius={0}
																	autoComplete="no"
																	aria-autocomplete="none"
																	onChange={(value) => {
																		onChangeMaxbedrag(value.target.value)
																	}}
																	value={maxBedrag}
																	placeholder={t("transactionsPage.filters.none")}
																/>
															</NumberInput>
														</InputGroup>
													</FormControl>
												</HStack>
												{invalidBedrag() ?
													<Tag colorScheme={"red"} size={"md"} variant={"subtle"}>
														<Icon as={WarningTwoIcon} />
														{t("transactionsPage.filters.amountwarning")}
													</Tag> : ""
												}
												<FormLabel paddingBottom={"10px"}>
													<FormLabel>
														{t("transactionsPage.filters.description")}
													</FormLabel>
													<form onSubmit={onAddzoekterm}>
														<InputGroup size={"md"}>
															<Input
																autoComplete="no"
																aria-autocomplete="none"
																id={"zoektermen"}
																onChange={e => setZoekterm(e.target.value)}
																value={zoekterm || ""} 
															/>
															<InputRightElement width={"auto"} pr={1}>
																<Button type={"submit"} size={"sm"} colorScheme={"primary"}>Zoeken</Button>
															</InputRightElement>
														</InputGroup>
														<ZoektermenList zoektermen={zoektermen} onClickDelete={(zoekterm: string) => onDeleteZoekterm(zoekterm)} />
													</form>
												</FormLabel>
											</Stack>
										</Collapse>
										<Button leftIcon={isOpen ? <TriangleUpIcon /> : <TriangleDownIcon />} colorScheme={"blue"} variant={"outline"} onClick={onToggle}>{t("transactionsPage.filters.extensive")}</Button>
										{extraFiltersUsed() && !isOpen ?
											<Tag colorScheme={"red"} size={"md"} variant={"subtle"}>
												<Icon as={WarningTwoIcon} />
												{t("transactionsPage.filters.active")}
											</Tag> : ""}
									</Stack>
								</Stack>
							</Stack>
							<Stack paddingTop={15}>
								<Stack>
									<HStack justify={"space-between"}>
										{transacties.length > 0 ? (
											<HStack>
												<Text>{t("transactionsPage.filters.count")}: </Text>
												<Box width={50}> {$transactions.loading ? <Spinner size={"xs"} /> : total}</Box>
											</HStack>
										) : (
											<Text />
										)}
										<HStack>
											<Text>{t("transactionsPage.timeUpdated")}: {d(timeLastUpdate).format("HH:mm:ss")}</Text>
											<IconButton
												icon={<RepeatIcon />}
												size={"xs"}
												onClick={() => {
													$transactions.refetch();
												}} aria-label={"reload"}
											>
												reload
											</IconButton>
										</HStack>
									</HStack>
								</Stack>
									{$transactions.loading ? <Spinner/> : <Stack>
										{transacties.length > 0 ? (
											<Stack>
												<TransactiesList transacties={transacties} />
											</Stack>
										) : (
											<Stack>
												<Text>{t("messages.transactions.noResults")}</Text>
											</Stack>
										)}
									<HStack justify={"center"}>
										<PaginationButtons />
									</HStack>
								</Stack>}
							</Stack>
						</Section>
					);
				}} />
			</SectionContainer>
		</Page>
	);
};

export default Transactions;
