import {BoxProps, Divider, FormLabel, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Organisatie} from "../../../generated/graphql";
import {FormLeft, FormRight} from "../../Layouts/Forms";
import Section from "../../Layouts/Section";

const OrganisatieDetailView: React.FC<BoxProps & {organisatie: Organisatie}> = ({organisatie, ...props}) => {
	const {t} = useTranslation();

	if (!organisatie) {
		return null;
	}

	return (
		<Section {...props}>
			<Stack spacing={2} direction={["column", "row"]}>
				<FormLeft title={t("forms.organizations.sections.organizational.title")} helperText={t("forms.organizations.sections.organizational.helperText")} />
				<FormRight>
					<Stack spacing={2} direction={["column", "row"]}>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.organizations.fields.kvkNumber")}</FormLabel>
							<Text>{organisatie.kvkNummer}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.organizations.fields.companyName")}</FormLabel>
							<Text>{organisatie.kvkDetails?.naam}</Text>
						</Stack>
					</Stack>
				</FormRight>
			</Stack>

			<Divider />

			<Stack spacing={2} direction={["column", "row"]}>
				<FormLeft title={t("forms.organizations.sections.contact.title")} helperText={t("forms.organizations.sections.contact.helperText")} />
				<FormRight>
					<Stack spacing={2} direction={["column", "row"]}>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.organizations.fields.street")}</FormLabel>
							<Text>{organisatie.kvkDetails?.straatnaam}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.organizations.fields.houseNumber")}</FormLabel>
							<Text>{organisatie.kvkDetails?.huisnummer}</Text>
						</Stack>
					</Stack>
					<Stack spacing={2} direction={["column", "row"]}>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.organizations.fields.zipcode")}</FormLabel>
							<Text>{organisatie.kvkDetails?.postcode}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.organizations.fields.city")}</FormLabel>
							<Text>{organisatie.kvkDetails?.plaatsnaam}</Text>
						</Stack>
					</Stack>
				</FormRight>
			</Stack>
		</Section>
	);
};

export default OrganisatieDetailView;