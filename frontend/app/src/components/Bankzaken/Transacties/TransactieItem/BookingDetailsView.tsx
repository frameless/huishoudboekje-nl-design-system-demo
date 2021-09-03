import {DeleteIcon, ViewIcon} from "@chakra-ui/icons";
import {Box, Button, FormLabel, Heading, Stack, Text} from "@chakra-ui/react";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Routes from "../../../../config/routes";
import {BankTransaction, GetTransactiesDocument, useDeleteJournaalpostMutation} from "../../../../generated/graphql";
import {currencyFormat2, formatBurgerName} from "../../../../utils/things";
import useToaster from "../../../../utils/useToaster";
import {TransactionsContext} from "../context";

const BookingDetailsView: React.FC<{transactie: BankTransaction}> = ({transactie}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const {queryVariables} = useContext(TransactionsContext);
	const [deleteJournaalpost, $deleteJournaalpost] = useDeleteJournaalpostMutation({
		refetchQueries: [
			{query: GetTransactiesDocument, variables: queryVariables},
		],
	});

	const journaalpostAfspraak = transactie.journaalpost?.afspraak;
	const journaalpostRubriek = transactie.journaalpost?.grootboekrekening?.rubriek;

	const onDelete = () => {
		const id = transactie.journaalpost?.id;

		if (id) {
			deleteJournaalpost({
				variables: {id},
			}).then(() => {
				toast({success: t("messages.journals.createSuccessMessage")});
			}).catch(err => {
				console.error(err);
				toast({error: err.message});
			});
		}
	};

	/* Booked by Afspraak */
	if (journaalpostAfspraak) {
		return (
			<Stack spacing={5} justify={"space-between"} mb={3}>
				<Stack justify={"flex-start"}>
					<Heading size={"sm"}>{t("words.afspraak")}</Heading>
				</Stack>

				<Stack direction={"row"} spacing={5}>
					<Box flex={1}>
						<FormLabel>{t("burger")}</FormLabel>
						<Box>
							<Text>{formatBurgerName(journaalpostAfspraak.burger)}</Text>
						</Box>
					</Box>
					<Box flex={1}>
						<FormLabel>{t("omschrijving")}</FormLabel>
						<Box>
							<Text>{journaalpostAfspraak.omschrijving}</Text>
						</Box>
					</Box>
				</Stack>
				<Stack direction={"row"} spacing={5}>
					{transactie.journaalpost?.grootboekrekening?.rubriek?.naam && (
						<Box flex={1}>
							<FormLabel>{t("rubriek")}</FormLabel>
							<Box>
								<Text>{transactie.journaalpost?.grootboekrekening?.rubriek?.naam}</Text>
							</Box>
						</Box>
					)}
					<Box flex={1}>
						<FormLabel>{t("bedrag")}</FormLabel>
						<Box color={journaalpostAfspraak.bedrag < 0 ? "red.500" : undefined}>{currencyFormat2().format(journaalpostAfspraak.bedrag)}</Box>
					</Box>
				</Stack>
				<Stack direction={"row"} spacing={5}>
					<Box mb={3}>
						<Button leftIcon={
							<ViewIcon />} colorScheme={"primary"} size={"sm"} as={NavLink} to={Routes.ViewAfspraak(journaalpostAfspraak.id)}>{t("global.actions.view")}</Button>
					</Box>
					<Box>
						<Button leftIcon={
							<DeleteIcon />} variant={"ghost"} colorScheme={"red"} size={"sm"} onClick={onDelete} isLoading={$deleteJournaalpost.loading}>{t("global.actions.undoAfletteren")}</Button>
					</Box>
				</Stack>
			</Stack>
		);
	}
	/* Booked by Rubriek */
	else if (journaalpostRubriek) {
		return (
			<Stack direction={"row"} spacing={5} mb={3}>
				<Box flex={1}>
					<FormLabel>{t("rubriek")}</FormLabel>
					<Box>
						<Text>{journaalpostRubriek.naam}</Text>
						{journaalpostRubriek.grootboekrekening && <Text fontSize={"sm"}>{journaalpostRubriek.grootboekrekening.omschrijving}</Text>}
					</Box>
				</Box>
				<Box>
					<Button leftIcon={
						<DeleteIcon />} variant={"ghost"} colorScheme={"red"} size={"sm"} onClick={onDelete} isLoading={$deleteJournaalpost.loading}>{t("global.actions.undoAfletteren")}</Button>
				</Box>
			</Stack>
		);
	}

	/* Don't show anything if there is no journaalpost */
	return null;
};

export default BookingDetailsView;