import {Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, Tooltip, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import {Burger, CreateBurgerMutationVariables} from "../../generated/graphql";
import d from "../../utils/dayjs";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import useBurgerValidator from "../../validators/useBurgerValidator";
import Asterisk from "../shared/Asterisk";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";

type BurgerFormProps = {
	burger?: Burger,
	onSubmit: (data: CreateBurgerMutationVariables["input"]) => void,
	isLoading: boolean,
	isBsnValid?: boolean,
}

const BurgerForm: React.FC<BurgerFormProps> = ({burger, onSubmit, isLoading, isBsnValid = true}) => {
	const validator = useBurgerValidator();
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const toast = useToaster();
	const {bsn, voorletters, voornamen, achternaam, geboortedatum, email, huisnummer, postcode, straatnaam, plaatsnaam, telefoonnummer} = burger || {};

	const [form, {updateForm, toggleSubmitted, isFieldValid}] = useForm<zod.infer<typeof validator>>({
		validator: validator,
		initialValue: {
			bsn: bsn?.toString(),
			voorletters,
			voornamen,
			achternaam,
			geboortedatum: geboortedatum ? d(geboortedatum, "YYYY-MM-DD").format("L") : null,
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

		try {
			const data = validator.parse(form);

			// Todo: GraphQL doesn't understand undefined, the solution is to explicitly set a field to null
			//  but gen-types doesn't understand null (12-12-2022)
			// @ts-ignore
			onSubmit({
				...data,
				...burger?.id && {id: burger?.id},
				bsn: Number(data.bsn),
				geboortedatum: d(data.geboortedatum, "L").isValid() ? d(data.geboortedatum, "L").format("YYYY-MM-DD") : null,
			});
		}
		catch (err) {
			toast.closeAll();
			toast({
				error: t("messages.formInputError"),
			});
		}
	};

	return (
		<Box as={"form"} onSubmit={onSubmitForm}>
			<SectionContainer>
				<Section title={t("forms.burgers.sections.personal.title")} helperText={t("forms.burgers.sections.personal.helperText")}>
					<Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl id={"bsn"} isInvalid={!isFieldValid("bsn") || !isBsnValid} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.burgers.fields.bsn")}</FormLabel>
									<Input
										autoComplete="no"
										aria-autocomplete="none"
										onChange={e => updateForm("bsn", e.target.value)}
										value={form.bsn || ""}
									/>
									<FormErrorMessage>{t("messages.burgers.invalidBsn")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl id={"voorletters"} isInvalid={!isFieldValid("voorletters")} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.burgers.fields.voorletters")}</FormLabel>
									<Input
									 	autoComplete="no"
										aria-autocomplete="none"
										onChange={e => updateForm("voorletters", e.target.value)}
										value={form.voorletters || ""}
										onBlur={e => updateForm("voorletters", e.target.value.replaceAll(/[^A-Za-zÀ-ž]/g, "").toUpperCase().split("").join(".") + ".")} 
									/>
									<FormErrorMessage>{t("messages.burgers.invalidVoorletters")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl id={"voornamen"} isInvalid={!isFieldValid("voornamen")} isRequired={true}>
								<Stack spacing={1} flex={3}>
									<FormLabel>{t("forms.burgers.fields.voornamen")}</FormLabel>
									<Input
										onChange={e => updateForm("voornamen", e.target.value)}
										value={form.voornamen || ""}
										autoComplete="no"
										aria-autocomplete="none"
									/>
									<FormErrorMessage>{t("messages.burgers.invalidVoornamen")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl id={"achternaam"} isInvalid={!isFieldValid("achternaam")} isRequired={true}>
								<Stack spacing={1} flex={3}>
									<FormLabel>{t("forms.burgers.fields.achternaam")}</FormLabel>
									<Input
										onChange={e => updateForm("achternaam", e.target.value)}
										value={form.achternaam || ""}
										autoComplete="no"
										aria-autocomplete="none"
									/>
									<FormErrorMessage>{t("messages.burgers.invalidAchternaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<FormControl id={"geboortedatum"} isInvalid={!isFieldValid("geboortedatum")} >
							<Stack spacing={1}>
								<FormLabel>{t("forms.burgers.fields.geboortedatum")}</FormLabel>
								<DatePicker
									selected={d(form.geboortedatum, "L").isValid() ? d(form.geboortedatum, "L").toDate() : null}
									autoComplete="no"
									aria-autocomplete="none"
									dateFormat={"dd-MM-yyyy"}
									isClearable={true}
									showYearDropdown
									dropdownMode={"select"}
									onChange={(value) => {
										if(value){
											updateForm("geboortedatum", d(value).format("L"));
										}
										else {
											updateForm("geboortedatum", null);
										}
									}} customInput={<Input type={"text"} autoComplete="no" aria-autocomplete="none" />} />
								<FormErrorMessage>{t("messages.burgers.invalidGeboortedatum")}</FormErrorMessage>
							</Stack>
						</FormControl>
					</Stack>
				</Section>

				<Section title={t("forms.burgers.sections.contact.title")} helperText={t("forms.burgers.sections.contact.helperText")}>
					<Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl id={"straatnaam"} isInvalid={!isFieldValid("straatnaam")} isRequired={true}>
								<Stack spacing={1} flex={2}>
									<FormLabel>{t("forms.burgers.fields.straatnaam")}</FormLabel>
									<Input
										onChange={e => updateForm("straatnaam", e.target.value)}
										value={form.straatnaam || ""}
										autoComplete="no"
										aria-autocomplete="none"
									/>
									<FormErrorMessage>{t("messages.burgers.invalidStraatnaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl id={"huisnummer"} isInvalid={!isFieldValid("huisnummer")} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.burgers.fields.huisnummer")}</FormLabel>
									<Input
										onChange={e => updateForm("huisnummer", e.target.value)}
										value={form.huisnummer || ""}
										autoComplete="no"
										aria-autocomplete="none"
									/>
									<FormErrorMessage>{t("messages.burgers.invalidHuisnummer")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<Stack spacing={2} direction={["column", "row"]}>
							<FormControl id={"postcode"} isInvalid={!isFieldValid("postcode")} isRequired={true}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("forms.burgers.fields.postcode")}</FormLabel>
									<Tooltip label={t("forms.burgers.tooltips.postcode")} aria-label={t("forms.burgers.fields.postcode")} placement={isMobile ? "top" : "left"}>
										<Input
											onChange={e => updateForm("postcode", e.target.value)}
											value={form.postcode || ""}
											onBlur={e => updateForm("postcode", e.target.value.replaceAll(/[^A-Za-z0-9]|[\s]/g, "").toUpperCase())}
											autoComplete="no"
											aria-autocomplete="none"
										/>
									</Tooltip>
									<FormErrorMessage>{t("messages.burgers.invalidPostcode")}</FormErrorMessage>
								</Stack>
							</FormControl>
							<FormControl id={"plaatsnaam"} isInvalid={!isFieldValid("plaatsnaam")} isRequired={true}>
								<Stack spacing={1} flex={2}>
									<FormLabel>{t("forms.burgers.fields.plaatsnaam")}</FormLabel>
									<Input
									 	autoComplete="no"
										aria-autocomplete="none"
										onChange={e => updateForm("plaatsnaam", e.target.value)} value={form.plaatsnaam || ""}
									/>
									<FormErrorMessage>{t("messages.burgers.invalidPlaatsnaam")}</FormErrorMessage>
								</Stack>
							</FormControl>
						</Stack>
						<FormControl id={"telefoonnummer"} isInvalid={!isFieldValid("telefoonnummer")}>
							<Stack spacing={1}>
								<FormLabel>{t("forms.burgers.fields.telefoonnummer")}</FormLabel>
								<Tooltip label={t("forms.burgers.tooltips.telefoonnummer")} aria-label={t("forms.burgers.tooltips.telefoonnummer")} placement={isMobile ? "top" : "left"}>
									<Input
										onChange={e => updateForm("telefoonnummer", e.target.value || null)}
										value={form.telefoonnummer || ""}
										autoComplete="no"
										aria-autocomplete="none"
									/>
								</Tooltip>
								<FormErrorMessage>{t("messages.burgers.invalidTelefoonnummer")}</FormErrorMessage>
							</Stack>
						</FormControl>
						<FormControl id={"mail"} isInvalid={!isFieldValid("email")}>
							<Stack spacing={1}>
								<FormLabel>{t("forms.burgers.fields.mail")}</FormLabel>
								<Input
									onChange={e => updateForm("email", e.target.value || null)}
									value={form.email || ""}
									autoComplete="no"
									aria-autocomplete="none"
								/>
								<FormErrorMessage>{t("messages.burgers.invalidEmail")}</FormErrorMessage>
							</Stack>
						</FormControl>
					</Stack>
				</Section>

				<Stack align={"flex-end"}>
					<Button isLoading={isLoading} type={"submit"} colorScheme={"primary"} onClick={onSubmitForm}>{t("global.actions.save")}</Button>
					<Asterisk />
				</Stack>
			</SectionContainer>
		</Box>
	);
};

export default BurgerForm;
