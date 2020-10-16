import React from "react";
import {useTranslation} from "react-i18next";
import {Box, Button, Divider, Flex, FormHelperText, FormLabel, Heading, Input, Stack, Tooltip, useToast} from "@chakra-ui/core";
import {useInput, useIsMobile, useToggle, Validators} from "react-grapple";
import BackButton from "../BackButton";
import Routes from "../../config/routes";
import {isDev, MOBILE_BREAKPOINT, Regex} from "../../utils/things";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import {useMutation} from "@apollo/client";
import {sampleData} from "../../config/sampleData/sampleData";
import {useHistory} from "react-router-dom";
import {CreateOrganizationMutation} from "../../services/graphql/mutations";
import {UseInput} from "react-grapple/dist/hooks/useInput";

// Todo: add more detailed error message per field?
const CreateOrganization = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const isMobile = useIsMobile(MOBILE_BREAKPOINT);
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

	const [createOrganization, {loading}] = useMutation(CreateOrganizationMutation);

	const prePopulateForm = () => {
		const c = sampleData.organizations[Math.floor(Math.random() * sampleData.organizations.length)];

		kvkNumber.setValue(c.kvkNumber.toString());
		companyName.setValue(c.companyName);
		displayName.setValue(c.displayName);
		street.setValue(c.street);
		houseNumber.setValue(c.houseNumber);
		zipcode.setValue(c.zipcode);
		city.setValue(c.city);
	}

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

		createOrganization({
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

			const {id} = result.data.createOrganisatie.organisatie;
			if (id) {
				push(Routes.Organization(id));
			}
		}).catch(err => {
			console.log("Error:", err);
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

	return (<>
		<BackButton to={Routes.Organizations} />

		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Stack>
					<Heading size={"lg"}>{t("forms.organizations.title")}</Heading>
				</Stack>
			</Stack>

			{isDev && (
				<Flex justifyContent={"center"}>
					<Button maxWidth={350} variantColor={"yellow"} variant={"outline"} onClick={() => prePopulateForm()}>Formulier snel invullen met testdata</Button>
				</Flex>
			)}

			<Box as={"form"} onSubmit={onSubmit}>
				<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft>
							<Heading size={"md"}>{t("forms.organizations.sections.organizational.title")}</Heading>
							<FormHelperText id="personal-helperText">{t("forms.organizations.sections.organizational.helperText")}</FormHelperText>
						</FormLeft>
						<FormRight>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"kvkNumber"}>{t("forms.organizations.fields.kvkNumber")}</FormLabel>
									<Tooltip label={t("forms.organizations.tooltips.kvkNumber")} aria-label={t("forms.organizations.fields.kvkNumber")} hasArrow placement={isMobile ? "top" : "left"}>
										<Input isInvalid={isInvalid(kvkNumber)} {...kvkNumber.bind} id="kvkNumber" />
									</Tooltip>
								</Stack>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"companyName"}>{t("forms.organizations.fields.companyName")}</FormLabel>
									<Input isInvalid={isInvalid(companyName)} {...companyName.bind} id="companyName" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"displayName"}>{t("forms.organizations.fields.displayName")}</FormLabel>
									<Input isInvalid={isInvalid(displayName)} {...displayName.bind} id="displayName" />
								</Stack>
							</Stack>
						</FormRight>
					</Stack>

					<Divider />

					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft>
							<Heading size={"md"}>{t("forms.organizations.sections.contact.title")}</Heading>
							<FormHelperText>{t("forms.organizations.sections.contact.helperText")}</FormHelperText>
						</FormLeft>
						<FormRight>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"street"}>{t("forms.organizations.fields.street")}</FormLabel>
									<Input isInvalid={isInvalid(street)} {...street.bind} id="street" />
								</Stack>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"houseNumber"}>{t("forms.organizations.fields.houseNumber")}</FormLabel>
									<Input isInvalid={isInvalid(houseNumber)} {...houseNumber.bind} id="houseNumber" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"zipcode"}>{t("forms.organizations.fields.zipcode")}</FormLabel>
									<Tooltip label={t("forms.organizations.tooltips.zipcode")} aria-label={t("forms.organizations.fields.zipcode")} hasArrow placement={isMobile ? "top" : "left"}>
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

					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft />
						<FormRight>
							<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
								<Button isLoading={loading} type={"submit"} variantColor={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
							</Stack>
						</FormRight>
					</Stack>
				</Stack>
			</Box>
		</Stack>
	</>);
};

export default CreateOrganization;