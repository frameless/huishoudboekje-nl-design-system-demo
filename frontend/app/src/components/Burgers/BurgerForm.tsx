import {Box, Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Stack, Tooltip, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import {Burger} from "../../generated/graphql";
import d from "../../utils/dayjs";
import {FormLeft, FormRight} from "../Layouts/Forms";
import Section from "../Layouts/Section";
import useBurgerForm from "./useBurgerForm";

type BurgerFormProps = {
	burger?: Burger,
	onSubmit: Function,
	isLoading: boolean,
}

const BurgerForm: React.FC<BurgerFormProps> = ({burger, onSubmit, isLoading}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {bsn, voorletters, voornamen, achternaam, geboortedatum, email, huisnummer, postcode, straatnaam, plaatsnaam, telefoonnummer} = burger || {};
	const {data, updateForm, bind, isFieldValid} = useBurgerForm({
		bsn,
		voorletters,
		voornamen,
		achternaam,
		geboortedatum,
		email,
		huisnummer,
		postcode,
		straatnaam,
		plaatsnaam,
		telefoonnummer,
	});

	const onSubmitForm = (e) => {
		e.preventDefault();
		onSubmit(({
			...data,
			...burger?.id && {id: burger.id},
			bsn: Number(data.bsn),
			geboortedatum: d(data.geboortedatum, "L").format("YYYY-MM-DD"),
		}));
	};

	return (
		<Box as={"form"} onSubmit={onSubmitForm}>
			<Section divider={<Divider />}>
				<Stack direction={["column", "row"]} spacing={2}>
					<FormLeft title={t("forms.burgers.sections.personal.title")} helperText={t("forms.burgers.sections.personal.helperText")} />
					<FormRight>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl id={"bsn"} isInvalid={!isFieldValid("bsn")} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.burgers.fields.bsn")}</FormLabel>
									<Input onChange={bind("bsn")} value={data.bsn || ""} />
									<FormErrorMessage>{t("messages.burgerForm.invalidBsn")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl id={"voorletters"} isInvalid={!isFieldValid("voorletters")} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.burgers.fields.voorletters")}</FormLabel>
									<Input onChange={bind("voorletters")} value={data.voorletters || ""} />
									<FormErrorMessage>{t("messages.burgerForm.invalidVoorletters")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl id={"voornamen"} isInvalid={!isFieldValid("voornamen")} isRequired={true}>
								<Stack spacing={1} flex={3}>
									<FormLabel>{t("forms.burgers.fields.voornamen")}</FormLabel>
									<Input onChange={bind("voornamen")} value={data.voornamen || ""} />
									<FormErrorMessage>{t("messages.burgerForm.invalidVoornamen")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl id={"achternaam"} isInvalid={!isFieldValid("achternaam")} isRequired={true}>
								<Stack spacing={1} flex={3}>
									<FormLabel>{t("forms.burgers.fields.achternaam")}</FormLabel>
									<Input onChange={bind("achternaam")} value={data.achternaam || ""} />
									<FormErrorMessage>{t("messages.burgerForm.invalidAchternaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<FormControl id={"geboortedatum"} isInvalid={!isFieldValid("geboortedatum")} isRequired={true}>
							<Stack spacing={1}>
								<FormLabel>{t("forms.burgers.fields.geboortedatum")}</FormLabel>
								<DatePicker selected={d(data.geboortedatum, "L").isValid() ? d(data.geboortedatum, "L").toDate() : null} dateFormat={"dd-MM-yyyy"} onChange={(value: Date) => {
									if (value) {
										updateForm("geboortedatum", d(value).format("L"));
									}
								}} customInput={<Input type="text" />} />
								<FormErrorMessage>{t("messages.burgerForm.invalidGeboortedatum")}</FormErrorMessage>
							</Stack>
						</FormControl>
					</FormRight>
				</Stack>

				<Stack direction={["column", "row"]} spacing={2}>
					<FormLeft title={t("forms.burgers.sections.contact.title")} helperText={t("forms.burgers.sections.contact.helperText")} />
					<FormRight>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl id={"straatnaam"} isInvalid={!isFieldValid("straatnaam")} isRequired={true}>
								<Stack spacing={1} flex={2}>
									<FormLabel>{t("forms.burgers.fields.straatnaam")}</FormLabel>
									<Input onChange={bind("straatnaam")} value={data.straatnaam || ""} />
									<FormErrorMessage>{t("messages.burgerForm.invalidStraatnaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl id={"huisnummer"} isInvalid={!isFieldValid("huisnummer")} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.burgers.fields.huisnummer")}</FormLabel>
									<Input onChange={bind("huisnummer")} value={data.huisnummer || ""} />
									<FormErrorMessage>{t("messages.burgerForm.invalidHuisnummer")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl id={"postcode"} isInvalid={!isFieldValid("postcode")} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.burgers.fields.postcode")}</FormLabel>
									<Tooltip label={t("forms.burgers.tooltips.postcode")} aria-label={t("forms.burgers.fields.postcode")} placement={isMobile ? "top" : "left"}>
										<Input onChange={bind("postcode")} value={data.postcode || ""} />
									</Tooltip>
									<FormErrorMessage>{t("messages.burgerForm.invalidPostcode")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl id={"plaatsnaam"} isInvalid={!isFieldValid("plaatsnaam")} isRequired={true}>
								<Stack spacing={1} flex={2}>
									<FormLabel>{t("forms.burgers.fields.plaatsnaam")}</FormLabel>
									<Input onChange={bind("plaatsnaam")} value={data.plaatsnaam || ""} />
									<FormErrorMessage>{t("messages.burgerForm.invalidPlaatsnaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<FormControl id={"telefoonnummer"} isInvalid={!isFieldValid("telefoonnummer")} isRequired={true}>
							<Stack spacing={1}>
								<FormLabel>{t("forms.burgers.fields.telefoonnummer")}</FormLabel>
								<Tooltip label={t("forms.burgers.tooltips.telefoonnummer")} aria-label={t("forms.burgers.tooltips.telefoonnummer")} placement={isMobile ? "top" : "left"}>
									<Input onChange={bind("telefoonnummer")} value={data.telefoonnummer || ""} />
								</Tooltip>
								<FormErrorMessage>{t("messages.burgerForm.invalidTelefoonnummer")}</FormErrorMessage>
							</Stack>
						</FormControl>
						<FormControl id={"mail"} isInvalid={!isFieldValid("email")} isRequired={true}>
							<Stack spacing={1}>
								<FormLabel>{t("forms.burgers.fields.mail")}</FormLabel>
								<Input onChange={bind("email")} value={data.email || ""} />
								<FormErrorMessage>{t("messages.burgerForm.invalidEmail")}</FormErrorMessage>
							</Stack>
						</FormControl>
					</FormRight>
				</Stack>

				<Stack direction={["column", "row"]} spacing={2}>
					<FormLeft />
					<FormRight>
						<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
							<Button isLoading={isLoading} type={"submit"} colorScheme={"primary"} onClick={onSubmitForm}>{t("actions.save")}</Button>
						</Stack>
					</FormRight>
				</Stack>
			</Section>
		</Box>
	);
};

export default BurgerForm;