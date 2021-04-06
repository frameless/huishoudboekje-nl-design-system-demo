import {CheckIcon, DeleteIcon} from "@chakra-ui/icons";
import {Box, Button, Heading, HStack, IconButton, Stack, Tag, TagLabel, TagLeftIcon, Text} from "@chakra-ui/react";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction, useDeleteJournaalpostMutation} from "../../../../generated/graphql";
import {formatBurgerName, intervalString} from "../../../../utils/things";
import useFakeMutation from "../../../../utils/useFakeMutation";
import useToaster from "../../../../utils/useToaster";
import Label from "../../../Layouts/Label";
import {TransactionsContext} from "../context";

const BookingDetailsView: React.FC<{transactie: BankTransaction}> = ({transactie}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const {refetch} = useContext(TransactionsContext);
	const [deleteJournaalpost, $deleteJournaalpost] = useDeleteJournaalpostMutation();
	const toggleAutomatischBoeken = useFakeMutation();

	const journaalpostAfspraak = transactie.journaalpost?.afspraak;
	const journaalpostRubriek = transactie.journaalpost?.grootboekrekening?.rubriek;

	const onDelete = () => {
		const id = transactie.journaalpost?.id;

		if (id) {
			deleteJournaalpost({
				variables: {id},
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
	const onConfirmAutomatischBoeken = () => {
		if (!journaalpostAfspraak || !journaalpostAfspraak.id) {
			return;
		}

		toggleAutomatischBoeken({
			variables: {
				afspraakId: journaalpostAfspraak.id,
				automatischBoeken: true,
			},
		}).then(() => {
			toast({
				success: t("messages.toggleAfspraakAutomatischBoekenSuccess"),
			});
			refetch();
		}).catch(err => {
			toast({error: err.message});
		});
	};

	/* We can enable automatisch boeken if:
	* - this transactie has only one suggestie
	* - the the id of the journaalpostAfspraak matches the id of the suggestie
	*  */
	const canEnableAutomatischBoeken = transactie.suggesties?.length === 1 && (journaalpostAfspraak?.id === transactie.suggesties?.[0].id);
	const automatischBoekenEnabled = journaalpostAfspraak?.automatischBoeken;

	/* Booked by Afspraak */
	if (journaalpostAfspraak) {
		return (
			<Stack spacing={5} justifyContent={"space-between"} mb={3}>
				<HStack justify={"space-between"}>
					<Heading size={"sm"}>{t("booking")}</Heading>
					<HStack>
						{automatischBoekenEnabled ? (
							<Tag colorScheme={"green"}>
								<TagLeftIcon as={CheckIcon} />
								<TagLabel>{t("automatischBoekenConfirmed")}</TagLabel>
							</Tag>
						) : (canEnableAutomatischBoeken && (
							<Button size={"sm"} leftIcon={
								<CheckIcon />} colorScheme={"green"} variant={"ghost"} onClick={onConfirmAutomatischBoeken}>
								{t("actions.confirmAutomatischBoeken")}
							</Button>
						))}
						<Button size={"sm"} leftIcon={<DeleteIcon />} colorScheme={"red"} variant={"ghost"} onClick={onDelete} isLoading={$deleteJournaalpost.loading}>
							{t("actions.delete")}
						</Button>
					</HStack>
				</HStack>
				<Stack direction={"row"} spacing={5}>
					<Box flex={1}>
						<Label>{t("burger")}</Label>
						<Box>
							<Text>{formatBurgerName(journaalpostAfspraak.burger)}</Text>
						</Box>
					</Box>
					<Box flex={1}>
						<Label>{t("omschrijving")}</Label>
						<Box>
							<Text>{journaalpostAfspraak.omschrijving}</Text>
						</Box>
					</Box>
				</Stack>
				<Stack direction={"row"} spacing={5}>
					<Box flex={1}>
						<Label>{t("periodiek")}</Label>
						<Box>
							<Text>{intervalString(journaalpostAfspraak.interval, t)}</Text>
						</Box>
					</Box>
					{transactie.journaalpost?.grootboekrekening?.rubriek?.naam && (
						<Box flex={1}>
							<Label>{t("rubriek")}</Label>
							<Box>
								<Text>{transactie.journaalpost?.grootboekrekening?.rubriek?.naam}</Text>
							</Box>
						</Box>
					)}
				</Stack>
			</Stack>
		);
	}
	/* Booked by Rubriek */
	else if (journaalpostRubriek) {
		// Todo: check if this section looks good. Backend didn't work when this was built. (03-03-2021)
		return (
			<Stack direction={"row"} spacing={5} mb={3}>
				<Box flex={1}>
					<Label>{t("rubriek")}</Label>
					<Box>
						<Text>{journaalpostRubriek.naam}</Text>
						{journaalpostRubriek.grootboekrekening && <Text fontSize={"sm"}>{journaalpostRubriek.grootboekrekening.omschrijving}</Text>}
					</Box>
				</Box>
				<Box>
					<IconButton icon={<DeleteIcon />} variant={"ghost"} aria-label={t("actions.disconnect")}
						onClick={onDelete} isLoading={$deleteJournaalpost.loading} />
				</Box>
			</Stack>
		);
	}

	/* Don't show anything if there is no journaalpost */
	return null;
};

export default BookingDetailsView;