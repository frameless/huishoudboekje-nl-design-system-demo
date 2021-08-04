import {Box, Button, Divider, FormControl, FormLabel, Input, Stack, Tooltip, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useInput, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {Organisatie, useGetOrganisatieQuery, useUpdateOrganisatieMutation} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {Regex} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import BackButton from "../Layouts/BackButton";
import {FormLeft, FormRight} from "../Layouts/Forms";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";

const OrganisatieEdit = () => {
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {t} = useTranslation();
	const {id} = useParams<{id: string}>();
	const toast = useToaster();
	const {push} = useHistory();

	const kvkNummer = useInput({
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

	const $organisatie = useGetOrganisatieQuery({
		variables: {id: parseInt(id)},
		onCompleted: ({organisatie}) => {
			if (organisatie) {
				kvkNummer.setValue(organisatie.kvkNummer?.toString() || "");
				vestigingsnummer.setValue(organisatie.vestigingsnummer || "");
				bedrijfsnaam.setValue(organisatie.kvkDetails?.naam || "");
				straatnaam.setValue(organisatie.kvkDetails?.straatnaam || "");
				huisnummer.setValue(organisatie.kvkDetails?.huisnummer || "");
				postcode.setValue(organisatie.kvkDetails?.postcode || "");
				plaatsnaam.setValue(organisatie.kvkDetails?.plaatsnaam || "");
			}
		},
	});
	const [updateOrganisatie, $updateOrganisatie] = useUpdateOrganisatieMutation();

	const onSubmit = (e) => {
		e.preventDefault();

		const isFormValid = [
			kvkNummer,
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

		updateOrganisatie({
			variables: {
				id: parseInt(id),
				kvkNummer: kvkNummer.value,
				vestigingsnummer: vestigingsnummer.value,
				naam: bedrijfsnaam.value,
				straatnaam: straatnaam.value,
				huisnummer: huisnummer.value,
				postcode: postcode.value,
				plaatsnaam: plaatsnaam.value,
			},
		}).then(() => {
			toast({
				success: t("messages.organizations.updateSuccessMessage"),
			});
			push(Routes.Organisatie(parseInt(id)));
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	const isInvalid = (input) => input.dirty && !input.isValid;

	return (
		<Queryable query={$organisatie} error={<Redirect to={Routes.NotFound} />}>{({organisatie}: {organisatie: Organisatie}) => (
			<Page backButton={<BackButton to={Routes.Organisatie(parseInt(id))} />} title={organisatie.kvkDetails?.naam || ""}>
				<Box as={"form"} onSubmit={onSubmit}>
					<Section>
						<Stack direction={["column", "row"]} spacing={2}>
							<FormLeft title={t("forms.organizations.sections.organizational.title")} helperText={t("forms.organizations.sections.organizational.helperText")} />
							<FormRight>
								<Stack spacing={2} direction={["column", "row"]}>
									<FormControl isRequired={true} id={"kvknummer"}>
										<Stack spacing={1} flex={1}>
											<FormLabel>{t("forms.organizations.fields.kvknummer")}</FormLabel>
											<Tooltip label={t("forms.organizations.tooltips.kvknummer")} aria-label={t("forms.organizations.fields.kvknummer")} placement={isMobile ? "top" : "left"}>
												<Input isInvalid={isInvalid(kvkNummer)} {...kvkNummer.bind} />
											</Tooltip>
										</Stack>
									</FormControl>
									<FormControl isRequired={true} id={"bedrijfsnaam"}>
										<Stack spacing={1} flex={2}>
											<FormLabel>{t("forms.organizations.fields.bedrijfsnaam")}</FormLabel>
											<Input isInvalid={isInvalid(bedrijfsnaam)} {...bedrijfsnaam.bind} />
										</Stack>
									</FormControl>
								</Stack>
								<Stack spacing={2} direction={["column", "row"]}>
									<FormControl isRequired={true} id={"vestigingsnummer"}>
										<Stack spacing={1} flex={1}>
											<FormLabel>{t("forms.organizations.fields.vestigingsnummer")}</FormLabel>
											<Input isInvalid={isInvalid(vestigingsnummer)} {...vestigingsnummer.bind} />
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
									<FormControl isRequired={true} id={"straatnaam"}>
										<Stack spacing={1} flex={2}>
											<FormLabel>{t("forms.organizations.fields.straatnaam")}</FormLabel>
											<Input isInvalid={isInvalid(straatnaam)} {...straatnaam.bind} />
										</Stack>
									</FormControl>
									<FormControl isRequired={true} id={"huisnummer"}>
										<Stack spacing={1} flex={1}>
											<FormLabel>{t("forms.organizations.fields.huisnummer")}</FormLabel>
											<Input isInvalid={isInvalid(huisnummer)} {...huisnummer.bind} />
										</Stack>
									</FormControl>
								</Stack>
								<Stack spacing={2} direction={["column", "row"]}>
									<FormControl isRequired={true} id={"postcode"}>
										<Stack spacing={1} flex={1}>
											<FormLabel>{t("forms.organizations.fields.postcode")}</FormLabel>
											<Tooltip label={t("forms.organizations.tooltips.postcode")} aria-label={t("forms.organizations.fields.postcode")} placement={isMobile ? "top" : "left"}>
												<Input isInvalid={isInvalid(postcode)} {...postcode.bind} />
											</Tooltip>
										</Stack>
									</FormControl>
									<FormControl isRequired={true} id={"plaatsnaam"}>
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
									<Button isLoading={$organisatie.loading || $updateOrganisatie.loading} type={"submit"} colorScheme={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
								</Stack>
							</FormRight>
						</Stack>
					</Section>
				</Box>
			</Page>
		)}
		</Queryable>
	);
};

export default OrganisatieEdit;