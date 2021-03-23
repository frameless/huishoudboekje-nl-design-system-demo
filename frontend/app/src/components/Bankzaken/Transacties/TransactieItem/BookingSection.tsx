import {Heading, HStack, Stack, Tab, Table, TabList, Text, TabPanel, TabPanels, Tabs, Tbody, Th, Thead, Tr, useToast, Box, VStack} from "@chakra-ui/react";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afspraak, Rubriek, useCreateJournaalpostAfspraakMutation, useCreateJournaalpostGrootboekrekeningMutation} from "../../../../generated/graphql";
import SelectAfspraakOption from "../../../Layouts/SelectAfspraak/SelectAfspraakOption";
import {TransactionsContext} from "../context";

const BookingSection = ({transaction, rubrieken, afspraken}) => {
	const toast = useToast();
	const {t} = useTranslation();
	const suggesties: Afspraak[] = transaction.suggesties || [];
	const {refetch} = useContext(TransactionsContext);

	const [createJournaalpostAfspraak] = useCreateJournaalpostAfspraakMutation();
	const [createJournaalpostGrootboekrekening] = useCreateJournaalpostGrootboekrekeningMutation();

	const options = {
		suggesties: suggesties,
		afspraken: afspraken.filter(a => {
			// Skip afspraken that are suggesties
			if (suggesties.find(b => b.id === a.id)) {
				return false;
			}

			const tegenRekening = transaction.tegenRekening?.iban || transaction.tegenRekeningIban;

			// Show all afspraken if there is no tegenRekening
			if (!tegenRekening) {
				return true;
			}

			return a.tegenRekening?.iban?.replaceAll(" ", "") === tegenRekening.replaceAll(" ", "");
		}),
		rubrieken: rubrieken.filter(r => r.grootboekrekening && r.grootboekrekening.id).map((r: Rubriek) => ({
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
				toast({
					status: "success",
					title: t("messages.journals.createSuccessMessage"),
					position: "top",
					isClosable: true,
				});
				refetch();
			}).catch(err => {
				console.error(err);
				toast({
					position: "top",
					status: "error",
					variant: "solid",
					title: t("messages.genericError.title"),
					description: t("messages.genericError.description"),
					isClosable: true,
				});
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
				toast({
					status: "success",
					title: t("messages.journals.createSuccessMessage"),
					position: "top",
					isClosable: true,
				});
				refetch();
			}).catch(err => {
				console.error(err);
				toast({
					position: "top",
					status: "error",
					variant: "solid",
					title: t("messages.genericError.title"),
					description: t("messages.genericError.description"),
					isClosable: true,
				});
			});
		}
	};

	return (
		<Stack>
			<Tabs align={"end"}>
				<HStack justify={"space-between"} align={"bottom"}>
					<Stack spacing={0} alignItems={"flex-start"}>
						<Heading size={"sm"}>{t("transactieVerwerken.title")}</Heading>
						<Text size={"xs"}>{t("transactieVerwerken.helperText")}</Text>
					</Stack>

					<TabList>
						<Tab>Afspraak</Tab>
						<Tab>Rubriek</Tab>
					</TabList>
				</HStack>
				<TabPanels>
					<TabPanel px={0}>
						<Stack spacing={2}>
							<Table size={"sm"}>
								<Thead>
									<Tr>
										<Th>{t("burger")}</Th>
										<Th>{t("afspraak.omschrijving")}</Th>
										<Th>{t("afspraak.zoekterm")}</Th>
										<Th />
										<Th>{t("bedrag")}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{options.suggesties.map(a => (
										<SelectAfspraakOption key={a.id} afspraak={a} isSuggestion={options.suggesties.length === 1} onClick={() => {
											// Todo: accept suggestion
											onSelectAfspraak(a);
										}} />
									))}
									{options.afspraken.map(a => (
										<SelectAfspraakOption key={a.id} afspraak={a} onClick={() => onSelectAfspraak(a)} />
									))}
								</Tbody>
							</Table>
						</Stack>
					</TabPanel>
					<TabPanel px={0}>
						<Select onChange={onSelectRubriek} options={options.rubrieken} isClearable={true} noOptionsMessage={() => t("select.noOptions")}
							maxMenuHeight={200} />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Stack>
	);
};

export default BookingSection;