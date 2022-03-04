import {Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, Tooltip, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Organisatie} from "../../generated/graphql";
import {Regex} from "../../utils/things";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import {FormLeft, FormRight} from "../shared/Forms";
import Section from "../shared/Section";
import Asterisk from "../shared/Asterisk";

const validator = zod.object({
	kvknummer: zod.string().regex(Regex.KvkNummer),
	vestigingsnummer: zod.string().regex(Regex.Vestigingsnummer),
	naam: zod.string().nonempty().max(100),
});


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
	const [form, {updateForm, toggleSubmitted, isValid, isFieldValid}] = useForm<zod.infer<typeof validator>>({
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

		if (isValid()) {
			onSubmit({
				...organisatie?.id && {id: organisatie.id},
				...form,
			});
			return;
		}

		toast.closeAll();
		toast({
			error: t("messages.formInputError"),
		});
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
										<Input onChange={e => updateForm("kvknummer", e.target.value)} value={form.kvknummer || ""} />
									</Tooltip>
									<FormErrorMessage>{t("messages.organisaties.invalidKvknummer")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl isInvalid={!isFieldValid("vestigingsnummer")} id={"vestigingsnummer"} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.organizations.fields.vestigingsnummer")}</FormLabel>
									<Input onChange={e => updateForm("vestigingsnummer", e.target.value)} value={form.vestigingsnummer || ""} />
									<FormErrorMessage>{t("messages.organisaties.invalidVestigingsnummer")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl isInvalid={!isFieldValid("naam")} id={"naam"} isRequired={true}>
								<Stack spacing={1} flex={2}>
									<FormLabel>{t("forms.organizations.fields.naam")}</FormLabel>
									<Input onChange={e => updateForm("naam", e.target.value)} value={form.naam || ""} />
									<FormErrorMessage>{t("messages.organisaties.invalidNaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
							<Stack>
								<Button isLoading={isLoading} type={"submit"} colorScheme={"primary"} onClick={onSubmitForm}>{t("global.actions.save")}</Button>
								<Asterisk />
							</Stack>
						</Stack>
					</FormRight>
				</Stack>
			</Section>
		</Box>
	);
};

export default OrganisatieForm;