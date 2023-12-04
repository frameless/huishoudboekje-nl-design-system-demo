import {Button, FormControl, FormLabel, HStack, Icon, Input, InputGroup, InputLeftAddon, InputRightElement, NumberInput, NumberInputField, Radio, RadioGroup, Stack, Tab, Table, TabList, TabPanel, TabPanels, Tabs, Tag, Tbody, Text, Th, Thead, Tr} from "@chakra-ui/react";
import { useState } from "react";
import { useGetSearchAfsprakenQuery } from "../../../../generated/graphql";
import { formatBurgerName, getBurgerHhbId } from "../../../../utils/things";
import ZoektermenList from "../../../shared/ZoektermenList";
import Select from "react-select";
import {useReactSelectStyles} from "../../../../utils/things";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

type AfspraakSearchVariables = {
	offset: number,
	limit: number,
	afspraken: number[] | undefined,
	afdelingen: number[] | undefined,
	tegenrekeningen: number[] | undefined,
	burgers: number[] | undefined,
	only_valid: boolean | undefined,
	min_bedrag: number | undefined,
	max_bedrag: number | undefined,
	zoektermen: string[] | undefined
};

const BookingSectionAfspraakFilters = ({organisaties, burgers, rekeningen, updateAfspraken, reset, offset, expectedTransactionOrganisation}) => {
	const reactSelectStyles = useReactSelectStyles();
	const {t} = useTranslation();
    
    const searchVariables: AfspraakSearchVariables = {
		offset: offset <= 1 ? 0 : offset,
		limit: 25,
		afspraken: undefined,
		afdelingen: undefined,
		tegenrekeningen: undefined,
		burgers: undefined,
		only_valid: true,
		min_bedrag: undefined,
		max_bedrag: undefined,
		zoektermen: undefined
	}

	const [minBedrag, setMinBedrag] = useState(searchVariables.min_bedrag)
	const [maxBedrag, setMaxBedrag] = useState(searchVariables.max_bedrag)
	const [filterBurgerIds, setFilterBurgerIds] = useState<number[]>([]);
	const [filterOrganisatieids, setFilterOrganisatieIds] = useState<number[]>(expectedTransactionOrganisation ? expectedTransactionOrganisation : []);
	const [filterTegenrekeningIds, setFilterTegenrekeningIds] = useState<number[]>([]);
	const [valid, setOnlyValid] = useState(true)
	const [zoekterm, setZoekterm] = useState<string>("");
	const [zoektermen, setZoektermen] = useState<string[]>([]);

	const invalidBedrag = () => {
		let result = false;
		if (maxBedrag !== undefined && minBedrag !== undefined) {
			if (+maxBedrag < +minBedrag) {
				result = true
			}
		}
		return result
	}

	const onChangeMaxbedrag = (valueAsString) => {
		setMaxBedrag(valueAsString)
		reset()
	}

	const onChangeMinbedrag = (valueAsString) => {
		setMinBedrag(valueAsString)
		reset()
	}

	const onSelectBurger = (value) => {
		setFilterBurgerIds(value ? value.map(v => v.value) : [])
		reset()
	};

	const onSelectOrganisatie = (value) => {
		setFilterOrganisatieIds(value ? value.map(v => v.value) : [])
		reset()
	};
	
	const onSelectTegenrekening = (value) => {
		setFilterTegenrekeningIds(value ? value.map(v => v.value) : [])
		reset()
	};

	const onSetOnlyValid = (value) => {
		setOnlyValid(value)
		reset()
	};

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

	const onAddzoekterm = (e) => {
		e.preventDefault();
		if (zoekterm !== "") {
			const list: string[] = []
			list.push(zoekterm)
			const newZoektermen = zoektermen.concat(list)
			setZoektermen(newZoektermen)
			setZoekterm("")
			reset()
		}
	};

	const onDeleteZoekterm = (value) => {
		const list: string[] = zoektermen.slice()
		const index = zoektermen.indexOf(value)
		list.splice(index, 1)
		setZoektermen(list)
		setZoekterm(zoekterm)
		reset()
	}

	searchVariables.burgers = filterBurgerIds.length > 0 ? filterBurgerIds : undefined
	searchVariables.min_bedrag = minBedrag ? Math.round(+minBedrag * 100) : undefined
	searchVariables.max_bedrag = maxBedrag ? Math.round(+maxBedrag * 100) : undefined
	searchVariables.only_valid = valid
	if (filterOrganisatieids.length > 0) {
		const filteredOrganisaties = organisaties.filter(organisatie => organisatie.id ? filterOrganisatieids.includes(organisatie.id) : false)
		const afdelingen = filteredOrganisaties.map(organisatie => organisatie.afdelingen ? organisatie.afdelingen : []).flat() || []
		searchVariables.afdelingen = afdelingen.map(afdeling => afdeling.id ? afdeling.id : -1).filter(id => id !== -1)
	}
	else {
		searchVariables.afdelingen = undefined
	}
	searchVariables.tegenrekeningen = filterTegenrekeningIds.length > 0 ? filterTegenrekeningIds : undefined
	searchVariables.zoektermen = zoektermen.length > 0 ? zoektermen : undefined

    const burgers_filter = burgers.filter(burger => filterBurgerIds.includes(burger.id!)).map(burger => ({
        key: burger.id,
        value: burger.id,
        label: formatBurgerName(burger) + " " + getBurgerHhbId(burger),
    }));
    const organisaties_filter = organisaties.filter(organisatie => filterOrganisatieids.includes(organisatie.id!)).map(organisatie => ({
        key: organisatie.id,
        value: organisatie.id,
        label: organisatie.naam,
    }));
    const tegen_rekeningen_filter = rekeningen.filter(account => filterTegenrekeningIds.includes(account.id!)).map(account => ({
        key: account.id,
        value: account.id,
        label: account.rekeninghouder + ' (' + account.iban + ')',
    }));

    
	useGetSearchAfsprakenQuery({
		fetchPolicy: "no-cache",
		variables: searchVariables,
        onCompleted: (data)=>{
            updateAfspraken(data.searchAfspraken?.afspraken, data.searchAfspraken?.pageInfo?.count)
        }
	});

	return (
		<Stack direction={"column"} spacing={5} flex={1}>
            <HStack>
                <FormControl as={Stack} flex={1}>
                    <FormLabel>{t("charts.filterBurgers")}</FormLabel>
                    <Select onChange={onSelectBurger} options={burgers.map(b => ({
                        key: b.id,
                        value: b.id,
                        label: formatBurgerName(b) + " " + getBurgerHhbId(b),
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
            <HStack paddingBottom={15}>
                <FormControl as={Stack} flex={1} minWidth={"50%"}>
                    <FormLabel>{t("bookingSection.tegenrekening")}</FormLabel>
                    <Select onChange={onSelectTegenrekening} options={rekeningen.map(o => ({
                            key: o.id,
                            value: o.id,
                            label: o.rekeninghouder + ' (' + o.iban + ')',
                        }))} 
                        styles={reactSelectStyles.default} 
                        isMulti 
                        isClearable={true} 
                        noOptionsMessage={() => t("select.noOptions")} 
                        maxMenuHeight={200} 
                        placeholder={t("bookingSection.allRekeningen")} 
                        value={tegen_rekeningen_filter}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>{t("transactionsPage.filters.amountFrom")}</FormLabel>
                    <InputGroup>
                        <InputLeftAddon>€</InputLeftAddon>
                        <NumberInput w={"100%"} precision={2} value={minBedrag}>
                            <NumberInputField borderLeftRadius={0}
                                autoComplete={"no"} 
                                aria-autocomplete={"none"}
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
                        <NumberInput w={"100%"} precision={2} value={maxBedrag}>
                            <NumberInputField borderLeftRadius={0}
                                autoComplete={"no"} 
                                aria-autocomplete={"none"}
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
                    <Input id={"zoektermen"} autoComplete={"no"} aria-autocomplete={"none"} onChange={e => setZoekterm(e.target.value)} value={zoekterm || ""} />
                    <InputRightElement width={"auto"} pr={1}>
                        <Button type={"submit"} size={"sm"} colorScheme={"primary"}>Zoeken</Button>
                    </InputRightElement>
                </InputGroup>
                <ZoektermenList zoektermen={zoektermen} onClickDelete={(zoekterm: string) => onDeleteZoekterm(zoekterm)} />
            </form>
        </Stack>
	);
};

export default BookingSectionAfspraakFilters;
