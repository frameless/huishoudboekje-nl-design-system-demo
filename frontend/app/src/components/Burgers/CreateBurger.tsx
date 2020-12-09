import {Box, Button, Divider, FormLabel, Heading, Input, Stack, Tooltip, useToast} from "@chakra-ui/react";
import moment from "moment";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useInput, useIsMobile, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {useCreateBurgerMutation} from "../../generated/graphql";
import {MOBILE_BREAKPOINT, Regex} from "../../utils/things";
import BackButton from "../BackButton";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";

// Todo: add more detailed error message per field?
const CreateBurger = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const isMobile = useIsMobile(MOBILE_BREAKPOINT);
	const toast = useToast();
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

	const initials = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const firstName = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const lastName = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const dateOfBirth = useInput({
		validate: [
			(v: string) => new RegExp(Regex.Date).test(v),
			(v: string) => moment(v, "L").isValid()
		]
	});
	const street = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const houseNumber = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const zipcode = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.ZipcodeNL).test(v)],
		placeholder: "1234AB"
	});
	const city = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const phoneNumber = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.PhoneNumberNL).test(v) || new RegExp(Regex.MobilePhoneNL).test(v)],
		placeholder: "0612345678"
	});
	const mail = useInput({
		defaultValue: "",
		validate: [Validators.required, Validators.email]
	});

	const [createBurger, $createBurger] = useCreateBurgerMutation();

	const onSubmit = (e) => {
		e.preventDefault();
		setIsSubmitted(true);

		const isFormValid = [
			initials,
			firstName,
			lastName,
			dateOfBirth,
			street,
			houseNumber,
			zipcode,
			city,
			phoneNumber,
			mail,
		].every(f => f.isValid);

		if (!isFormValid) {
			toast({
				status: "error",
				title: t("messages.burgers.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		createBurger({
			variables: {
				input: {
					voorletters: initials.value,
					voornamen: firstName.value,
					achternaam: lastName.value,
					geboortedatum: moment(dateOfBirth.value, "L").format("YYYY-MM-DD"),
					straatnaam: street.value,
					huisnummer: houseNumber.value,
					postcode: zipcode.value,
					plaatsnaam: city.value,
					telefoonnummer: phoneNumber.value,
					email: mail.value,
					// Todo: rekeningen?
				}
			}
		}).then(result => {
			toast({
				status: "success",
				title: t("messages.burgers.createSuccessMessage"),
				position: "top",
			});

			const {id} = result?.data?.createGebruiker?.gebruiker || {};
			if (id) {
				push(Routes.Burger(id));
			}
		}).catch(err => {
			console.error("Error:", err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				description: t("messages.genericError.description"),
				title: t("messages.genericError.title")
			});
		});
	};

	const isInvalid = (input) => (input.dirty || isSubmitted) && !input.isValid;

	return (<>
		<BackButton to={Routes.Burgers} />

		<Stack spacing={5}>
			<Heading size={"lg"}>{t("forms.burgers.title")}</Heading>

			<Box as={"form"} onSubmit={onSubmit}>
				<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft title={t("forms.burgers.sections.personal.title")} helperText={t("forms.burgers.sections.personal.helperText")} />
						<FormRight>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"initials"}>{t("forms.burgers.fields.initials")}</FormLabel>
									<Input isInvalid={isInvalid(initials)} {...initials.bind} id="initials" />
								</Stack>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"firstName"}>{t("forms.burgers.fields.firstName")}</FormLabel>
									<Input isInvalid={isInvalid(firstName)} {...firstName.bind} id="firstName" />
								</Stack>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"lastName"}>{t("forms.burgers.fields.lastName")}</FormLabel>
									<Input isInvalid={isInvalid(lastName)} {...lastName.bind} id="lastName" />
								</Stack>
							</Stack>
							<Stack spacing={1}>
								<FormLabel htmlFor={"dateOfBirth"}>{t("forms.burgers.fields.dateOfBirth")}</FormLabel>
								<DatePicker selected={moment(dateOfBirth.value, "L").isValid() ? moment(dateOfBirth.value, "L").toDate() : null} dateFormat={"dd-MM-yyyy"}
								            onChange={(value: Date) => {
									            if (value) {
										            dateOfBirth.setValue(moment(value).format("L"));
									            }
								            }} customInput={<Input type="text" isInvalid={isInvalid(dateOfBirth)} {...dateOfBirth.bind} />} />
							</Stack>
						</FormRight>
					</Stack>

					<Divider />

					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft title={t("forms.burgers.sections.contact.title")} helperText={t("forms.burgers.sections.contact.helperText")} />
						<FormRight>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"street"}>{t("forms.burgers.fields.street")}</FormLabel>
									<Input isInvalid={isInvalid(street)} {...street.bind} id="street" />
								</Stack>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"houseNumber"}>{t("forms.burgers.fields.houseNumber")}</FormLabel>
									<Input isInvalid={isInvalid(houseNumber)} {...houseNumber.bind} id="houseNumber" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"zipcode"}>{t("forms.burgers.fields.zipcode")}</FormLabel>
									<Tooltip label={t("forms.burgers.tooltips.zipcode")} aria-label={t("forms.burgers.tooltips.zipcode")} hasArrow
									         placement={isMobile ? "top" : "left"}>
										<Input isInvalid={isInvalid(zipcode)} {...zipcode.bind} id="zipcode" />
									</Tooltip>
								</Stack>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"city"}>{t("forms.burgers.fields.city")}</FormLabel>
									<Input isInvalid={isInvalid(city)} {...city.bind} id="city" />
								</Stack>
							</Stack>
							<Stack spacing={1}>
								<FormLabel htmlFor={"phoneNumber"}>{t("forms.burgers.fields.phoneNumber")}</FormLabel>
								<Tooltip label={t("forms.burgers.tooltips.phoneNumber")} aria-label={t("forms.burgers.fields.phoneNumber")} hasArrow
								         placement={isMobile ? "top" : "left"}>
									<Input isInvalid={isInvalid(phoneNumber)} {...phoneNumber.bind} id="phoneNumber" />
								</Tooltip>
							</Stack>
							<Stack spacing={1}>
								<FormLabel htmlFor={"mail"}>{t("forms.burgers.fields.mail")}</FormLabel>
								<Input isInvalid={isInvalid(mail)} {...mail.bind} id="mail" />
							</Stack>
						</FormRight>
					</Stack>

					<Divider />

					{/* Todo: Directly add rekeningen when creating new Burger */}

					<Divider />

					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft />
						<FormRight>
							<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
								<Button isLoading={$createBurger.loading} type={"submit"} colorScheme={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
							</Stack>
						</FormRight>
					</Stack>
				</Stack>
			</Box>
		</Stack>
	</>);
};

export default CreateBurger;