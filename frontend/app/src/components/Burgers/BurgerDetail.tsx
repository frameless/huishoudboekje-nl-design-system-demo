import {
	Accordion,
	AccordionHeader,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	BoxProps,
	Button,
	Divider,
	FormLabel,
	Heading,
	Spinner,
	Stack,
	Switch,
	Text,
} from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { useIsMobile } from "react-grapple";
import { useTranslation } from "react-i18next";
import { Redirect, useHistory, useParams } from "react-router-dom";
import Routes, { Subpage } from "../../config/routes";
import BackButton from "../BackButton";
import { useQuery } from "@apollo/client";
import { IAfspraak, IGebruiker } from "../../models";
import { GetOneGebruikerQuery } from "../../services/graphql/queries";
import theme from "../../config/theme";
import { FormLeft, FormRight } from "../Forms/FormLeftRight";
import { NoAfsprakenFound } from "./NoAfsprakenFound";

const Label: React.FunctionComponent = ({ children }) =>
	<Text fontSize={"sm"} color={theme.colors.gray["500"]}>{children}</Text>;

const Group: React.FC<BoxProps> = ({children, ...props}) => {
	const isMobile = useIsMobile();
	return (
		<Stack spacing={2} direction={isMobile ? "column" : "row"}>{children}</Stack>
	);
};

