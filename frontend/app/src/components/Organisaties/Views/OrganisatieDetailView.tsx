import {BoxProps, Divider, FormLabel, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Organisatie} from "../../../generated/graphql";
import {FormLeft, FormRight} from "../../shared/Forms";

const OrganisatieDetailView: React.FC<BoxProps & {organisatie: Organisatie}> = ({organisatie}) => {
	const {t} = useTranslation();

	return (
		<Stack divider={<Divider />}>

			<Stack spacing={2} direction={["column", "row"]}>
				<FormLeft title={t("forms.organizations.sections.organizational.title")} helperText={t("forms.organizations.sections.organizational.helperText")} />
				<FormRight flex={2}>
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
				</FormRight>
			</Stack>

		</Stack>
	);
};

export default OrganisatieDetailView;