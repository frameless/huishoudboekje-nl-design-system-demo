import {Box, Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Stack, Tooltip, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Organisatie} from "../../generated/graphql";
import {FormLeft, FormRight} from "../Layouts/Forms";
import Section from "../Layouts/Section";
import useOrganisatieForm from "./utils/useOrganisatieForm";

type OrganisatieFormProps = {
	organisatie?: Organisatie,
	onSubmit: Function,
	isLoading: boolean,
};

const OrganisatieForm: React.FC<OrganisatieFormProps> = ({organisatie, onSubmit, isLoading = false}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue(([true, null, null, false]));
	const {kvkNummer, vestigingsnummer, kvkDetails} = organisatie || {};
	const {naam, straatnaam, huisnummer, postcode, plaatsnaam} = kvkDetails || {};
	const {data, bind, isFieldValid} = useOrganisatieForm({kvkNummer, vestigingsnummer, naam, straatnaam, huisnummer, postcode, plaatsnaam});

	const onSubmitForm = e => {
		e.preventDefault();
		onSubmit({
			...organisatie?.id && {id: organisatie.id},
			...data,
		});
	};

	return (
		<Box as={"form"} onSubmit={onSubmitForm}>
			<Section>
				<Stack direction={["column", "row"]} spacing={2}>
					<FormLeft title={t("forms.organizations.sections.organizational.title")} helperText={t("forms.organizations.sections.organizational.helperText")} />
					<FormRight>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl isInvalid={!isFieldValid("kvkNummer")} id={"kvknummer"} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.organizations.fields.kvknummer")}</FormLabel>
									<Tooltip label={t("forms.organizations.tooltips.kvknummer")} aria-label={t("forms.organizations.fields.kvknummer")} placement={isMobile ? "top" : "left"}>
										<Input onChange={bind("kvkNummer")} value={data?.kvkNummer || ""} />
									</Tooltip>
									<FormErrorMessage>{t("messages.organisaties.invalidKvknummer")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl isInvalid={!isFieldValid("vestigingsnummer")} id={"vestigingsnummer"} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.organizations.fields.vestigingsnummer")}</FormLabel>
									<Input onChange={bind("vestigingsnummer")} value={data?.vestigingsnummer || ""} />
									<FormErrorMessage>{t("messages.organisaties.invalidVestigingsnummer")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl isInvalid={!isFieldValid("naam")} id={"naam"} isRequired={true}>
								<Stack spacing={1} flex={2}>
									<FormLabel>{t("forms.organizations.fields.naam")}</FormLabel>
									<Input onChange={bind("naam")} value={data?.naam || ""} />
									<FormErrorMessage>{t("messages.organisaties.invalidNaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
					</FormRight>
				</Stack>

				<Divider />

				<Stack direction={["column", "row"]} spacing={2}>
					<FormLeft title={t("forms.organizations.sections.contact.title")} helperText={t("forms.organizations.sections.contact.helperText")} />
					<FormRight>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl isInvalid={!isFieldValid("straatnaam")} id={"straatnaam"} isRequired={true}>
								<Stack spacing={1} flex={2}>
									<FormLabel>{t("forms.organizations.fields.straatnaam")}</FormLabel>
									<Input onChange={bind("straatnaam")} value={data?.straatnaam || ""} />
									<FormErrorMessage>{t("messages.organisaties.invalidStraatnaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl isInvalid={!isFieldValid("huisnummer")} id={"huisnummer"} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.organizations.fields.huisnummer")}</FormLabel>
									<Input onChange={bind("huisnummer")} value={data?.huisnummer || ""} />
									<FormErrorMessage>{t("messages.organisaties.invalidHuisnummer")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl isInvalid={!isFieldValid("postcode")} id={"postcode"} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.organizations.fields.postcode")}</FormLabel>
									<Tooltip label={t("forms.organizations.tooltips.postcode")} aria-label={t("forms.organizations.fields.postcode")} placement={isMobile ? "top" : "left"}>
										<Input onChange={bind("postcode")} value={data?.postcode || ""} />
									</Tooltip>
									<FormErrorMessage>{t("messages.organisaties.invalidPostcode")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl isInvalid={!isFieldValid("plaatsnaam")} id={"plaatsnaam"} isRequired={true}>
								<Stack spacing={1} flex={2}>
									<FormLabel>{t("forms.organizations.fields.plaatsnaam")}</FormLabel>
									<Input onChange={bind("plaatsnaam")} value={data?.plaatsnaam || ""} />
									<FormErrorMessage>{t("messages.organisaties.invalidPlaatsnaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
					</FormRight>
				</Stack>

				<Divider />

				<Stack direction={["column", "row"]} spacing={2}>
					<FormLeft />
					<FormRight>
						<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
							<Button isLoading={isLoading} type={"submit"} colorScheme={"primary"} onClick={onSubmitForm}>{t("actions.save")}</Button>
						</Stack>
					</FormRight>
				</Stack>
			</Section>
		</Box>
	);
};

export default OrganisatieForm;