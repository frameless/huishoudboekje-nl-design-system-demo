import {FormControl, HStack, Stack, Tab, Table, TabList, TabPanel, TabPanels, Tabs, Tbody, Text, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afspraak, GetTransactieDocument, Rubriek, useCreateJournaalpostAfspraakMutation, useCreateJournaalpostGrootboekrekeningMutation} from "../../../generated/graphql";
import {useReactSelectStyles} from "../../../utils/things";
import useToaster from "../../../utils/useToaster";
import SelectAfspraakOption from "../../shared/SelectAfspraakOption";

const BookingSection = ({transaction, rubrieken, afspraken}) => {
	const reactSelectStyles = useReactSelectStyles();
	const toast = useToaster();
	const {t} = useTranslation();
	const suggesties: Afspraak[] = transaction.suggesties || [];

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

	const options = {
		suggesties: suggesties,
		afspraken: afspraken.filter(a => {
			// Skip afspraken that are suggesties
			if (suggesties.find(b => b.id === a.id)) {
				return false;
			}
			return true;
		}),
		rubrieken: rubrieken.filter(r => r.grootboekrekening && r.grootboekrekening.id).sort((a: Rubriek, b: Rubriek) => {
			return a.naam && b.naam && a.naam < b.naam ? -1 : 1;
		}).map((r: Rubriek) => ({
			key: r.id,
			label: r.naam,
			value: r.grootboekrekening!.id,
		})),
	};

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
										{options.suggesties.map(a => (
											<SelectAfspraakOption key={a.id} afspraak={a} isSuggestion={options.suggesties.length === 1} onClick={() => onSelectAfspraak(a)} />
										))}
										{options.afspraken.map(a => (
											<SelectAfspraakOption key={a.id} afspraak={a} onClick={() => onSelectAfspraak(a)} />
										))}
									</Tbody>
								</Table>
							)}
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
