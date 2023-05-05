import {Box, Button, ButtonGroup, Collapse, FormControl, FormLabel, HStack, Icon, Input, InputGroup, InputRightElement, Radio, RadioGroup, RangeSlider, RangeSliderFilledTrack, RangeSliderMark, RangeSliderThumb, RangeSliderTrack, Slide, Stack, Tag, Text, VStack, useDisclosure} from "@chakra-ui/react";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useStartAutomatischBoekenMutation, useSearchTransactiesQuery, BankTransaction, SearchTransactiesQueryVariables, useGetBurgersQuery, Burger, Rekening, SearchTransactiesDocument, useGetRekeningenQuery} from "../../../generated/graphql";
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
import d from "../../../utils/dayjs";
import ZoektermenList from "../../shared/ZoektermenList";
import { TriangleUpIcon, TriangleDownIcon, WarningTwoIcon, CloseIcon } from "@chakra-ui/icons";


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
	const [filterRekeningIbans, setFilterRekeingIbans] = useState<string[]>(banktransactieFilters.ibans || []);
	const $burgers = useGetBurgersQuery();
	const $rekeningen = useGetRekeningenQuery();

	const onSelectBurger = (value) => {
		const newValue = value ? value.map(v => v.value) : []
		setFilterBurgerIds(newValue)		
		setBanktransactieFilters({
			...banktransactieFilters,
			burgerIds: newValue.length > 0 ? newValue : undefined
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
        let onlyBooked : boolean | undefined = undefined
		if(value === "1"){
            onlyBooked = false
		}
		if(value === "2"){
            onlyBooked = true
		}
		setBanktransactieFilters({
			...banktransactieFilters,
			onlyBooked: onlyBooked,
			burgerIds: !onlyBooked ? undefined : banktransactieFilters.burgerIds
		})
		if(!onlyBooked){
			if(filterBurgerIds.length > 0){
				setFilterBurgerIds([])
			}
			if(filterBurgerIds.length > 0){
				setFilterRekeingIbans([])
			}
		}
	}

	
	const [zoekterm, setZoekterm] = useState<string>("");
	const [zoektermen, setZoektermen] = useState<string[]>([]);
	const onAddzoekterm = (e) => {
		e.preventDefault();
		const list : string[] = []
		list.push(zoekterm)
		const newZoektermen = zoektermen.concat(list)
		setBanktransactieFilters({
			...banktransactieFilters,
			zoektermen: newZoektermen.length > 0 ? newZoektermen : undefined
		})
		setZoektermen(newZoektermen)
		setZoekterm("")
		goFirst()
	};

	const onDeleteZoekterm = (value) => {
		const list : string[] = zoektermen.slice()
		const index = zoektermen.indexOf(value)
		list.splice(index,1)
		setBanktransactieFilters({
			...banktransactieFilters,
			zoektermen: list.length > 0 ? list : undefined
		})
		setZoektermen(list)
		setZoekterm(zoekterm)
		goFirst()
	}

	
	const [sliderValue, setSliderValue] = useState([banktransactieFilters.minBedrag || 0, banktransactieFilters.maxBedrag || 5000])
	const onSetSliderValue = (value) => {
		setBanktransactieFilters({
			...banktransactieFilters,
			minBedrag: value[0] === 0 ? undefined : value[0] * 100,
			maxBedrag: value[1] === 5000  ? undefined : value[1] * 100
		})
		setSliderValue(value)
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
			{query: SearchTransactiesDocument, variables: queryVariables},
		],
	});

	const blockBookedFilters = () =>{
		return !banktransactieFilters.onlyBooked
	}

	const extraFiltersUsed = () => {
		return banktransactieFilters.minBedrag !== undefined ||
			banktransactieFilters.maxBedrag !== undefined ||
			banktransactieFilters.zoektermen !== undefined ||
			banktransactieFilters.ibans !== undefined ||
			banktransactieFilters.burgerIds !== undefined
	}

	const { isOpen, onToggle } = useDisclosure()

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
								<Stack>
									<HStack>
										<FormControl>
											<FormLabel>Status</FormLabel>
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
										</FormControl>
										<FormControl paddingLeft={15}>
											<FormLabel>Richting</FormLabel>
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
										</FormControl>
									</HStack>
									<HStack>
										<FormControl>
											<HStack>
												<FormControl>
													<FormLabel>Van</FormLabel>
													<DatePicker selected={banktransactieFilters.startDate ? new Date(banktransactieFilters.startDate) : null}
														dateFormat={"dd-MM-yyyy"}
														onChange={(value: Date) => {
															setBanktransactieFilters({
																...banktransactieFilters,
																startDate: value ? d(value).format("YYYY-MM-DD"): undefined
															});
														}}
														customInput={<Input type={"text"} />}
														isClearable={true}
													/>
												</FormControl>
												<FormControl>
													<FormLabel>Tot</FormLabel>
													<DatePicker selected={banktransactieFilters.endDate ? new Date(banktransactieFilters.endDate) : null}
														dateFormat={"dd-MM-yyyy"}
														onChange={(value: Date) => {
															setBanktransactieFilters({
																...banktransactieFilters,
																endDate: value ? d(value).format("YYYY-MM-DD"): undefined
															});
														}}
														customInput={<Input type={"text"} />}
														isClearable={true}
													/>
												</FormControl>
											</HStack>
										</FormControl>
										<FormControl paddingLeft={15}>
											<Stack>
												<FormLabel>{t("filters.transactions.pageSize")}</FormLabel>
												<ButtonGroup size={"sm"} isAttached>
													<Button colorScheme={customPageSize === 25 ? "primary" : "gray"} onClick={() => setCustomPageSize(25)}>25</Button>
													<Button colorScheme={customPageSize === 50 ? "primary" : "gray"} onClick={() => setCustomPageSize(50)}>50</Button>
													<Button colorScheme={customPageSize === 100 ? "primary" : "gray"} onClick={() => setCustomPageSize(100)}>100</Button>
													<Button colorScheme={customPageSize === 250 ? "primary" : "gray"} onClick={() => setCustomPageSize(250)}>250</Button>
												</ButtonGroup>
											</Stack>
										</FormControl>
									</HStack>
								</Stack>
								<Stack>
									<Collapse in={isOpen} animateOpacity>
										<Stack>
											<HStack paddingTop={10} paddingRight={100} spacing={10} flex={2}>
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
											<FormLabel >Zoeken in omschrijving</FormLabel>
											<form onSubmit={onAddzoekterm}>
													<InputGroup size={"md"}>
														<Input id={"zoektermen"} onChange={e => setZoekterm(e.target.value)} value={zoekterm || ""} />
														<InputRightElement width={"auto"} pr={1}>
															<Button type={"submit"} size={"sm"} colorScheme={"primary"}>Zoeken</Button>
														</InputRightElement>
													</InputGroup>
													<ZoektermenList zoektermen={zoektermen} onClickDelete={(zoekterm: string) => onDeleteZoekterm(zoekterm)} />
											</form>
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
																<FormLabel>Filter op rekeningen</FormLabel>
																<Select  onChange={onSelectRekening} options={rekeningen.map(rekening => ({
																	key: rekening.iban,
																	value: rekening.iban,
																	label: rekening.rekeninghouder,
																}))} 
																styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} 
																placeholder={"n.v.t"} value={rekeningen_filter} />
															</FormControl>
														</HStack>
													</Stack>
												);
											}} />
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
																<Select  onChange={onSelectBurger} options={burgers.map(b => ({
																	key: b.id,
																	value: b.id,
																	label: formatBurgerName(b),
																}))} 
																isDisabled={blockBookedFilters()}
																styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} 
																placeholder={blockBookedFilters() ? "n.v.t" : t("charts.optionAllBurgers")} value={burgers_filter} />
															</FormControl>
														</HStack>
													</Stack>
												);
											}} />
										</Stack>
									</Collapse>
									<Button leftIcon={isOpen ? <TriangleUpIcon /> : <TriangleDownIcon />} onClick={onToggle}>Uitgebreid zoeken</Button>
									{extraFiltersUsed() && !isOpen? 
										<Tag colorScheme={"red"} size={"md"} variant={"subtle"}>
											<Icon as={WarningTwoIcon} />
											Uitgebreide filters actief
										</Tag>: ""}
								</Stack>
							</Stack>
							<Button >test</Button>
							<Stack paddingTop={15}>
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
							</Stack>
						</Section>
					);
				}} />
			</SectionContainer>
		</Page>
	);
};

export default Transactions;
