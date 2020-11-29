import React from "react";
import {Divider, Heading, Stack, Text} from "@chakra-ui/react";
import {dateFormat} from "../../utils/things";
import {FormLeft, FormRight, Label} from "../Forms/FormLeftRight";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {useIsMobile} from "react-grapple";

const BurgerDetailProfileView = ({gebruiker, ...props}) => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();

	return (
		<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5} {...props}>
			<Stack spacing={2} direction={isMobile ? "column" : "row"}>
				<FormLeft>
					<Heading display={"box"} size={"md"}>{t("forms.burgers.sections.personal.title")}</Heading>
					<Label>{t("forms.burgers.sections.personal.detailText")}</Label>
				</FormLeft>
				<FormRight>
					<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
						<Stack direction={isMobile ? "column" : "row"} spacing={1} flex={1}>
							<Stack spacing={1} flex={1}>
								<Label>{t("forms.burgers.fields.initials")}</Label>
								<Text>{gebruiker.voorletters}</Text>
							</Stack>
							<Stack spacing={1} flex={1}>
								<Label>{t("forms.burgers.fields.firstName")}</Label>
								<Text>{gebruiker.voornamen}</Text>
							</Stack>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.lastName")}</Label>
							<Text>{gebruiker.achternaam}</Text>
						</Stack>
					</Stack>
					<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.dateOfBirth")}</Label>
							<Text>{dateFormat.format(new Date(gebruiker.geboortedatum))}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.age")}</Label>
							<Text>{moment().diff(moment(gebruiker.geboortedatum), "year")}</Text>
						</Stack>
					</Stack>
				</FormRight>
			</Stack>

			<Divider />

			<Stack spacing={2} direction={isMobile ? "column" : "row"}>
				<FormLeft>
					<Heading display={"box"} size={"md"}>{t("forms.burgers.sections.contact.title")}</Heading>
					<Label>{t("forms.burgers.sections.contact.detailText")}</Label>
				</FormLeft>
				<FormRight>
					<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.street")}</Label>
							<Text>{gebruiker.straatnaam}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.houseNumber")}</Label>
							<Text>{gebruiker.huisnummer}</Text>
						</Stack>
					</Stack>
					<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.zipcode")}</Label>
							<Text>{gebruiker.postcode}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.city")}</Label>
							<Text>{gebruiker.plaatsnaam}</Text>
						</Stack>
					</Stack>
					<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.phoneNumber")}</Label>
							<Text>{gebruiker.telefoonnummer}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<Label>{t("forms.burgers.fields.mail")}</Label>
							<Text>{gebruiker.email}</Text>
						</Stack>
					</Stack>
				</FormRight>
			</Stack>
		</Stack>
	);
};

export default BurgerDetailProfileView;