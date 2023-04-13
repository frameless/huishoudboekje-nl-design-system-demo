import {Box, Button, FormControl, HStack, Stack, Tab, Table, TabList, TabPanel, TabPanels, Tabs, Tbody, Text, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afspraak, BankTransaction, GetTransactieDocument, Rubriek, useCreateJournaalpostAfspraakMutation, useCreateJournaalpostGrootboekrekeningMutation, useGetAfsprakenLazyQuery, useGetSimilarAfsprakenLazyQuery} from "../../../generated/graphql";
import {useReactSelectStyles} from "../../../utils/things";
import useToaster from "../../../utils/useToaster";
import SelectAfspraakOption from "../../shared/SelectAfspraakOption";
import {TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

export function isSuggestie(suggestie: Afspraak, transaction: BankTransaction): boolean{
	//Only check on zoektermen because the backend checks on iban (on organisation level)
	if( suggestie.zoektermen?.every(zoekterm => transaction.informationToAccountOwner?.includes(zoekterm))){
		return true
	}
	return false
}

const BookingSection = ({transaction, rubrieken}) => {
	const reactSelectStyles = useReactSelectStyles();
	const toast = useToaster();
	const {t} = useTranslation();
	const suggesties: Afspraak[] = transaction.suggesties || [];
	const ids = suggesties ? suggesties.map( suggestie => suggestie.id ? suggestie.id : -1).filter(id => id != -1) : []
	const [showExtraAfspraken, setShowExtraAfspraken] = React.useState(false);

	const [getSimilarAfspraken, { loading, error, data }] = useGetSimilarAfsprakenLazyQuery({
			variables: {
				ids: ids
			},
	});

	const options: {
		suggesties: Afspraak[]
		afspraken: Afspraak[]
		rubrieken: any
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
		if (data == undefined && ids.length > 0){
			getSimilarAfspraken()
		}		
	}

	if(data != undefined && showExtraAfspraken){
		data.afspraken?.forEach(afspraak => {
			
			const similar: Afspraak[] = afspraak.similarAfspraken ? afspraak.similarAfspraken : []
			similarAfspraken.push(...similar)
		})
		const num = transaction.bedrag
		similarAfspraken = Array.from(new Set(similarAfspraken.filter(similarAfspraak => !suggesties.find(suggestie => suggestie.id === similarAfspraak.id))
										.sort((a, b) => Math.abs(a.bedrag - num) - Math.abs(b.bedrag - num))));
		options.afspraken = similarAfspraken
	}
	if(data === undefined || !showExtraAfspraken){
		options.afspraken = []
	}

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
		}
	};

	return (
		<Stack>
			<Tabs align={"end"}>
				<HStack justify={"space-between"} align={"bottom"}>
					<TabList>
						<Tab>Afspraak</Tab>
						<Tab>Rubriek</Tab>
					</TabList>
				</HStack>
				<TabPanels>
					<TabPanel px={0}>
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
									{!loading && showExtraAfspraken && similarAfspraken.length === 0 ? t("bookingSection.noSimilarAfspraken") : ""}
								</Text>
								<Button isLoading={loading} leftIcon={showExtraAfspraken ? <TriangleUpIcon /> : <TriangleDownIcon />} colorScheme={"primary"} size={"sm"} onClick={toggleShowExtraAfspraken} > 
								{t("bookingSection.similarAfspraken")}
								</Button>
							</Box>
						</Stack>
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
