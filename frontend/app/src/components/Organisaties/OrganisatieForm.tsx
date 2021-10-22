import {Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, Tooltip, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Organisatie} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import OrganisatieValidator from "../../validators/OrganisatieValidator";
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
	const toast = useToaster();
	const isMobile = useBreakpointValue(([true, null, null, false]));
	const {kvknummer, vestigingsnummer, naam} = organisatie || {};
	const {data, bind, isFieldValid} = useOrganisatieForm({kvknummer, vestigingsnummer, naam});

	const onSubmitForm = e => {
		e.preventDefault();

		try {
			const validatedData = OrganisatieValidator.parse(data);
			onSubmit({
				...organisatie?.id && {id: organisatie.id},
				...validatedData,
			});
		}
		catch (err) {
			toast.closeAll();
			toast({
				error: t("messages.formInputError"),
			});
			return;
		}

	};

	return (
		<Box as={"form"} onSubmit={onSubmitForm}>
			<Section>
				<Stack direction={["column", "row"]} spacing={2}>
					<FormLeft title={t("forms.organizations.sections.organizational.title")} helperText={t("forms.organizations.sections.organizational.helperText")} />
					<FormRight>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl isInvalid={!isFieldValid("kvknummer")} id={"kvknummer"} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.organizations.fields.kvknummer")}</FormLabel>
									<Tooltip label={t("forms.organizations.tooltips.kvknummer")} aria-label={t("forms.organizations.fields.kvknummer")} placement={isMobile ? "top" : "left"}>
										<Input onChange={bind("kvknummer")} value={data?.kvknummer || ""} />
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
						<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
							<Button isLoading={isLoading} type={"submit"} colorScheme={"primary"} onClick={onSubmitForm}>{t("global.actions.save")}</Button>
						</Stack>
					</FormRight>
				</Stack>
			</Section>
		</Box>
	);
};

export default OrganisatieForm;