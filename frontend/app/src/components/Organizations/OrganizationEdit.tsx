import {useMutation, useQuery} from "@apollo/client";
import {Box, Button, Divider, FormLabel, Heading, Input, Spinner, Stack, Tooltip, useToast} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {useInput, useIsMobile, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Redirect, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {IOrganisatie} from "../../models";
import {UpdateOrganizationMutation} from "../../services/graphql/mutations";
import {GetOneOrganisatieQuery} from "../../services/graphql/queries";
import {Regex} from "../../utils/things";
import BackButton from "../BackButton";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";

const OrganizationEdit = () => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const {id} = useParams<{ id }>();
	const toast = useToast();

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

	const {data, loading, error} = useQuery<{ organisatie: IOrganisatie }>(GetOneOrganisatieQuery, {
		variables: {id}
	});

	const [updateMutation, {loading: updateLoading}] = useMutation(UpdateOrganizationMutation);

	useEffect(() => {
		let mounted = true;

		if (mounted && data) {
			const {organisatie} = data;

			if (organisatie) {
				kvkNumber.setValue(organisatie.kvkNummer.toString());
				companyName.setValue(organisatie.kvkDetails.naam);
				displayName.setValue(organisatie.weergaveNaam);
				street.setValue(organisatie.kvkDetails.straatnaam);
				houseNumber.setValue(organisatie.kvkDetails.huisnummer);
				zipcode.setValue(organisatie.kvkDetails.postcode);
				city.setValue(organisatie.kvkDetails.plaatsnaam);
			}
		}

		return () => {
			mounted = false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, loading]);

	const onSubmit = (e) => {
		e.preventDefault();

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

		updateMutation({
			variables: {
				id,
				kvkNummer: kvkNumber.value,
				naam: companyName.value,
				weergaveNaam: displayName.value,
				straatnaam: street.value,
				huisnummer: houseNumber.value,
				postcode: zipcode.value,
				plaatsnaam: city.value,
			}
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.organizations.updateSuccessMessage"),
				position: "top",
			});
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				title: t("messages.genericError.title"),
				description: t("messages.genericError.description"),
			});
		})
	};

	const isInvalid = (input) => input.dirty && !input.isValid;

	return (<>
		<BackButton to={Routes.Organization(id)} />

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
				<Heading size={"lg"}>{data.organisatie.weergaveNaam}</Heading>

				<Box as={"form"} onSubmit={onSubmit}>
					<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
						<Stack direction={isMobile ? "column" : "row"} spacing={2}>
							<FormLeft title={t("forms.organizations.sections.organizational.title")} helperText={t("forms.organizations.sections.organizational.helperText")} />
							<FormRight>
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
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
							<FormLeft title={t("forms.organizations.sections.contact.title")} helperText={t("forms.organizations.sections.contact.helperText")} />
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

						<Stack direction={isMobile ? "column" : "row"} spacing={2}>
							<FormLeft />
							<FormRight>
								<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
									<Button isLoading={loading || updateLoading} type={"submit"} colorScheme={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
								</Stack>
							</FormRight>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		)}
	</>);
};

export default OrganizationEdit;