import {Box, Button, Divider, FormControl, FormLabel, Input, Stack, Tooltip, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useInput, useToggle, Validators} from "react-grapple";
import {UseInput} from "react-grapple/dist/hooks/useInput";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {GetOrganisatiesDocument, useCreateOrganisatieMutation} from "../../generated/graphql";
import {Regex} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import BackButton from "../Layouts/BackButton";
import {FormLeft, FormRight} from "../Layouts/Forms";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";

const CreateOrganisatie = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const toast = useToaster();
	const [isSubmitted, toggleSubmitted] = useToggle(false);

	const kvknummer = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(/^[0-9]{8}$/).test(v)],
	});
	const vestigingsnummer = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});
	const bedrijfsnaam = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});
	const straatnaam = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});
	const huisnummer = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});
	const postcode = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.ZipcodeNL).test(v)],
		placeholder: "1234AB",
	});
	const plaatsnaam = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});

	const [createOrganisatie, $createOrganisatie] = useCreateOrganisatieMutation({
		refetchQueries: [
			{ query: GetOrganisatiesDocument }
		]
	});

	const onSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		const isFormValid = [
			kvknummer,
			vestigingsnummer,
			bedrijfsnaam,
			straatnaam,
			huisnummer,
			postcode,
			plaatsnaam,
		].every(f => f.isValid);

		if (!isFormValid) {
			toast({
				error: t("messages.organizations.invalidFormMessage"),
			});
			return;
		}

		createOrganisatie({
			variables: {
				huisnummer: huisnummer.value,
				kvkNummer: kvknummer.value,
				naam: bedrijfsnaam.value,
				plaatsnaam: plaatsnaam.value,
				postcode: postcode.value,
				straatnaam: straatnaam.value,
				vestigingsnummer: vestigingsnummer.value,
			},
		}).then(result => {
			toast({
				success: t("messages.organizations.createSuccessMessage"),
			});

			const {id} = result?.data?.createOrganisatie?.organisatie || {};
			if (id) {
				push(Routes.Organisatie(id));
			}
		}).catch(err => {
			console.error(err);

			let message = err.message;
			if (err.message.includes("already exists")) {
				message = t("messages.organisatie.alreadyExists");
			}

			toast({
				error: message,
			});
		});
	};

	const isInvalid = (input: UseInput) => (input.dirty || isSubmitted) && !input.isValid;

	return (
		<Page title={t("forms.createOrganisatie.title")} backButton={<BackButton to={Routes.Organisaties} />}>
			<Box as={"form"} onSubmit={onSubmit}>
				<Section>
					<Stack direction={["column", "row"]} spacing={2}>
						<FormLeft title={t("forms.organizations.sections.organizational.title")} helperText={t("forms.organizations.sections.organizational.helperText")} />
						<FormRight>
							<Stack spacing={2} direction={["column", "row"]}>
								<FormControl id={"kvknummer"} isRequired={true}>
									<Stack spacing={1} flex={1}>
										<FormLabel>{t("forms.organizations.fields.kvknummer")}</FormLabel>
										<Tooltip label={t("forms.organizations.tooltips.kvknummer")} aria-label={t("forms.organizations.fields.kvknummer")} placement={isMobile ? "top" : "left"}>
											<Input isInvalid={isInvalid(kvknummer)} {...kvknummer.bind} />
										</Tooltip>
									</Stack>
								</FormControl>
								<FormControl id={"vestigingsnummer"} isRequired={true}>
									<Stack spacing={1} flex={1}>
										<FormLabel>{t("forms.organizations.fields.vestigingsnummer")}</FormLabel>
										<Input isInvalid={isInvalid(vestigingsnummer)} {...vestigingsnummer.bind} />
									</Stack>
								</FormControl>
							</Stack>
							<Stack spacing={2} direction={["column", "row"]}>
								<FormControl id={"bedrijfsnaam"} isRequired={true}>
									<Stack spacing={1} flex={2}>
										<FormLabel>{t("forms.organizations.fields.bedrijfsnaam")}</FormLabel>
										<Input isInvalid={isInvalid(bedrijfsnaam)} {...bedrijfsnaam.bind} />
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
								<FormControl id={"straatnaam"} isRequired={true}>
									<Stack spacing={1} flex={2}>
										<FormLabel>{t("forms.organizations.fields.straatnaam")}</FormLabel>
										<Input isInvalid={isInvalid(straatnaam)} {...straatnaam.bind} />
									</Stack>
								</FormControl>
								<FormControl id={"huisnummer"} isRequired={true}>
									<Stack spacing={1} flex={1}>
										<FormLabel>{t("forms.organizations.fields.huisnummer")}</FormLabel>
										<Input isInvalid={isInvalid(huisnummer)} {...huisnummer.bind} />
									</Stack>
								</FormControl>
							</Stack>
							<Stack spacing={2} direction={["column", "row"]}>
								<FormControl id={"postcode"} isRequired={true}>
									<Stack spacing={1} flex={1}>
										<FormLabel>{t("forms.organizations.fields.postcode")}</FormLabel>
										<Tooltip label={t("forms.organizations.tooltips.postcode")} aria-label={t("forms.organizations.fields.postcode")} placement={isMobile ? "top" : "left"}>
											<Input isInvalid={isInvalid(postcode)} {...postcode.bind} />
										</Tooltip>
									</Stack>
								</FormControl>
								<FormControl id={"plaatsnaam"} isRequired={true}>
									<Stack spacing={1} flex={2}>
										<FormLabel>{t("forms.organizations.fields.plaatsnaam")}</FormLabel>
										<Input isInvalid={isInvalid(plaatsnaam)} {...plaatsnaam.bind} />
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
								<Button isLoading={$createOrganisatie.loading} type={"submit"} colorScheme={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
							</Stack>
						</FormRight>
					</Stack>
				</Section>
			</Box>
		</Page>
	);
};

export default CreateOrganisatie;