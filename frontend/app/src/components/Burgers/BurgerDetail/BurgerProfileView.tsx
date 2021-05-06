import {Divider, FormLabel, Stack, StackProps, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Burger} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";

const BurgerProfileView: React.FC<StackProps & {burger: Burger}> = ({burger, ...props}) => {
	const {t} = useTranslation();

	return (
		<>
			<Stack spacing={2} direction={["column", null, "row"]} {...props}>
				<FormLeft title={t("forms.burgers.sections.personal.title")} helperText={t("forms.burgers.sections.personal.detailText")} />
				<FormRight>
					<Stack spacing={2} mb={1} direction={["column", "row"]}>
						<Stack direction={["column", "row"]} spacing={1} flex={1}>
							<Stack spacing={1} flex={1}>
								<FormLabel>{t("forms.burgers.fields.initials")}</FormLabel>
								<Text>{burger.voorletters}</Text>
							</Stack>
							<Stack spacing={1} flex={1}>
								<FormLabel>{t("forms.burgers.fields.firstName")}</FormLabel>
								<Text>{burger.voornamen}</Text>
							</Stack>
						</Stack>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.burgers.fields.lastName")}</FormLabel>
							<Text>{burger.achternaam}</Text>
						</Stack>
					</Stack>
					<Stack spacing={2} mb={1} direction={["column", "row"]}>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.burgers.fields.dateOfBirth")}</FormLabel>
							<Text>{burger.geboortedatum && d(burger.geboortedatum).format("L")}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.burgers.fields.age")}</FormLabel>
							<Text>{d().diff(d(burger.geboortedatum), "year")}</Text>
						</Stack>
					</Stack>
				</FormRight>
			</Stack>

			<Divider />

			<Stack spacing={2} direction={["column", null, "row"]} {...props}>
				<FormLeft title={t("forms.burgers.sections.contact.title")} helperText={t("forms.burgers.sections.contact.detailText")} />
				<FormRight>
					<Stack spacing={2} mb={1} direction={["column", "row"]}>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.burgers.fields.street")}</FormLabel>
							<Text>{burger.straatnaam}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.burgers.fields.houseNumber")}</FormLabel>
							<Text>{burger.huisnummer}</Text>
						</Stack>
					</Stack>
					<Stack spacing={2} mb={1} direction={["column", "row"]}>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.burgers.fields.zipcode")}</FormLabel>
							<Text>{burger.postcode}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.burgers.fields.city")}</FormLabel>
							<Text>{burger.plaatsnaam}</Text>
						</Stack>
					</Stack>
					<Stack spacing={2} mb={1} direction={["column", "row"]}>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.burgers.fields.phoneNumber")}</FormLabel>
							<Text>{burger.telefoonnummer}</Text>
						</Stack>
						<Stack spacing={1} flex={1}>
							<FormLabel>{t("forms.burgers.fields.mail")}</FormLabel>
							<Text>{burger.email}</Text>
						</Stack>
					</Stack>
				</FormRight>
			</Stack>
		</>
	);
};

export default BurgerProfileView;