const BurgerDetail = () => {
	const { t } = useTranslation();
	const { id } = useParams();
	const { push } = useHistory();

	const { data, loading, error } = useQuery<{ gebruiker: IGebruiker }>(GetOneGebruikerQuery, {
		variables: { id },
	});

	const [deleteMutation, {loading: deleteLoading}] = useMutation(DeleteGebruikerMutation, {variables: {id}});
	const [updateMutation, {loading: updateLoading}] = useMutation(UpdateGebruikerMutation);

	useEffect(() => {
		let mounted = true;

		if (mounted && data) {
			const {gebruiker} = data;

			if (gebruiker) {
				// bsn.setValue(gebruiker.bsn.toString() || "");
				initials.setValue(gebruiker.voorletters || "");
				firstName.setValue(gebruiker.voornamen || "");
				lastName.setValue(gebruiker.achternaam || "");
				dateOfBirth.day.setValue(new Date(gebruiker.geboortedatum).getDate());
				dateOfBirth.month.setValue(new Date(gebruiker.geboortedatum).getMonth() + 1);
				dateOfBirth.year.setValue(new Date(gebruiker.geboortedatum).getFullYear());
				mail.setValue(gebruiker.email || "");
				street.setValue(gebruiker.straatnaam || "");
				houseNumber.setValue(gebruiker.huisnummer || "");
				zipcode.setValue(gebruiker.postcode || "");
				city.setValue(gebruiker.plaatsnaam || "");
				phoneNumber.setValue(gebruiker.telefoonnummer || "");
				// iban.setValue(gebruiker.iban || "");
				// bankAccountHolder.setValue(gebruiker.rekeninghouder || "");
			}
		}

		return () => {
			mounted = false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, loading]);

	const onClickBackButton = () => push(Routes.Burgers);
	const onSubmit = (e) => {
		e.preventDefault();

		const isFormValid = [
			initials,
			firstName,
			lastName,
			dateOfBirth.day,
			dateOfBirth.month,
			dateOfBirth.year,
			street,
			houseNumber,
			zipcode,
			city,
			phoneNumber,
			mail,
		].every(f => f.isValid);
		if (!isFormValid) {
			toast({
				status: "error",
				title: t("messages.burgers.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		updateMutation({
			variables: {
				id,
				voorletters: initials.value,
				voornamen: firstName.value,
				achternaam: lastName.value,
				geboortedatum: [
					dateOfBirth.year.value,
					("0" + dateOfBirth.month.value).substr(-2, 2),
					("0" + dateOfBirth.day.value).substr(-2, 2),
				].join("-"),
				straatnaam: street.value,
				huisnummer: houseNumber.value,
				postcode: zipcode.value,
				plaatsnaam: city.value,
				telefoonnummer: phoneNumber.value,
				email: mail.value,
			}
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.burgers.updateSuccessMessage"),
				position: "top",
			});
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				description: t("messages.genericError.description"),
				title: t("messages.genericError.title")
			});
		})
	};
	const onCloseDeleteDialog = () => toggleDeleteDialog(false);
	const onConfirmDeleteDialog = () => {
		deleteMutation().then(() => {
			onCloseDeleteDialog();
			toast({
				title: t("messages.burgers.deleteConfirmMessage", { name: `${data?.gebruiker.voornamen} ${data?.gebruiker.achternaam}`}),
				position: "top",
				status: "success",
			});
			toggleDeleted(true);
		})
	};
	const [showInactive, setShowInactive] = useState(false)
	const [afspraken, setAfspraken] = useState<IAfspraak[] | undefined>( undefined)

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
	const onClickBackButton = () => push(Routes.Burgers);
	const onClickEditButton = () => push(Routes.Burger(id, Subpage.edit));
	const onClickAddAfspraakButton = () => push(Routes.AgreementNew(id));
	const onClickShowInactive = (e: React.FormEvent<HTMLInputElement>) => setShowInactive(e.currentTarget.checked);

	return (<>
		<BackButton to={Routes.Burgers} />

		<BackButton to={Routes.AgreementsNew} />

		{loading && (
			<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
				<Spinner />
			</Stack>
		)}
		{!loading && error && (
			<Redirect to={Routes.NotFound} />
		)}
		{!loading && !error && data && (
			<Stack spacing={5}>
				<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
					<Heading size={"lg"}>{data.gebruiker.voornamen} {data.gebruiker.achternaam}</Heading>
				</Stack>

				<Box>
					<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
						<Group>
							<FormLeft />
							<FormRight>
								<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
									<Button  variantColor={"primary"} onClick={onClickEditButton}>{t("actions.edit")}</Button>
								</Stack>
							</FormRight>
						</Group>

						<Divider />

						<Group>
							<FormLeft >
								<Heading display={"box"} size={"md"}>{t("forms.burgers.sections.personal.title")}</Heading>
								<Label>{t("forms.burgers.sections.personal.detailText")}</Label>
							</FormLeft>
							<FormRight>
								<Group>
									<Stack spacing={1} flex={1}>
										<Label>{t("forms.burgers.fields.initials")}</Label>
										<Text>{data.gebruiker.voorletters}</Text>
									</Stack>
									<Stack spacing={1} flex={3}>
										<Label>{t("forms.burgers.fields.firstName")}</Label>
										<Text>{data.gebruiker.voornamen}</Text>
									</Stack>
									<Stack spacing={1} flex={3}>
										<Label>{t("forms.burgers.fields.lastName")}</Label>
										<Text>{data.gebruiker.achternaam}</Text>
									</Stack>
								</Group>
								<Stack spacing={1}>
									<Label>{t("forms.burgers.fields.dateOfBirth")}</Label>
									<Text>{data.gebruiker.geboortedatum}</Text>
								</Stack>

							</FormRight>
						</Group>

						<Divider />

						<Group>
							<FormLeft>
								<Heading display={"box"}  size={"md"}>{t("forms.burgers.sections.contact.title")}</Heading>
								<Label>{t("forms.burgers.sections.contact.detailText")}</Label>
							</FormLeft>
							<FormRight>
								<Group>
									<Stack spacing={1} flex={2}>
										<Label>{t("forms.burgers.fields.street")}</Label>
										<Text>{data.gebruiker.straatnaam}</Text>
									</Stack>
									<Stack spacing={1} flex={2}>
										<Label>{t("forms.burgers.fields.houseNumber")}</Label>
										<Text>{data.gebruiker.huisnummer}</Text>
									</Stack>
								</Group>
								<Group>
									<Stack spacing={1} flex={2}>
										<Label>{t("forms.burgers.fields.zipcode")}</Label>
										<Text>{data.gebruiker.postcode}</Text>
									</Stack>
									<Stack spacing={1} flex={2}>
										<Label>{t("forms.burgers.fields.city")}</Label>
										<Text>{data.gebruiker.plaatsnaam}</Text>
									</Stack>
								</Group>
								<Group>
									<Stack spacing={1} flex={2}>
										<Label>{t("forms.burgers.fields.phoneNumber")}</Label>
										<Text>{data.gebruiker.telefoonnummer}</Text>
									</Stack>
									<Stack spacing={1} flex={2}>
										<Label>{t("forms.burgers.fields.mail")}</Label>
										<Text>{data.gebruiker.email}</Text>
									</Stack>
								</Group>
							</FormRight>
						</Group>
					</Stack>
				</Box>

				<Box>
					<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
						{data.gebruiker.afspraken.length === 0 ?
							<NoAfsprakenFound /> :
							<>
								<Group>

									<FormLeft />
									<FormRight>
										<Stack direction={"row"} spacing={5} justifyContent={"flex-end"}>
											<Stack isInline={true} alignItems={"center"} spacing={1}>
												<FormLabel htmlFor="show-inactive-agreements">{t("buttons.agreements.showInactive")}</FormLabel>
												<Switch id="show-inactive-agreements" onChange={onClickShowInactive}/>
											</Stack>
											<Button variantColor={"primary"}
												onClick={onClickAddAfspraakButton}>{t("actions.add")}</Button>
										</Stack>
									</FormRight>
								</Group>

								<Divider />

								<Group>
									<FormLeft>
										<Heading display={"box"}
											 size={"md"}>{t("forms.burgers.sections.agreements.title")}</Heading>
										<Label>{t("forms.burgers.sections.agreements.detailText")}</Label>
									</FormLeft>
									<FormRight>
										<Accordion allowMultiple>

											{afspraken ?
												afspraken.map((afspraak, i) =>
													<AccordionItem key={i}>
														<AccordionHeader>
															<Text>{afspraak.beschrijving} - {afspraak.organisatie.weergaveNaam}</Text>
															<AccordionIcon />
														</AccordionHeader>
														<AccordionPanel>
															<Stack flex={2} flexGrow={1}>
																<Group>
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
																</Group>
																<Group>
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
																</Group>
																<Group>
																	<Stack spacing={1} flex={1}>
																		<Label>{t("forms.agreements.fields.contraAccount")}</Label>
																		<Text>{afspraak.tegenRekening.iban} {afspraak.tegenRekening.rekeninghouder}</Text>
																	</Stack>
																	<Stack spacing={1} flex={1}>
																		<Label>{t("forms.agreements.fields.reference")}</Label>
																		<Text>{afspraak.kenmerk}</Text>
																	</Stack>
																</Group>
															</Stack>

														</AccordionPanel>
													</AccordionItem>,
												) :
												<NoAfsprakenFound />
											}
										</Accordion>
									</FormRight>
								</Group>
							</>
						}
					</Stack>
				</Box>
			</Stack>
		)}
	</>);
};

export default BurgerDetail;