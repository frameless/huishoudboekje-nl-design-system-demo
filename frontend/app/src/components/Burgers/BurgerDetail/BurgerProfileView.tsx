import {Divider, Stack, StackProps, Text} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Gebruiker} from "../../../generated/graphql";
import {dateFormat} from "../../../utils/things";
import {FormLeft, FormRight, Label} from "../../Forms/FormLeftRight";

const BurgerProfileView: React.FC<StackProps & { burger: Gebruiker }> = ({burger, ...props}) => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();

	return (
		<>
			<Stack spacing={2} direction={isMobile ? "column" : "row"} {...props}>
				<FormLeft title={t("forms.burgers.sections.personal.title")} helperText={t("forms.burgers.sections.personal.detailText")} />
				<FormRight>
					<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
						<Stack direction={isMobile ? "column" : "row"} spacing={1} flex={1}>
							<Stack spacing={1} flex={1}>
								<Label>{t("forms.burgers.fields.initials")}</Label>
								<Text>{burger.voorletters}</Text>
							</Stack>
							<Stack spacing={1} flex={1}>
								<Label>{t("forms.burgers.fields.firstName")}</Label>
								<Text>{burger.voornamen}</Text>
							</Stack>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.lastName")}</Label>
							<Text>{burger.achternaam}</Text>
						</Stack>
					</Stack>
					<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.dateOfBirth")}</Label>
							<Text>{burger.geboortedatum && dateFormat.format(new Date(burger.geboortedatum))}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.age")}</Label>
							<Text>{moment().diff(moment(burger.geboortedatum), "year")}</Text>
						</Stack>
					</Stack>
				</FormRight>
			</Stack>

			<Divider />

			<Stack spacing={2} direction={isMobile ? "column" : "row"} {...props}>
				<FormLeft title={t("forms.burgers.sections.contact.title")} helperText={t("forms.burgers.sections.contact.detailText")} />
				<FormRight>
					<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.street")}</Label>
							<Text>{burger.straatnaam}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.houseNumber")}</Label>
							<Text>{burger.huisnummer}</Text>
						</Stack>
					</Stack>
					<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.zipcode")}</Label>
							<Text>{burger.postcode}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.city")}</Label>
							<Text>{burger.plaatsnaam}</Text>
						</Stack>
					</Stack>
					<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.phoneNumber")}</Label>
							<Text>{burger.telefoonnummer}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.mail")}</Label>
							<Text>{burger.email}</Text>
						</Stack>
					</Stack>
				</FormRight>
			</Stack>
		</>
	);
};

export default BurgerProfileView;