import {Box, Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Stack, Tooltip, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import {Burger} from "../../generated/graphql";
import dayjs from "../../utils/dayjs";
import d from "../../utils/dayjs";
import {Regex} from "../../utils/things";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import {FormLeft, FormRight} from "../shared/Forms";
import Section from "../shared/Section";
import Asterisk from "../shared/Asterisk";

// t("messages.burgers.invalidGeboortedatum")
const validator = zod.object({
	bsn: zod.string().regex(/^([0-9]{8,9})$/),
	voorletters: zod.string().regex(/^([A-Z]\.)+$/),
	voornamen: zod.string().nonempty().refine(v => v.trim().length > 0).transform(v => v.trim()),
	achternaam: zod.string().nonempty().refine(v => v.trim().length > 0).transform(v => v.trim()),
	geboortedatum: zod.string().regex(Regex.Date).refine(strval => dayjs(strval, "L").isSameOrBefore(dayjs()), {message: "messages.burgers.invalidGeboortedatum"}),
	email: zod.string().nonempty().email(),
	straatnaam: zod.string().nonempty().refine(v => v.trim().length > 0).transform(v => v.trim()),
	huisnummer: zod.string().nonempty().refine(v => v.trim().length > 0).transform(v => v.trim()),
	postcode: zod.string().regex(Regex.ZipcodeNL),
	plaatsnaam: zod.string().nonempty().refine(v => v.trim().length > 0).transform(v => v.trim()),
	telefoonnummer: zod.union([
		zod.string().regex(Regex.MobilePhoneNL),
		zod.string().regex(Regex.PhoneNumberNL),
	]),
});

type BurgerFormProps = {
    burger?: Burger,
    onSubmit: Function,
    isLoading: boolean,
    isBsnValid?: boolean,
}

const BurgerForm: React.FC<BurgerFormProps> = ({burger, onSubmit, isLoading, isBsnValid = true}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const toast = useToaster();
	const {bsn, voorletters, voornamen, achternaam, geboortedatum, email, huisnummer, postcode, straatnaam, plaatsnaam, telefoonnummer} = burger || {};

	const [form, {updateForm, toggleSubmitted, isValid, isFieldValid}] = useForm<zod.infer<typeof validator>>({
		validator: validator,
		initialValue: {
			bsn: bsn?.toString(),
			voorletters,
			voornamen,
			achternaam,
			geboortedatum: d(geboortedatum, "YYYY-MM-DD").format("L"),
			email,
			huisnummer,
			postcode,
			straatnaam,
			plaatsnaam,
			telefoonnummer,
		},
	});

	const onSubmitForm = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		if (isValid()) {
			onSubmit(({
				...form,
				...burger?.id && {id: burger?.id},
				bsn: Number(form.bsn),
				geboortedatum: d(form.geboortedatum, "L").format("YYYY-MM-DD"),
			}));
			return;
		}

		toast.closeAll();
		toast({
			error: t("messages.formInputError"),
		});
	};

	return (
		<Box as={"form"} onSubmit={onSubmitForm}>
			<Section divider={<Divider />}>
				<Stack direction={["column", "row"]} spacing={2}>
					<FormLeft title={t("forms.burgers.sections.personal.title")} helperText={t("forms.burgers.sections.personal.helperText")} />
					<FormRight>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl id={"bsn"} isInvalid={!isFieldValid("bsn") || !isBsnValid} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.burgers.fields.bsn")}</FormLabel>
									<Input onChange={e => updateForm("bsn", e.target.value)} value={form.bsn || ""} />
									<FormErrorMessage>{t("messages.burgers.invalidBsn")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl id={"voorletters"} isInvalid={!isFieldValid("voorletters")} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.burgers.fields.voorletters")}</FormLabel>
									<Input onChange={e => updateForm("voorletters", e.target.value)} value={form.voorletters || ""} />
									<FormErrorMessage>{t("messages.burgers.invalidVoorletters")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl id={"voornamen"} isInvalid={!isFieldValid("voornamen")} isRequired={true}>
								<Stack spacing={1} flex={3}>
									<FormLabel>{t("forms.burgers.fields.voornamen")}</FormLabel>
									<Input onChange={e => updateForm("voornamen", e.target.value)} value={form.voornamen || ""} />
									<FormErrorMessage>{t("messages.burgers.invalidVoornamen")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl id={"achternaam"} isInvalid={!isFieldValid("achternaam")} isRequired={true}>
								<Stack spacing={1} flex={3}>
									<FormLabel>{t("forms.burgers.fields.achternaam")}</FormLabel>
									<Input onChange={e => updateForm("achternaam", e.target.value)} value={form.achternaam || ""} />
									<FormErrorMessage>{t("messages.burgers.invalidAchternaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<FormControl id={"geboortedatum"} isInvalid={!isFieldValid("geboortedatum")} isRequired={true}>
							<Stack spacing={1}>
								<FormLabel>{t("forms.burgers.fields.geboortedatum")}</FormLabel>
								<DatePicker selected={d(form.geboortedatum, "L").isValid() ? d(form.geboortedatum, "L").toDate() : null} dateFormat={"dd-MM-yyyy"} onChange={(value: Date) => {
									if (value) {
										updateForm("geboortedatum", d(value).format("L"));
									}
								}} customInput={<Input type={"text"} />} />
								<FormErrorMessage>{t("messages.burgers.invalidGeboortedatum")}</FormErrorMessage>
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
									<Input onChange={e => updateForm("straatnaam", e.target.value)} value={form.straatnaam || ""} />
									<FormErrorMessage>{t("messages.burgers.invalidStraatnaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl id={"huisnummer"} isInvalid={!isFieldValid("huisnummer")} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.burgers.fields.huisnummer")}</FormLabel>
									<Input onChange={e => updateForm("huisnummer", e.target.value)} value={form.huisnummer || ""} />
									<FormErrorMessage>{t("messages.burgers.invalidHuisnummer")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl id={"postcode"} isInvalid={!isFieldValid("postcode")} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.burgers.fields.postcode")}</FormLabel>
									<Tooltip label={t("forms.burgers.tooltips.postcode")} aria-label={t("forms.burgers.fields.postcode")} placement={isMobile ? "top" : "left"}>
										<Input onChange={e => updateForm("postcode", e.target.value)} value={form.postcode || ""} />
									</Tooltip>
									<FormErrorMessage>{t("messages.burgers.invalidPostcode")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl id={"plaatsnaam"} isInvalid={!isFieldValid("plaatsnaam")} isRequired={true}>
								<Stack spacing={1} flex={2}>
									<FormLabel>{t("forms.burgers.fields.plaatsnaam")}</FormLabel>
									<Input onChange={e => updateForm("plaatsnaam", e.target.value)} value={form.plaatsnaam || ""} />
									<FormErrorMessage>{t("messages.burgers.invalidPlaatsnaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<FormControl id={"telefoonnummer"} isInvalid={!isFieldValid("telefoonnummer")} isRequired={true}>
							<Stack spacing={1}>
								<FormLabel>{t("forms.burgers.fields.telefoonnummer")}</FormLabel>
								<Tooltip label={t("forms.burgers.tooltips.telefoonnummer")} aria-label={t("forms.burgers.tooltips.telefoonnummer")} placement={isMobile ? "top" : "left"}>
									<Input onChange={e => updateForm("telefoonnummer", e.target.value)} value={form.telefoonnummer || ""} />
								</Tooltip>
								<FormErrorMessage>{t("messages.burgers.invalidTelefoonnummer")}</FormErrorMessage>
							</Stack>
						</FormControl>
						<FormControl id={"mail"} isInvalid={!isFieldValid("email")} isRequired={true}>
							<Stack spacing={1}>
								<FormLabel>{t("forms.burgers.fields.mail")}</FormLabel>
								<Input onChange={e => updateForm("email", e.target.value)} value={form.email || ""} />
								<FormErrorMessage>{t("messages.burgers.invalidEmail")}</FormErrorMessage>
							</Stack>
						</FormControl>
					</FormRight>
				</Stack>

				<Stack direction={["column", "row"]} spacing={2}>
					<FormLeft />
					<FormRight>
						<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
							<Stack>
								<Button isLoading={isLoading} type={"submit"} colorScheme={"primary"} onClick={onSubmitForm}>{t("global.actions.save")}</Button>
								<Asterisk />
							</Stack>
						</Stack>
					</FormRight>
				</Stack>
			</Section>
		</Box>
	);
};

export default BurgerForm;