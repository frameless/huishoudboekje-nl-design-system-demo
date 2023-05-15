import {Box, Button, Divider, FormControl, FormLabel, HStack, Input, InputGroup, InputRightElement, Radio, RadioGroup, RangeSlider, RangeSliderFilledTrack, RangeSliderMark, RangeSliderThumb, RangeSliderTrack, Stack, Tab, Table, TabList, TabPanel, TabPanels, Tabs, Tbody, Text, Th, Thead, Tr} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afspraak, Burger, BankTransaction, GetTransactieDocument, GetSaldoDocument, Rubriek, useCreateJournaalpostAfspraakMutation, useCreateJournaalpostGrootboekrekeningMutation, useGetSimilarAfsprakenLazyQuery, useGetBurgersAndOrganisatiesQuery, Organisatie, useGetSearchAfsprakenQuery, useCreateSaldoMutation, useUpdateSaldoMutation} from "../../../generated/graphql";
import useToaster from "../../../utils/useToaster";
import SelectAfspraakOption from "../../shared/SelectAfspraakOption";
import {TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import usePagination from "../../../utils/usePagination";
import Queryable from "../../../utils/Queryable";
import ZoektermenList from "../../shared/ZoektermenList";
import {floatMathOperation, MathOperation, useReactSelectStyles, formatBurgerName} from "../../../utils/things";
import d from "../../../utils/dayjs";
import {useLazyQuery} from "@apollo/client/react/hooks/useLazyQuery";

export function isSuggestie(suggestie: Afspraak, transaction: BankTransaction): boolean {
	//Only check on zoektermen because the backend checks on iban (on organisation level)
	if (suggestie.zoektermen?.every(zoekterm => transaction.informationToAccountOwner?.includes(zoekterm))) {
		return true
	}
	return false
}

const BookingSection = ({transaction, rubrieken}) => {
	const reactSelectStyles = useReactSelectStyles();
	const toast = useToaster();
	const {t} = useTranslation();
	const suggesties: Afspraak[] = transaction.suggesties || [];
	const ids = suggesties ? suggesties.map(suggestie => suggestie.id ? suggestie.id : -1).filter(id => id != -1) : []
	const [showExtraAfspraken, setShowExtraAfspraken] = React.useState(false);


	const [getSimilarAfspraken, similairAfsprakenQuery] = useGetSimilarAfsprakenLazyQuery({
		variables: {
			ids: ids
		},
	});



	const options: {
		suggesties: Afspraak[]
		afspraken: Afspraak[]
		rubrieken: Rubriek[]
	} = {
		suggesties: suggesties,
		afspraken: [],
		rubrieken: rubrieken.filter(rubriek => rubriek.grootboekrekening && rubriek.grootboekrekening.id).sort((a: Rubriek, b: Rubriek) => {
			return a.naam && b.naam && a.naam < b.naam ? -1 : 1;
		}).map((rubriek: Rubriek) => ({
			key: rubriek.id,
			label: rubriek.naam,
			value: rubriek.grootboekrekening!.id,
		})),
	};
	let similarAfspraken: Afspraak[] = []

	const toggleShowExtraAfspraken = () => {
		setShowExtraAfspraken(!showExtraAfspraken)
		if (similairAfsprakenQuery.data == undefined && ids.length > 0) {
			getSimilarAfspraken()
		}
	}

	if (similairAfsprakenQuery.data != undefined && showExtraAfspraken) {
		similairAfsprakenQuery.data.afspraken?.forEach(afspraak => {

			const similar: Afspraak[] = afspraak.similarAfspraken ? afspraak.similarAfspraken : []
			similarAfspraken.push(...similar)
		})
		const num = transaction.bedrag
		similarAfspraken = Array.from(new Set(similarAfspraken.filter(similarAfspraak => !suggesties.find(suggestie => suggestie.id === similarAfspraak.id))
			.sort((a, b) => Math.abs(a.bedrag - num) - Math.abs(b.bedrag - num))));
		options.afspraken = similarAfspraken
	}
	if (similairAfsprakenQuery.data === undefined || !showExtraAfspraken) {
		options.afspraken = []
	}

	const [createSaldo] = useCreateSaldoMutation()
	const [updateSaldo] = useUpdateSaldoMutation()

	// const [evaluateAlarm] = useEvaluateAlarmMutation();
	const [createJournaalpostAfspraak] = useCreateJournaalpostAfspraakMutation({
		refetchQueries: [
			{query: GetTransactieDocument, variables: {id: transaction.id}},
		],
		// Todo move this to the backend, which should be way more performant. (30-09-2022)
		// onCompleted: (result) => {
		// 	const afsprakenAlarmIds = result.createJournaalpostAfspraak?.journaalposten?.map(j => j.afspraak?.alarm?.id) || [];
		// 	afsprakenAlarmIds.forEach(id => {
		// 		evaluateAlarm({variables: {id: id!}});
		// 	});
		// },
	});

	const [createJournaalpostGrootboekrekening] = useCreateJournaalpostGrootboekrekeningMutation({
		refetchQueries: [
			{query: GetTransactieDocument, variables: {id: transaction.id}},
		],
	});

	const [getSaldo] = useLazyQuery(GetSaldoDocument, {
		fetchPolicy: "no-cache"
	})

	const onSelectRubriek = (val) => {
		const foundRubriek = rubrieken.find(r => r.grootboekrekening?.id === val.value);

		const transactionId = transaction?.id;
		const grootboekrekeningId = foundRubriek?.grootboekrekening?.id;

		if (transactionId && grootboekrekeningId) {
			createJournaalpostGrootboekrekening({
				variables: {transactionId, grootboekrekeningId},
			}).then(() => {
				toast({success: t("messages.journals.createSuccessMessage")});
			}).catch(err => {
				console.error(err);
				toast({error: err.message});
			});
		}
	};

	function calculateNewSaldo(oldSaldo, newSaldo) {
		let saldo = (+oldSaldo * 100) + (+newSaldo * 100)
		saldo = saldo / 100
		return saldo
	}

	const onSelectAfspraak = (afspraak: Afspraak) => {
		const transactionId = transaction?.id;
		const afspraakId = afspraak.id;

		if (transactionId && afspraakId) {
			createJournaalpostAfspraak({
				variables: {transactionId, afspraakId},
			}).then(() => {
				toast({success: t("messages.journals.createSuccessMessage")});
			}).catch(err => {
				console.error(err);
				toast({error: err.message});
			});
			const transactionDate = transaction.transactieDatum
			const burgerId: number = afspraak?.burger?.id ?? 0

			getSaldo({
				variables: {
					burger_ids: [burgerId],
					date: d(transactionDate).format("YYYY-MM-DD")
				}
			}).then(
				(result) => {
					if (result.data.saldo.length > 0) {
						const saldo = floatMathOperation(result.data.saldo[0]?.saldo, transaction.bedrag, 2, MathOperation.Plus);
						updateSaldo({
							variables: {
								input: {
									id: result.data.saldo[0]?.id,
									saldo: saldo
								}
							}
						})
					}
					else if (result.data.saldo.length === 0) {
						const startingDate = d(transactionDate).startOf("month").format("YYYY-MM-DD");
						const endDate = d(transactionDate).endOf("month").format("YYYY-MM-DD");

						createSaldo({
							variables: {
								input: {
									begindatum: startingDate,
									einddatum: endDate,
									saldo: transaction.bedrag,
									burgerId: burgerId
								}
							}
						})
					}
				}
			)
		}
	};
	const {offset, setTotal, goFirst, PaginationButtons} = usePagination({pageSize: 25});

	const searchVariables: {
		offset: number,
		limit: number,
		afspraken: number[] | undefined,
		afdelingen: number[] | undefined,
		burgers: number[] | undefined,
		only_valid: boolean | undefined,
		min_bedrag: number | undefined,
		max_bedrag: number | undefined,
		zoektermen: string[] | undefined
	} = {
		offset: offset - 1,
		limit: 25,
		afspraken: undefined,
		afdelingen: undefined,
		burgers: undefined,
		only_valid: true,
		min_bedrag: undefined,
		max_bedrag: undefined,
		zoektermen: undefined
	}

	const [filterBurgerIds, setFilterBurgerIds] = useState<number[]>([]);
	const [filterOrganisatieids, setFilterOrganisatieIds] = useState<number[]>([]);
	const $burgersAndOrganisaties = useGetBurgersAndOrganisatiesQuery();
	const onSelectBurger = (value) => {
		setFilterBurgerIds(value ? value.map(v => v.value) : [])
		goFirst()
	};

	const onSelectOrganisatie = (value) => {
		setFilterOrganisatieIds(value ? value.map(v => v.value) : [])
		goFirst()
	};

	const [sliderValue, setSliderValue] = useState([0, 5000])

	const onSetSliderValue = (value) => {
		setSliderValue(value)
		goFirst()
	};

	const [valid, setOnlyValid] = useState(true)

	const onChangeValidRadio = (value) => {
		if (value === "1") {
			onSetOnlyValid(true)
		}
		if (value === "2") {
			onSetOnlyValid(false)
		}
		if (value === "3") {
			onSetOnlyValid(undefined)
		}
	}

	const onSetOnlyValid = (value) => {
		setOnlyValid(value)
		goFirst()
	};

	const [zoekterm, setZoekterm] = useState<string>("");
	const [zoektermen, setZoektermen] = useState<string[]>([]);

	searchVariables.burgers = filterBurgerIds.length > 0 ? filterBurgerIds : undefined
	searchVariables.min_bedrag = sliderValue[0] !== 0 ? sliderValue[0] * 100 : undefined
	searchVariables.max_bedrag = sliderValue[1] !== 5000 ? sliderValue[1] * 100 : undefined
	searchVariables.only_valid = valid
	if (filterOrganisatieids.length > 0) {
		const organisaties: Organisatie[] = $burgersAndOrganisaties.data?.organisaties || []
		const filteredOrganisaties = organisaties.filter(organisatie => organisatie.id ? filterOrganisatieids.includes(organisatie.id) : false)
		const afdelingen = filteredOrganisaties.map(organisatie => organisatie.afdelingen ? organisatie.afdelingen : []).flat() || []
		searchVariables.afdelingen = afdelingen.map(afdeling => afdeling.id ? afdeling.id : -1).filter(id => id !== -1)
	}
	else {
		searchVariables.afdelingen = undefined
	}
	searchVariables.zoektermen = zoektermen.length > 0 ? zoektermen : undefined



	const onAddzoekterm = (e) => {
		e.preventDefault();
		if(zoekterm !== ""){
			const list: string[] = []
			list.push(zoekterm)
			const newZoektermen = zoektermen.concat(list)
			setZoektermen(newZoektermen)
			setZoekterm("")
			goFirst()
		}
	};

	const onDeleteZoekterm = (value) => {
		const list: string[] = zoektermen.slice()
		const index = zoektermen.indexOf(value)
		list.splice(index, 1)
		setZoektermen(list)
		setZoekterm(zoekterm)
		goFirst()
	}

	const $searchAfspraken = useGetSearchAfsprakenQuery({
		fetchPolicy: "no-cache",
		variables: searchVariables
	});


	return (
		<Stack>
			<Tabs align={"start"} variant={"enclosed"}>
				<TabList>
					<Tab>{t("bookingSection.afspraak")}</Tab>
					<Tab>{t("bookingSection.rubriek")}</Tab>
				</TabList>
				<TabPanels>
					<TabPanel px={0}>
						<Tabs align={"start"} variant={"soft-rounded"}>
							<HStack justify={"space-between"} align={"bottom"}>
								<TabList>
									<Tab>{t("bookingSection.sugestions")}</Tab>
									<Tab>{t("bookingSection.search")}</Tab>
								</TabList>
							</HStack>
							<TabPanels>
								<TabPanel>
									<Stack spacing={2}>
										{[...options.suggesties, ...options.afspraken].length === 0 ? (
											<Text>{t("bookingSection.noResults")}</Text>
										) : (
											<Table size={"sm"}>
												<Thead>
													<Tr>
														<Th>{t("burger")}</Th>
														<Th>{t("afspraken.omschrijving")}</Th>
														<Th>{t("afspraken.zoekterm")}</Th>
														<Th />
														<Th>{t("bedrag")}</Th>
													</Tr>
												</Thead>
												<Tbody>
													{options.suggesties.map(suggestie => (
														<SelectAfspraakOption key={suggestie.id} afspraak={suggestie} isSuggestion={isSuggestie(suggestie, transaction)} onClick={() => onSelectAfspraak(suggestie)} />
													))}
													{options.afspraken.map(a => (
														<SelectAfspraakOption key={a.id} afspraak={a} onClick={() => onSelectAfspraak(a)} />
													))}
												</Tbody>
											</Table>
										)}
										<Box>
											<Text>
												{!similairAfsprakenQuery.loading && showExtraAfspraken && similarAfspraken.length === 0 ? t("bookingSection.noSimilarAfspraken") : ""}
											</Text>
											<Button isLoading={similairAfsprakenQuery.loading} leftIcon={showExtraAfspraken ? <TriangleUpIcon /> : <TriangleDownIcon />} colorScheme={"primary"} size={"sm"} onClick={toggleShowExtraAfspraken} >
												{t("bookingSection.similarAfspraken")}
											</Button>
										</Box>
									</Stack>
								</TabPanel>
								<TabPanel px={0}>
									<Queryable query={$burgersAndOrganisaties} children={data => {
										const burgers: Burger[] = data.burgers || [];
										const burgers_filter = burgers.filter(b => filterBurgerIds.includes(b.id!)).map(b => ({
											key: b.id,
											value: b.id,
											label: formatBurgerName(b),
										}));
										const organisaties: Organisatie[] = data.organisaties || [];
										const organisaties_filter = organisaties.filter(o => filterOrganisatieids.includes(o.id!)).map(o => ({
											key: o.id,
											value: o.id,
											label: o.naam,
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
													<FormControl as={Stack} flex={1}>
														<FormLabel>{t("bookingSection.organisation")}</FormLabel>
														<Select onChange={onSelectOrganisatie} options={organisaties.map(o => ({
															key: o.id,
															value: o.id,
															label: o.naam,
														}))} styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("bookingSection.allOrganisations")} value={organisaties_filter} />
													</FormControl>
												</HStack>
												<HStack paddingTop={5} spacing={10} flex={2}>
													<FormLabel >{t("bookingSection.amount")}</FormLabel>
													<FormControl as={Stack} flex={1}>
														<RangeSlider aria-label={["min", "max"]} min={0} max={5000} step={50} defaultValue={[0, 5000]} onChange={(val) => onSetSliderValue(val)}>
															<RangeSliderTrack>
																<RangeSliderFilledTrack />
															</RangeSliderTrack>
															<RangeSliderMark value={sliderValue[0]} textAlign={"center"} bg={"blue.500"} color={"white"} mt={-10} ml={-5} w={20}>
																{"€" + sliderValue[0]}
															</RangeSliderMark>
															<RangeSliderMark value={sliderValue[1]} textAlign={"center"} bg={"blue.500"} color={"white"} mt={-10} ml={-5} w={20}>
																{"€" + sliderValue[1]}
															</RangeSliderMark>
															<RangeSliderThumb index={0} />
															<RangeSliderThumb index={1} />
														</RangeSlider>
													</FormControl>
												</HStack>
												<RadioGroup defaultValue={"1"} onChange={onChangeValidRadio}>
													<Stack spacing={5} direction={"row"}>
														<Radio colorScheme={"blue"} value={"1"}>
															{t("bookingSection.active")}
														</Radio>
														<Radio colorScheme={"blue"} value={"2"}>
															{t("bookingSection.ended")}
														</Radio>
														<Radio colorScheme={"blue"} value={"3"}>
															{t("bookingSection.all")}
														</Radio>
													</Stack>
												</RadioGroup>
												<FormLabel flex={1}>{t("bookingSection.searchOmschrijvingAndTerms")}</FormLabel>
												<form onSubmit={onAddzoekterm}>
													<InputGroup size={"md"}>
														<Input id={"zoektermen"} onChange={e => setZoekterm(e.target.value)} value={zoekterm || ""} />
														<InputRightElement width={"auto"} pr={1}>
															<Button type={"submit"} size={"sm"} colorScheme={"primary"}>Zoeken</Button>
														</InputRightElement>
													</InputGroup>
													<ZoektermenList zoektermen={zoektermen} onClickDelete={(zoekterm: string) => onDeleteZoekterm(zoekterm)} />
												</form>
												<Divider />
												<Queryable query={$searchAfspraken} options={{hidePreviousResults: true}} children={(data) => {
													const searchAfspraken: Afspraak[] = data?.searchAfspraken?.afspraken || [];
													setTotal(data?.searchAfspraken?.pageInfo?.count || 0)
													return (
														<Stack spacing={2}>
															{searchAfspraken.length === 0 ? (
																<Text>{t("bookingSection.noResults")}</Text>
															) : (
																<Table size={"sm"}>
																	<Thead>
																		<Tr>
																			<Th>{t("burger")}</Th>
																			<Th>{t("afspraken.omschrijving")}</Th>
																			<Th>{t("afspraken.zoekterm")}</Th>
																			<Th />
																			<Th>{t("bedrag")}</Th>
																		</Tr>
																	</Thead>
																	<Tbody>
																		{searchAfspraken.map(afspraak => (
																			<SelectAfspraakOption key={afspraak.id} afspraak={afspraak} onClick={() => onSelectAfspraak(afspraak)} />
																		))}
																	</Tbody>
																</Table>
															)}
															<HStack justify={"center"}>
																<PaginationButtons />
															</HStack>
														</Stack>
													);
												}} />
											</Stack>
										);
									}} />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</TabPanel>
					<TabPanel px={0}>
						<FormControl>
							<Select onChange={onSelectRubriek} options={options.rubrieken} isClearable={true} noOptionsMessage={() => t("select.noOptions")}
								maxMenuHeight={350} styles={reactSelectStyles.default} />
						</FormControl>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Stack>
	);
};

export default BookingSection;
