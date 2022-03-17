import {BoxProps, FormLabel, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Organisatie} from "../../../generated/graphql";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";

const OrganisatieDetailView: React.FC<BoxProps & { organisatie: Organisatie }> = ({organisatie}) => {
	const {t} = useTranslation();

	return (
		<SectionContainer>
			<Section title={t("forms.organizations.sections.organizational.title")} helperText={t("organizations.sections.organizational.helperText")}>
				<Stack spacing={2} direction={["column", "row"]}>
					<Stack spacing={1} flex={1}>
						<FormLabel>{t("forms.organizations.fields.kvkNumber")}</FormLabel>
						<Text>{organisatie.kvknummer}</Text>
					</Stack>
					<Stack spacing={1} flex={1}>
						<FormLabel>{t("forms.organizations.fields.vestigingsnummer")}</FormLabel>
						<Text>{organisatie.vestigingsnummer}</Text>
					</Stack>
				</Stack>
			</Section>
		</SectionContainer>
	);
};

export default OrganisatieDetailView;