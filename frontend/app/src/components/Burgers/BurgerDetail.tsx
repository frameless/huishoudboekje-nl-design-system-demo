import {
	Accordion,
	AccordionHeader,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Divider,
	FormLabel,
	Heading,
	Spinner,
	Stack,
	Switch,
	Text,
	useToast,
} from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, useHistory, useParams } from "react-router-dom";
import Routes from "../../config/routes";
import BackButton from "../BackButton";
import { useMutation, useQuery } from "@apollo/client";
import { IAfspraak, IGebruiker } from "../../models";
import { GetOneGebruikerQuery } from "../../services/graphql/queries";
import { FormLeft, FormRight, Group, Label } from "../Forms/FormLeftRight";
import NoAfsprakenFound from "./NoAfsprakenFound";
import NoAfsprakenSearchResults from "./NoAfsprakenSearchResults";
import RekeningenList from "../Rekeningen/RekeningenList";
import { UpdateGebruikerRekeningenMutation, } from "../../services/graphql/mutations";

const BurgerDetail = () => {
	const {t} = useTranslation();
	const {id} = useParams();
	const {push} = useHistory();
	const toast = useToast();

	const [showInactive, setShowInactive] = useState(false)
	const [afspraken, setAfspraken] = useState<IAfspraak[] | undefined>(undefined)

	const { data, loading, error, refetch } = useQuery<{ gebruiker: IGebruiker }>(GetOneGebruikerQuery, {
		variables: { id },
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

	const [updateGebruikerRekening] = useMutation(UpdateGebruikerRekeningenMutation);

	const onChangeRekeningen = async (rekeningen) => {
		try {
			await updateGebruikerRekening({
				variables: {
					gebruikerId: data?.gebruiker.id,
					rekeningen: rekeningen.map(({ id, iban, rekeninghouder }) => ({ id, iban, rekeninghouder })),
				},
			});
			toast({
				status: "success",
				title: t("messages.rekeningen.createSuccessMessage"),
				position: "top",
			});
			refetch();
		}
		catch (e) {
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				title: t("messages.genericError.title"),
				description: t("messages.genericError.description"),
			});
		}
	};
	return (<>
		<BackButton to={Routes.Burgers} />

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
									<Button variantColor={"primary"} onClick={onClickEditButton}>{t("actions.edit")}</Button>
								</Stack>
							</FormRight>
						</Group>

						<Divider />

						<Group>
							<FormLeft>
								<Heading display={"box"} size={"md"}>{t("forms.burgers.sections.personal.title")}</Heading>
								<Label>{t("forms.burgers.sections.personal.detailText")}</Label>
							</FormLeft>
							<FormRight>
								<Group mb={5}>
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
								<Group>
									<Stack spacing={1}>
										<Label>{t("forms.burgers.fields.dateOfBirth")}</Label>
										<Text>{data.gebruiker.geboortedatum}</Text>
									</Stack>
								</Group>

							</FormRight>
						</Group>

						<Divider />

						<Group>
							<FormLeft>
								<Heading display={"box"} size={"md"}>{t("forms.burgers.sections.contact.title")}</Heading>
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
						<RekeningenList
							rekeningen={data.gebruiker.rekeningen}
							onChange={onChangeRekeningen}
							placeholderRekeninghouder={`${data.gebruiker.voornamen} ${data.gebruiker.achternaam}`.trim()} />
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
												<Switch id="show-inactive-agreements" onChange={onClickShowInactive} />
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

										{afspraken?.length === 0 ?
											<NoAfsprakenSearchResults />
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
												)}
											</Accordion>
										}
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