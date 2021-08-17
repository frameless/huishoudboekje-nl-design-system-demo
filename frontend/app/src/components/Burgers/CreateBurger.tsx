import {Box, Button, Divider, FormControl, FormLabel, Input, Stack, Tooltip, useBreakpointValue} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useInput, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {GetBurgersDocument, GetHuishoudensDocument, useCreateBurgerMutation} from "../../generated/graphql";
import d from "../../utils/dayjs";
import {Regex} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import BackButton from "../Layouts/BackButton";
import {FormLeft, FormRight} from "../Layouts/Forms";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";

const CreateBurger = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const toast = useToaster();
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

	const bsn = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});
	const voorletters = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});
	const voornamen = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});
	const achternaam = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});
	const geboortedatum = useInput({
		validate: [
			(v: string) => new RegExp(Regex.Date).test(v),
			(v: string) => d(v, "L").isValid(),
		],
	});
	const straatnaam = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});
	const huisnummer = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});
	const postcode = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.ZipcodeNL).test(v)],
		placeholder: "1234AB",
	});
	const plaatsnaam = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});
	const telefoonnummer = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.PhoneNumberNL).test(v) || new RegExp(Regex.MobilePhoneNL).test(v)],
		placeholder: "0612345678",
	});
	const mail = useInput({
		defaultValue: "",
		validate: [Validators.required, Validators.email],
	});

	const [createBurger, $createBurger] = useCreateBurgerMutation();

	const onSubmit = (e) => {
		e.preventDefault();
		setIsSubmitted(true);

		const isFormValid = [
			bsn,
			voorletters,
			voornamen,
			achternaam,
			geboortedatum,
			straatnaam,
			huisnummer,
			postcode,
			plaatsnaam,
			telefoonnummer,
			mail,
		].every(f => f.isValid);

		if (!isFormValid) {
			toast({
				error: t("messages.burgers.invalidFormMessage"),
			});
			return;
		}

		createBurger({
			variables: {
				input: {
					bsn: parseInt(bsn.value),
					voorletters: voorletters.value,
					voornamen: voornamen.value,
					achternaam: achternaam.value,
					geboortedatum: d(geboortedatum.value, "L").format("YYYY-MM-DD"),
					straatnaam: straatnaam.value,
					huisnummer: huisnummer.value,
					postcode: postcode.value,
					plaatsnaam: plaatsnaam.value,
					telefoonnummer: telefoonnummer.value,
					email: mail.value,
				},
			},
			refetchQueries: [
				{ query: GetHuishoudensDocument },
				{ query: GetBurgersDocument }
			]
		}).then(result => {
			toast({
				success: t("messages.burgers.createSuccessMessage"),
			});

			const {id} = result?.data?.createBurger?.burger || {};
			if (id) {
				push(Routes.Burger(id));
			}
		}).catch(err => {
			console.error(err);

			let message = err.message;
			if (err.message.includes("already exists")) {
				message = t("messages.burger.alreadyExists");
			}
			if (err.message.includes("BSN should consist of 8 or 9 digits")) {
				message = t("messages.burger.bsnLengthError");
			}
			if (err.message.includes("BSN does not meet the 11-proef requirement")) {
				message = t("messages.burger.bsnElfProefError");
			}

			toast({
				error: message,
			});
		});
	};

	const isInvalid = (input) => (input.dirty || isSubmitted) && !input.isValid;

	return (
		<Page title={t("forms.createBurger.title")} backButton={<BackButton to={Routes.Burgers} />}>
			<Box as={"form"} onSubmit={onSubmit}>
				<Section divider={<Divider />}>
					<Stack direction={["column", "row"]} spacing={2}>
						<FormLeft title={t("forms.burgers.sections.personal.title")} helperText={t("forms.burgers.sections.personal.helperText")} />
						<FormRight>
							<Stack spacing={2} direction={["column", "row"]}>
								<FormControl id={"bsn"} isRequired={true}>
									<Stack spacing={1} flex={1}>
										<FormLabel>{t("forms.burgers.fields.bsn")}</FormLabel>
										<Input isRequired={true} isInvalid={isInvalid(bsn)} {...bsn.bind} />
									</Stack>
								</FormControl>
							</Stack>
							<Stack spacing={2} direction={["column", "row"]}>
								<FormControl id={"voorletters"} isRequired={true}>
									<Stack spacing={1} flex={1}>
										<FormLabel>{t("forms.burgers.fields.voorletters")}</FormLabel>
										<Input isRequired={true} isInvalid={isInvalid(voorletters)} {...voorletters.bind} />
									</Stack>
								</FormControl>
								<FormControl id={"voornamen"} isRequired={true}>
									<Stack spacing={1} flex={2}>
										<FormLabel>{t("forms.burgers.fields.voornamen")}</FormLabel>
										<Input isInvalid={isInvalid(voornamen)} {...voornamen.bind} />
									</Stack>
								</FormControl>
								<FormControl id={"achternaam"} isRequired={true}>
									<Stack spacing={1} flex={2}>
										<FormLabel>{t("forms.burgers.fields.achternaam")}</FormLabel>
										<Input isInvalid={isInvalid(achternaam)} {...achternaam.bind} />
									</Stack>
								</FormControl>
							</Stack>
							<FormControl id={"geboortedatum"} isRequired={true}>
								<Stack spacing={1}>
									<FormLabel>{t("forms.burgers.fields.geboortedatum")}</FormLabel>
									<DatePicker selected={d(geboortedatum.value, "L").isValid() ? d(geboortedatum.value, "L").toDate() : null} dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											if (value) {
												geboortedatum.setValue(d(value).format("L"));
											}
										}} customInput={<Input type="text" isInvalid={isInvalid(geboortedatum)} {...geboortedatum.bind} />} />
								</Stack>
							</FormControl>
						</FormRight>
					</Stack>

					<Stack direction={["column", "row"]} spacing={2}>
						<FormLeft title={t("forms.burgers.sections.contact.title")} helperText={t("forms.burgers.sections.contact.helperText")} />
						<FormRight>
							<Stack spacing={2} direction={["column", "row"]}>
								<FormControl id={"straatnaam"} isRequired={true}>
									<Stack spacing={1} flex={2}>
										<FormLabel>{t("forms.burgers.fields.straatnaam")}</FormLabel>
										<Input isInvalid={isInvalid(straatnaam)} {...straatnaam.bind} />
									</Stack>
								</FormControl>
								<FormControl id={"huisnummer"} isRequired={true}>
									<Stack spacing={1} flex={1}>
										<FormLabel>{t("forms.burgers.fields.huisnummer")}</FormLabel>
										<Input isInvalid={isInvalid(huisnummer)} {...huisnummer.bind} />
									</Stack>
								</FormControl>
							</Stack>
							<Stack spacing={2} direction={["column", "row"]}>
								<FormControl id={"postcode"} isRequired={true}>
									<Stack spacing={1} flex={1}>
										<FormLabel>{t("forms.burgers.fields.postcode")}</FormLabel>
										<Tooltip label={t("forms.burgers.tooltips.postcode")} aria-label={t("forms.burgers.tooltips.postcode")} placement={isMobile ? "top" : "left"}>
											<Input isInvalid={isInvalid(postcode)} {...postcode.bind} />
										</Tooltip>
									</Stack>
								</FormControl>
								<FormControl id={"plaatsnaam"} isRequired={true}>
									<Stack spacing={1} flex={2}>
										<FormLabel>{t("forms.burgers.fields.plaatsnaam")}</FormLabel>
										<Input isInvalid={isInvalid(plaatsnaam)} {...plaatsnaam.bind} />
									</Stack>
								</FormControl>
							</Stack>
							<FormControl id={"telefoonnummer"} isRequired={true}>
								<Stack spacing={1}>
									<FormLabel>{t("forms.burgers.fields.telefoonnummer")}</FormLabel>
									<Tooltip label={t("forms.burgers.tooltips.telefoonnummer")} aria-label={t("forms.burgers.fields.telefoonnummer")} placement={isMobile ? "top" : "left"}>
										<Input isInvalid={isInvalid(telefoonnummer)} {...telefoonnummer.bind} />
									</Tooltip>
								</Stack>
							</FormControl>
							<FormControl id={"mail"} isRequired={true}>
								<Stack spacing={1}>
									<FormLabel>{t("forms.burgers.fields.mail")}</FormLabel>
									<Input isInvalid={isInvalid(mail)} {...mail.bind} />
								</Stack>
							</FormControl>
						</FormRight>
					</Stack>

					<Stack direction={["column", "row"]} spacing={2}>
						<FormLeft />
						<FormRight>
							<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
								<Button isLoading={$createBurger.loading} type={"submit"} colorScheme={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
							</Stack>
						</FormRight>
					</Stack>
				</Section>
			</Box>
		</Page>
	);
};

export default CreateBurger;