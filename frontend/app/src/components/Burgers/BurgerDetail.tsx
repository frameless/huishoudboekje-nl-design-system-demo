import {
	Accordion,
	AccordionHeader,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	Divider,
	FormLabel,
	Heading,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Spinner,
	Stack,
	Switch,
	Text,
	useToast,
} from "@chakra-ui/core";
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import BackButton from "../BackButton";
import {useMutation, useQuery} from "@apollo/client";
import {IAfspraak, IGebruiker} from "../../models";
import {GetOneGebruikerQuery} from "../../services/graphql/queries";
import {FormLeft, FormRight, Label} from "../Forms/FormLeftRight";
import RekeningList from "../Rekeningen/RekeningList";
import {DeleteGebruikerMutation,} from "../../services/graphql/mutations";
import {useIsMobile, useToggle} from "react-grapple";
import DeadEndPage from "../DeadEndPage";
import RekeningForm from "../Rekeningen/RekeningForm";

const BurgerDetail = () => {
	const {t} = useTranslation();
	const {id} = useParams();
	const {push} = useHistory();
	const toast = useToast();
	const isMobile = useIsMobile();

	const [showInactive, setShowInactive] = useState(false)
	const [afspraken, setAfspraken] = useState<IAfspraak[] | undefined>(undefined)

	const cancelDeleteRef = useRef(null);
	const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false);
	const [isDeleted, toggleDeleted] = useToggle(false);
	const [showCreateRekeningForm, toggleCreateRekeningForm] = useToggle(false);

	const [deleteMutation, {loading: deleteLoading}] = useMutation(DeleteGebruikerMutation, {variables: {id}});

	const onCloseDeleteDialog = () => toggleDeleteDialog(false);
	const onConfirmDeleteDialog = () => {
		deleteMutation().then(() => {
			onCloseDeleteDialog();
			toast({
				title: t("messages.burgers.deleteConfirmMessage", {name: `${data?.gebruiker.voornamen} ${data?.gebruiker.achternaam}`}),
				position: "top",
				status: "success",
			});
			toggleDeleted(true);
		})
	};

	const {data, loading, error} = useQuery<{ gebruiker: IGebruiker }>(GetOneGebruikerQuery, {
		variables: {id},
	});

	useEffect(() => {
		if (data) {
			setAfspraken(
				data.gebruiker.afspraken
					.filter(afspraak => {
						if (!showInactive) {
							return afspraak.actief
						}
						return true
					}))
		}
	}, [data, showInactive])

	const onClickEditButton = () => push(Routes.EditBurger(id));
	const onClickAddAfspraakButton = () => push(Routes.CreateBurgerAgreement(id));
	const onClickShowInactive = (e: React.FormEvent<HTMLInputElement>) => setShowInactive(e.currentTarget.checked);

	const renderPageContent = () => {
		if (loading) {
			return (
				<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
					<Spinner />
				</Stack>
			);
		}

		if (error) {
			return (
				<Redirect to={Routes.NotFound} />
			)
		}

		if (data) {
			if (isDeleted) {
				return (
					<DeadEndPage message={t("messages.burgers.deleteConfirmMessage", {name: `${data.gebruiker.voornamen} ${data.gebruiker.achternaam}`})}>
						<Button variantColor={"primary"} onClick={() => push(Routes.Burgers)}>{t("actions.backToList")}</Button>
					</DeadEndPage>
				)
			}

			return (
				<Stack spacing={5}>
					<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
						<Heading size={"lg"}>{data.gebruiker.voornamen} {data.gebruiker.achternaam}</Heading>

						<AlertDialog isOpen={deleteDialogOpen} leastDestructiveRef={cancelDeleteRef} onClose={onCloseDeleteDialog}>
							<AlertDialogOverlay />
							<AlertDialogContent>
								<AlertDialogHeader fontSize="lg" fontWeight="bold">{t("messages.burgers.deleteTitle")}</AlertDialogHeader>
								<AlertDialogBody>{t("messages.burgers.deleteQuestion", {name: `${data.gebruiker.voornamen} ${data.gebruiker.achternaam}`})}</AlertDialogBody>
								<AlertDialogFooter>
									<Button ref={cancelDeleteRef} onClick={onCloseDeleteDialog}>{t("actions.cancel")}</Button>
									<Button isLoading={deleteLoading} variantColor="red" onClick={onConfirmDeleteDialog} ml={3}>{t("actions.delete")}</Button>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>

						<Menu>
							<IconButton as={MenuButton} icon="chevron-down" variant={"solid"} aria-label="Open menu" />
							<MenuList>
								<MenuItem onClick={onClickEditButton}>{t("actions.edit")}</MenuItem>
								<MenuItem onClick={() => toggleDeleteDialog(true)}>{t("actions.delete")}</MenuItem>
							</MenuList>
						</Menu>
					</Stack>

					<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
						<Stack spacing={2} direction={isMobile ? "column" : "row"}>
							<FormLeft>
								<Heading display={"box"} size={"md"}>{t("forms.burgers.sections.personal.title")}</Heading>
								<Label>{t("forms.burgers.sections.personal.detailText")}</Label>
							</FormLeft>
							<FormRight>
								<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
									<Stack direction={isMobile ? "column" : "row"} spacing={1} flex={1}>
										<Stack spacing={1} flex={1}>
											<Label>{t("forms.burgers.fields.initials")}</Label>
											<Text>{data.gebruiker.voorletters}</Text>
										</Stack>
										<Stack spacing={1} flex={1}>
											<Label>{t("forms.burgers.fields.firstName")}</Label>
											<Text>{data.gebruiker.voornamen}</Text>
										</Stack>
									</Stack>
									<Stack spacing={1} flex={1}>
										<Label>{t("forms.burgers.fields.lastName")}</Label>
										<Text>{data.gebruiker.achternaam}</Text>
									</Stack>
								</Stack>
								<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1}>
										<Label>{t("forms.burgers.fields.dateOfBirth")}</Label>
										<Text>{data.gebruiker.geboortedatum}</Text>
									</Stack>
								</Stack>

							</FormRight>
						</Stack>

						<Divider />

						<Stack spacing={2} direction={isMobile ? "column" : "row"}>
							<FormLeft>
								<Heading display={"box"} size={"md"}>{t("forms.burgers.sections.contact.title")}</Heading>
								<Label>{t("forms.burgers.sections.contact.detailText")}</Label>
							</FormLeft>
							<FormRight>
								<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={2}>
										<Label>{t("forms.burgers.fields.street")}</Label>
										<Text>{data.gebruiker.straatnaam}</Text>
									</Stack>
									<Stack spacing={1} flex={2}>
										<Label>{t("forms.burgers.fields.houseNumber")}</Label>
										<Text>{data.gebruiker.huisnummer}</Text>
									</Stack>
								</Stack>
								<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={2}>
										<Label>{t("forms.burgers.fields.zipcode")}</Label>
										<Text>{data.gebruiker.postcode}</Text>
									</Stack>
									<Stack spacing={1} flex={2}>
										<Label>{t("forms.burgers.fields.city")}</Label>
										<Text>{data.gebruiker.plaatsnaam}</Text>
									</Stack>
								</Stack>
								<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={2}>
										<Label>{t("forms.burgers.fields.phoneNumber")}</Label>
										<Text>{data.gebruiker.telefoonnummer}</Text>
									</Stack>
									<Stack spacing={1} flex={2}>
										<Label>{t("forms.burgers.fields.mail")}</Label>
										<Text>{data.gebruiker.email}</Text>
									</Stack>
								</Stack>
							</FormRight>
						</Stack>
					</Stack>

					<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
						<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
							<FormLeft>
								<Heading display={"box"} size={"md"}>{t("forms.burgers.sections.rekeningen.title")}</Heading>
								<Label>{t("forms.burgers.sections.rekeningen.detailText")}</Label>
							</FormLeft>
							<FormRight justifyContent={"center"}>
								<RekeningList rekeningen={data.gebruiker.rekeningen} gebruiker={data.gebruiker} />
								{showCreateRekeningForm ? (<>
									<Divider />
									<RekeningForm rekening={{
										rekeninghouder: `${data.gebruiker.voorletters} ${data.gebruiker.achternaam}`
									}} onSave={() => {
										// Todo: createGebruikerRekeningMutation
									}} onCancel={() => {
										toggleCreateRekeningForm(false)
									}} />
								</>) : (
									<Box>
										<Button leftIcon={"add"} variantColor={"primary"} size={"sm"} onClick={() => toggleCreateRekeningForm(true)}>{t("actions.add")}</Button>
									</Box>
								)}
							</FormRight>
						</Stack>
					</Stack>

					<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
						{data.gebruiker.afspraken.length === 0 ? (
							<DeadEndPage message={t("messages.agreements.addHint", {buttonLabel: t("actions.add")})} illustration={false}>
								<Button onClick={() => push(Routes.CreateBurgerAgreement(id))} size={"sm"} variantColor={"primary"} variant={"solid"}
								        leftIcon={"add"}>{t("actions.add")}</Button>
							</DeadEndPage>
						) : (<>
							<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>

								<FormLeft />
								<FormRight>
									<Stack direction={"row"} spacing={5} justifyContent={"flex-end"}>
										<Stack isInline={true} alignItems={"center"} spacing={1}>
											<FormLabel htmlFor="show-inactive-agreements">{t("buttons.agreements.showInactive")}</FormLabel>
											<Switch id="show-inactive-agreements" onChange={onClickShowInactive} />
										</Stack>
										<Button variantColor={"primary"} onClick={onClickAddAfspraakButton}>{t("actions.add")}</Button>
									</Stack>
								</FormRight>
							</Stack>

							<Divider />

							<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
								<FormLeft>
									<Heading display={"box"}
										         size={"md"}>{t("forms.burgers.sections.agreements.title")}</Heading>
									<Label>{t("forms.burgers.sections.agreements.detailText")}</Label>
								</FormLeft>
								<FormRight>

									{afspraken?.length === 0 ?
										(
											<DeadEndPage message={t("messages.agreements.noSearchResults", {buttonLabel: t("actions.add")})} />
										)
										:
										<Accordion allowMultiple>
											{afspraken?.map((afspraak, i) =>
												<AccordionItem key={i}>
													<AccordionHeader>
														<Text>{afspraak.beschrijving} - {afspraak.organisatie.weergaveNaam}</Text>
														<AccordionIcon />
													</AccordionHeader>
													<AccordionPanel>
														<Stack flex={2} flexGrow={1}>
															<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
																<Stack spacing={1} flex={2}>
																	<Label>{t("forms.agreements.fields.description")}</Label>
																	<Text>{afspraak.beschrijving}</Text>
																</Stack>
																<Stack spacing={1} flex={1}>
																	<Label>{t("forms.agreements.fields.startDate")}</Label>
																	<Text>{afspraak.startDatum}</Text>
																</Stack>
																<Stack spacing={1} flex={1}>
																	<Label>{t("forms.agreements.fields.endDate")}</Label>
																	<Text>{afspraak.eindDatum}</Text>
																</Stack>
															</Stack>
															<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
																<Stack spacing={1} flex={1}>
																	<Label>{t("forms.agreements.fields.amount")}</Label>
																	<Text>€{afspraak.bedrag} {t(`forms.agreements.fields.${afspraak.credit ? "credit" : "debit"}`)}</Text>
																</Stack>
																<Stack spacing={1} flex={1}>
																	<Label>{t("forms.agreements.fields.noOfPayments")}</Label>
																	<Text>{afspraak.aantalBetalingen}</Text>
																</Stack>
																{/*
														<Stack spacing={1} flex={1}>
															<Label>{t("forms.agreements.fields.interval")}</Label>
															<Text>{afspraak.interval}</Text>
														</Stack>
														*/}
															</Stack>
															<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
																<Stack spacing={1} flex={1}>
																	<Label>{t("forms.agreements.fields.contraAccount")}</Label>
																	<Text>{afspraak.tegenRekening.iban} {afspraak.tegenRekening.rekeninghouder}</Text>
																</Stack>
																<Stack spacing={1} flex={1}>
																	<Label>{t("forms.agreements.fields.reference")}</Label>
																	<Text>{afspraak.kenmerk}</Text>
																</Stack>
															</Stack>
														</Stack>

													</AccordionPanel>
												</AccordionItem>,
											)}
										</Accordion>
									}
								</FormRight>
							</Stack>
						</>
						)}
					</Stack>

				</Stack>
			);
		}
	}

	return (<>
		<BackButton to={Routes.Burgers} />

		{renderPageContent()}
	</>);
};

export default BurgerDetail;