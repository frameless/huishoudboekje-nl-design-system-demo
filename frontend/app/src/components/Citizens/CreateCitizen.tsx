import React from "react";
import {useTranslation} from "react-i18next";
import {Box, Button, Divider, Flex, FormHelperText, FormLabel, Heading, Input, Stack, Tooltip, useToast} from "@chakra-ui/core";
import {useInput, useIsMobile, useNumberInput, useToggle, Validators} from "react-grapple";
import BackButton from "../BackButton";
import Routes from "../../config/routes";
import {MOBILE_BREAKPOINT, Regex} from "../../utils/things";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import {useMutation} from "@apollo/client";
import {CreateGebruikerMutation} from "../../services/graphql";
import {sampleData} from "../../config/sampleData/sampleData";
import {useHistory} from "react-router-dom";

// Todo: add more detailed error message per field?
const CreateCitizen = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const isMobile = useIsMobile(MOBILE_BREAKPOINT);
	const toast = useToast();

	const [isSubmitted, toggleSubmitted] = useToggle();

	// const bsn = useInput<string>({
	// 	defaultValue: "",
	// 	validate: [Validators.required, (v) => new RegExp(Regex.BsnNL).test(v)],
	// 	placeholder: "123456789"
	// });
	const initials = useInput<string>({
		defaultValue: "",
		validate: [Validators.required]
	});
	const firstName = useInput<string>({
		defaultValue: "",
		validate: [Validators.required]
	});
	const lastName = useInput<string>({
		defaultValue: "",
		validate: [Validators.required]
	});
	const dateOfBirth = {
		day: useNumberInput({
			validate: [(v) => new RegExp(/^[0-9]{2}$/).test(v.toString())],
			placeholder: t("forms.dateOfBirth.day"),
			min: 1,
			max: 31,
		}),
		month: useNumberInput({
			validate: [(v) => new RegExp(/^[0-9]{1,2}$/).test(v.toString())],
			placeholder: t("forms.dateOfBirth.month"),
			min: 1, max: 12
		}),
		year: useNumberInput({
			validate: [(v) => new RegExp(/^[0-9]{4}$/).test(v.toString())],
			placeholder: t("forms.dateOfBirth.year"),
			max: (new Date()).getFullYear(), // No future births.
		})
	}
	const street = useInput<string>({
		defaultValue: "",
		validate: [Validators.required]
	});
	const houseNumber = useInput<string>({
		defaultValue: "",
		validate: [Validators.required]
	});
	const zipcode = useInput<string>({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.ZipcodeNL).test(v)],
		placeholder: "1234AB"
	});
	const city = useInput<string>({
		defaultValue: "",
		validate: [Validators.required]
	});
	const phoneNumber = useInput<string>({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.PhoneNumberNL).test(v) || new RegExp(Regex.MobilePhoneNL).test(v)],
		placeholder: "0612345678"
	});
	const mail = useInput<string>({
		defaultValue: "",
		validate: [Validators.required, Validators.email]
	});
	const iban = useInput<string>({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.IbanNL).test(v)],
		placeholder: t("forms.iban-placeholder")
	});

	const [createGebruiker, {loading}] = useMutation(CreateGebruikerMutation);

	// TODO: remove this before commit
	const prePopulateForm = () => {
		const c = sampleData.citizens[(Math.ceil(Math.random() * sampleData.citizens.length))];

		initials.setValue(c.initials);
		firstName.setValue(c.firstName);
		lastName.setValue(c.lastName);
		dateOfBirth.day.setValue(c.dateOfBirth.split("-")[0]);
		dateOfBirth.month.setValue(c.dateOfBirth.split("-")[1]);
		dateOfBirth.year.setValue(c.dateOfBirth.split("-")[2]);
		street.setValue(c.street);
		houseNumber.setValue(c.houseNumber);
		zipcode.setValue(c.zipcode);
		city.setValue(c.city);
		phoneNumber.setValue(c.phoneNumber.toString());
		mail.setValue(c.mail);
		iban.setValue(c.iban);
	}

	const onSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		const isFormValid = Object.values({firstName, lastName, mail, street, zipcode, city, phoneNumber, iban}).every(f => f.isValid);
		if (!isFormValid) {
			toast({
				status: "error",
				title: t("forms.citizens.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		createGebruiker({
			variables: {
				voorletters: initials.value,
				voornamen: firstName.value,
				achternaam: lastName.value,
				geboortedatum: [dateOfBirth.year, dateOfBirth.month, dateOfBirth.day].map(d => d.value).join("-"),
				straatnaam: street.value,
				huisnummer: houseNumber.value,
				postcode: zipcode.value,
				woonplaatsnaam: city.value,
				telefoonnummer: phoneNumber.value,
				email: mail.value,
				iban: iban.value,
			}
		}).then(result => {
			toast({
				status: "success",
				title: t("forms.citizens.successMessage"),
				position: "top",
			});

			const {id} = result.data.createGebruiker.gebruiker;
			if (id) {
				push(Routes.Citizen(id));
			}
		}).catch(err => {
			console.log("Error:", err);
		});
	};

	const isInvalid = (input) => isSubmitted && !input.isValid;

	return (<>
		<BackButton to={Routes.Citizens} />

		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Stack>
					<Heading size={"lg"}>{t("forms.citizens.title")}</Heading>
				</Stack>
			</Stack>

			{process.env.NODE_ENV === "development" && (
				<Flex justifyContent={"center"}>
					<Button maxWidth={350} variantColor={"yellow"} variant={"outline"} onClick={() => prePopulateForm()}>Formulier snel invullen met testdata</Button>
				</Flex>
			)}

			<Box as={"form"} onSubmit={onSubmit}>
				<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft>
							<Heading size={"md"}>{t("personal")}</Heading>
							<FormHelperText id="personal-helperText">{t("forms.citizens.personal-helperText")}</FormHelperText>
						</FormLeft>
						<FormRight>
							{/*<Stack spacing={1}>*/}
							{/*	<FormLabel htmlFor={"bsn"}>{t("bsn")}</FormLabel>*/}
							{/*	<Tooltip label={t("forms.bsn-tooltip")} aria-label={t("bsn")} hasArrow placement={isMobile ? "top" : "left"}>*/}
							{/*		<Input isInvalid={isInvalid(bsn)} {...bsn.bind} id="bsn" />*/}
							{/*	</Tooltip>*/}
							{/*</Stack>*/}
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"initials"}>{t("initials")}</FormLabel>
									<Input isInvalid={isInvalid(initials)} {...initials.bind} id="initials" />
								</Stack>
								<Stack spacing={1} flex={3}>
									<FormLabel htmlFor={"firstName"}>{t("firstName")}</FormLabel>
									<Input isInvalid={isInvalid(firstName)} {...firstName.bind} id="firstName" />
								</Stack>
								<Stack spacing={1} flex={3}>
									<FormLabel htmlFor={"lastName"}>{t("lastName")}</FormLabel>
									<Input isInvalid={isInvalid(lastName)} {...lastName.bind} id="lastName" />
								</Stack>
							</Stack>
							<Stack spacing={1}>
								<FormLabel htmlFor={"dateOfBirth"}>{t("dateOfBirth")}</FormLabel>
								<Stack direction={"row"} maxW="100%">
									<Box flex={1}>
										<Input isInvalid={isInvalid(dateOfBirth.day)} {...dateOfBirth.day.bind} id="dateOfBirth.day" />
									</Box>
									<Box flex={1}>
										<Input isInvalid={isInvalid(dateOfBirth.month)} {...dateOfBirth.month.bind} id="dateOfBirth.month" />
									</Box>
									<Box flex={2}>
										<Input isInvalid={isInvalid(dateOfBirth.year)} {...dateOfBirth.year.bind} id="dateOfBirth.year" />
									</Box>
								</Stack>
							</Stack>
						</FormRight>
					</Stack>

					<Divider />

					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft>
							<Heading size={"md"}>{t("contact")}</Heading>
							<FormHelperText>{t("forms.citizens.contact-helperText")}</FormHelperText>
						</FormLeft>
						<FormRight>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"street"}>{t("street")}</FormLabel>
									<Input isInvalid={isInvalid(street)} {...street.bind} id="street" />
								</Stack>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"houseNumber"}>{t("houseNumber")}</FormLabel>
									<Input isInvalid={isInvalid(houseNumber)} {...houseNumber.bind} id="houseNumber" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"zipcode"}>{t("zipcode")}</FormLabel>
									<Tooltip label={t("forms.zipcode-tooltip")} aria-label={t("zipcode")} hasArrow placement={isMobile ? "top" : "left"}>
										<Input isInvalid={isInvalid(zipcode)} {...zipcode.bind} id="zipcode" />
									</Tooltip>
								</Stack>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"city"}>{t("city")}</FormLabel>
									<Input isInvalid={isInvalid(city)} {...city.bind} id="city" />
								</Stack>
							</Stack>
							<Stack spacing={1}>
								<FormLabel htmlFor={"phoneNumber"}>{t("phoneNumber")}</FormLabel>
								<Tooltip label={t("forms.phoneNumber-tooltip")} aria-label={t("phoneNumber")} hasArrow placement={isMobile ? "top" : "left"}>
									<Input isInvalid={isInvalid(phoneNumber)} {...phoneNumber.bind} id="phoneNumber" />
								</Tooltip>
							</Stack>
							<Stack spacing={1}>
								<FormLabel htmlFor={"mail"}>{t("mail")}</FormLabel>
								<Input isInvalid={isInvalid(mail)} {...mail.bind} id="mail" aria-describedby="mail-helper-text" />
							</Stack>
						</FormRight>
					</Stack>

					<Divider />

					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft>
							<Heading size={"md"}>{t("banking")}</Heading>
							<FormHelperText id="banking-helperText">{t("forms.citizens.banking-helperText")}</FormHelperText>
						</FormLeft>
						<FormRight>
							<Stack spacing={1}>
								<FormLabel htmlFor={"iban"}>{t("iban")}</FormLabel>
								<Tooltip label={t("forms.iban-tooltip")} aria-label={t("iban")} hasArrow placement={isMobile ? "top" : "left"}>
									<Input isInvalid={isInvalid(iban)} {...iban.bind} id="iban" />
								</Tooltip>
							</Stack>
						</FormRight>
					</Stack>

					<Divider />

					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft />
						<FormRight>
							<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
								<Button isLoading={loading} type={"submit"} variantColor={"primary"} onClick={onSubmit}>{t("save")}</Button>
							</Stack>
						</FormRight>
					</Stack>
				</Stack>
			</Box>
		</Stack>
	</>);
};

export default CreateCitizen;