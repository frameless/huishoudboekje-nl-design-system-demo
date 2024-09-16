import {Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, Tooltip, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {CreateOrganisatieMutationVariables, Organisatie} from "../../generated/graphql";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import useOrganisatieValidator from "../../validators/useOrganisatieValidator";
import Asterisk from "../shared/Asterisk";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";

type OrganisatieFormProps = {
	organisatie?: Organisatie,
	onSubmit: (organisatie: CreateOrganisatieMutationVariables) => void,
	isLoading: boolean,
};

const OrganisatieForm: React.FC<OrganisatieFormProps> = ({organisatie, onSubmit, isLoading = false}) => {
	const validator = useOrganisatieValidator();
	const {t} = useTranslation();
	const toast = useToaster();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {kvknummer, vestigingsnummer, naam} = organisatie || {};
	const [form, {updateForm, toggleSubmitted, isFieldValid}] = useForm<zod.infer<typeof validator>>({
		validator,
		initialValue: {
			naam,
			kvknummer,
			vestigingsnummer,
		},
	});

	const onSubmitForm = e => {
		e.preventDefault();
		toggleSubmitted(true);

		try {
			const data = validator.parse(form);
			onSubmit(data);
		}
		catch (err) {
			toast.closeAll();
			toast({
				error: t("messages.formInputError"),
			});
		}
	};

	return (
		<Box as={"form"} onSubmit={onSubmitForm}>
			<SectionContainer>
				<Section title={t("forms.organizations.sections.organizational.title")} helperText={t("forms.organizations.sections.organizational.helperText")}>
					<Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl isInvalid={!isFieldValid("kvknummer")} id={"kvknummer"} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.organizations.fields.kvknummer")}</FormLabel>
									<Tooltip label={t("forms.organizations.tooltips.kvknummer")} aria-label={t("forms.organizations.fields.kvknummer")} placement={isMobile ? "top" : "left"}>
										<Input
										 	autoComplete="no"
											aria-autocomplete="none"
											onChange={e => updateForm("kvknummer", e.target.value)}
											value={form.kvknummer || ""}
											data-test="input.KvK"
										/>
									</Tooltip>
									<FormErrorMessage>{t("messages.organisaties.invalidKvknummer")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl isInvalid={!isFieldValid("vestigingsnummer")} id={"vestigingsnummer"} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.organizations.fields.vestigingsnummer")}</FormLabel>
									<Input
									 	autoComplete="no"
										aria-autocomplete="none"
										onChange={e => updateForm("vestigingsnummer", e.target.value)}
										value={form.vestigingsnummer || ""}
										data-test="input.branchnumber"
									/>
									<FormErrorMessage>{t("messages.organisaties.invalidVestigingsnummer")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl isInvalid={!isFieldValid("naam")} id={"naam"} isRequired={true}>
								<Stack spacing={1} flex={2}>
									<FormLabel>{t("forms.organizations.fields.naam")}</FormLabel>
									<Input
									 	autoComplete="no"
										aria-autocomplete="none"
										onChange={e => updateForm("naam", e.target.value)}
										value={form.naam || ""}
										data-test="input.companyname"
									/>
									<FormErrorMessage>{t("messages.organisaties.invalidNaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
							<Stack>
								<Button isLoading={isLoading} type={"submit"} data-test="button.submitOrganisatie" colorScheme={"primary"} onClick={onSubmitForm}>{t("global.actions.save")}</Button>
								<Asterisk />
							</Stack>
						</Stack>
					</Stack>
				</Section>
			</SectionContainer>
		</Box>
	);
};

export default OrganisatieForm;
