import {BoxProps, Divider, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {IOrganisatie} from "../../../models";
import {FormLeft, FormRight, Label} from "../../Forms/FormLeftRight";

const OrganizationDetailView: React.FC<BoxProps & { organisatie: IOrganisatie }> = ({organisatie, ...props}) => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();

	return (
		<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5} {...props}>
			<Stack spacing={2} direction={isMobile ? "column" : "row"}>
				<FormLeft title={t("forms.organizations.sections.organizational.title")} helperText={t("forms.organizations.sections.organizational.helperText")} />
				<FormRight>
					<Stack spacing={2} direction={isMobile ? "column" : "row"}>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.organizations.fields.kvkNumber")}</Label>
							<Text>{organisatie.kvkNummer}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.organizations.fields.companyName")}</Label>
							<Text>{organisatie.kvkDetails.naam}</Text>
						</Stack>
					</Stack>
				</FormRight>
			</Stack>

			<Divider />

			<Stack spacing={2} direction={isMobile ? "column" : "row"}>
				<FormLeft title={t("forms.organizations.sections.contact.title")} helperText={t("forms.organizations.sections.contact.helperText")} />
				<FormRight>
					<Stack spacing={2} direction={isMobile ? "column" : "row"}>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.organizations.fields.street")}</Label>
							<Text>{organisatie.kvkDetails.straatnaam}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.organizations.fields.houseNumber")}</Label>
							<Text>{organisatie.kvkDetails.huisnummer}</Text>
						</Stack>
					</Stack>
					<Stack spacing={2} direction={isMobile ? "column" : "row"}>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.organizations.fields.zipcode")}</Label>
							<Text>{organisatie.kvkDetails.postcode}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.organizations.fields.city")}</Label>
							<Text>{organisatie.kvkDetails.plaatsnaam}</Text>
						</Stack>
					</Stack>
				</FormRight>
			</Stack>
		</Stack>
	);
};

export default OrganizationDetailView;