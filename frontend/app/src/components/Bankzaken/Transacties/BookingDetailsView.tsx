import {DeleteIcon, ViewIcon} from "@chakra-ui/icons";
import {Box, Button, FormLabel, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {BankTransaction, GetTransactieDocument, useDeleteJournaalpostMutation, GetSaldoDocument, useUpdateSaldoMutation, Burger} from "../../../generated/graphql";
import {MathOperation, currencyFormat2, floatMathOperation, formatBurgerName, getBurgerHhbId} from "../../../utils/things";
import useToaster from "../../../utils/useToaster";
import {useLazyQuery} from "@apollo/client";
import d from "../../../utils/dayjs";

type BookingDetailsViewProps = {
	transactie: BankTransaction
};

const BookingDetailsView: React.FC<BookingDetailsViewProps> = ({transactie}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [deleteJournaalpost, $deleteJournaalpost] = useDeleteJournaalpostMutation({
		refetchQueries: [
			{query: GetTransactieDocument, variables: {id: transactie.id}},
		],
	});

	const [updateSaldo] = useUpdateSaldoMutation()
	const [getSaldo, {loading, data}] = useLazyQuery(GetSaldoDocument, {
		fetchPolicy: "no-cache"
	})
	const journaalpostAfspraak = transactie.journaalpost?.afspraak;
	const journaalpostRubriek = transactie.journaalpost?.grootboekrekening?.rubriek;

	const onDelete = () => {
		const id = transactie.journaalpost?.id;
		const burgerId = transactie?.journaalpost?.afspraak?.burger?.id

		if (id) {
			deleteJournaalpost({
				variables: {id},
			}).then(() => {

				toast({success: t("messages.journals.deleteSuccessMessage")});
			}).catch(err => {
				console.error(err);
				toast({error: err.message});
			});
			if (burgerId) {
				getSaldo({
					variables: {
						burger_ids: [burgerId],
						date: d(transactie.transactieDatum).format("YYYY-MM-DD")
					}
				}).then(
					(result) => {
						if (result.data.saldo.length > 0) {
							const saldo = floatMathOperation(result.data.saldo[0]?.saldo, transactie.bedrag, 2, MathOperation.Minus)
							updateSaldo({
								variables: {
									input: {
										id: result.data.saldo[0]?.id,
										saldo: saldo
									}
								}
							})
						}
					}
				)
			}
		}
	};

	/* Booked by Afspraak */
	if (journaalpostAfspraak) {
		return (
			<Stack spacing={5} justify={"space-between"} mb={3}>
				<Stack direction={"row"} spacing={5}>
					<Box flex={1}>
						<FormLabel>{t("burger")}</FormLabel>
						<Box>
							<Text>{formatBurgerName(journaalpostAfspraak.burger) + " " + getBurgerHhbId(journaalpostAfspraak.burger as Burger)}</Text>
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
						<Box color={journaalpostAfspraak.bedrag < 0 ? "red.500" : undefined}>
							<Text>{currencyFormat2().format(journaalpostAfspraak.bedrag * (journaalpostAfspraak.credit ? 1 : -1))}</Text>
						</Box>
					</Box>
				</Stack>
				<Stack direction={"row"} spacing={5}>
					<Box mb={3}>
						<Button leftIcon={
							<ViewIcon />} colorScheme={"primary"} size={"sm"} as={NavLink} to={AppRoutes.ViewAfspraak(String(journaalpostAfspraak.id))}>{t("global.actions.view")}</Button>
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
