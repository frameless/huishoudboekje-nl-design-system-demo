import {Box, Button, Divider, FormLabel, Input, Stack, Tooltip, useBreakpointValue, useToast} from "@chakra-ui/react";
import React from "react";
import {useInput, useToggle, Validators} from "react-grapple";
import {UseInput} from "react-grapple/dist/hooks/useInput";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {useCreateOrganisatieMutation} from "../../generated/graphql";
import {Regex} from "../../utils/things";
import BackButton from "../BackButton";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";

// Todo: add more detailed error message per field?
const CreateOrganisatie = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const toast = useToast();
	const [isSubmitted, toggleSubmitted] = useToggle(false);

	const kvkNumber = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(/^[0-9]{8}$/).test(v)]
	});
	const companyName = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const displayName = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const street = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const houseNumber = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const zipcode = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.ZipcodeNL).test(v)],
		placeholder: "1234AB"
	});
	const city = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});

	const [createOrganisatie, $createOrganisatie] = useCreateOrganisatieMutation();

	const onSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		const isFormValid = [
			kvkNumber,
			companyName,
			displayName,
			street,
			houseNumber,
			zipcode,
			city,
		].every(f => f.isValid);

		if (!isFormValid) {
			toast({
				status: "error",
				title: t("messages.organizations.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		createOrganisatie({
			variables: {
				huisnummer: houseNumber.value,
				kvkNummer: kvkNumber.value,
				naam: companyName.value,
				plaatsnaam: city.value,
				postcode: zipcode.value,
				straatnaam: street.value,
				weergaveNaam: displayName.value,
			}
		}).then(result => {
			toast({
				status: "success",
				title: t("messages.organizations.createSuccessMessage"),
				position: "top",
			});

			const {id} = result?.data?.createOrganisatie?.organisatie || {};
			if (id) {
				push(Routes.Organisatie(id));
			}
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				title: t("messages.genericError.title"),
				description: t("messages.genericError.description"),
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
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"kvkNumber"}>{t("forms.organizations.fields.kvkNumber")}</FormLabel>
									<Tooltip label={t("forms.organizations.tooltips.kvkNumber")} aria-label={t("forms.organizations.fields.kvkNumber")} hasArrow
									         placement={isMobile ? "top" : "left"}>
										<Input isInvalid={isInvalid(kvkNumber)} {...kvkNumber.bind} id="kvkNumber" />
									</Tooltip>
								</Stack>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"companyName"}>{t("forms.organizations.fields.companyName")}</FormLabel>
									<Input isInvalid={isInvalid(companyName)} {...companyName.bind} id="companyName" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={["column", "row"]}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"displayName"}>{t("forms.organizations.fields.displayName")}</FormLabel>
									<Input isInvalid={isInvalid(displayName)} {...displayName.bind} id="displayName" />
								</Stack>
							</Stack>
						</FormRight>
					</Stack>

					<Divider />

					<Stack direction={["column", "row"]} spacing={2}>
						<FormLeft title={t("forms.organizations.sections.contact.title")} helperText={t("forms.organizations.sections.contact.helperText")} />
						<FormRight>
							<Stack spacing={2} direction={["column", "row"]}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"street"}>{t("forms.organizations.fields.street")}</FormLabel>
									<Input isInvalid={isInvalid(street)} {...street.bind} id="street" />
								</Stack>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"houseNumber"}>{t("forms.organizations.fields.houseNumber")}</FormLabel>
									<Input isInvalid={isInvalid(houseNumber)} {...houseNumber.bind} id="houseNumber" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={["column", "row"]}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"zipcode"}>{t("forms.organizations.fields.zipcode")}</FormLabel>
									<Tooltip label={t("forms.organizations.tooltips.zipcode")} aria-label={t("forms.organizations.fields.zipcode")} hasArrow
									         placement={isMobile ? "top" : "left"}>
										<Input isInvalid={isInvalid(zipcode)} {...zipcode.bind} id="zipcode" />
									</Tooltip>
								</Stack>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"city"}>{t("forms.organizations.fields.city")}</FormLabel>
									<Input isInvalid={isInvalid(city)} {...city.bind} id="city" />
								</Stack>
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