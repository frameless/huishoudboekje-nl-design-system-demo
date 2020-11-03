import React, { useState } from "react";
import {useTranslation} from "react-i18next";
import {Box, Button, Divider, FormHelperText, FormLabel, Heading, Input, Select, Stack, Tooltip, useToast} from "@chakra-ui/core";
import {useInput, useIsMobile, useNumberInput, Validators} from "react-grapple";
import BackButton from "../BackButton";
import Routes from "../../config/routes";
import {isDev, MOBILE_BREAKPOINT, Months, Regex} from "../../utils/things";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import {useMutation} from "@apollo/client";
import {sampleData} from "../../config/sampleData/sampleData";
import {useHistory} from "react-router-dom";
import {CreateGebruikerMutation} from "../../services/graphql/mutations";
import RekeningenList from "../Rekeningen/RekeningenList";
import { IRekening } from "../../models";

// Todo: add more detailed error message per field?
const CreateBurger = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const isMobile = useIsMobile(MOBILE_BREAKPOINT);
	const toast = useToast();
	const [rekeningen, setRekeningen] = useState<IRekening[]>([])
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
			validate: [(v) => new RegExp(/^[0-9]{1,2}$/).test(v.toString())],
			placeholder: t("forms.common.fields.dateDay"),
			min: 1,
			max: 31,
		}),
		month: useNumberInput({
			validate: [(v) => new RegExp(/^[0-9]{1,2}$/).test(v.toString())],
			placeholder: t("forms.common.fields.dateMonth"),
			min: 1, max: 12
		}),
		year: useNumberInput({
			validate: [(v) => new RegExp(/^[0-9]{4}$/).test(v.toString())],
			placeholder: t("forms.common.fields.dateYear"),
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

	const [createGebruiker, {loading}] = useMutation(CreateGebruikerMutation);

	const prePopulateForm = () => {
		const c = sampleData.burgers[(Math.floor(Math.random() * sampleData.burgers.length))];
		const geboorteDatum: Date = new Date(c.dateOfBirth)

		initials.setValue(c.initials);
		firstName.setValue(c.firstName);
		lastName.setValue(c.lastName);
		dateOfBirth.day.setValue(geboorteDatum.getDate());
		dateOfBirth.month.setValue(geboorteDatum.getMonth() + 1);
		dateOfBirth.year.setValue(geboorteDatum.getFullYear());
		street.setValue(c.street);
		houseNumber.setValue(c.houseNumber);
		zipcode.setValue(c.zipcode);
		city.setValue(c.city);
		phoneNumber.setValue(c.phoneNumber.toString());
		mail.setValue(c.mail);
	}

	const onSubmit = (e) => {
		e.preventDefault();

		const isFormValid = [
			initials,
			firstName,
			lastName,
			dateOfBirth.day,
			dateOfBirth.month,
			dateOfBirth.year,
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

		const geboorteDatum = new Date(Date.UTC(dateOfBirth.year.value, dateOfBirth.month.value - 1, dateOfBirth.day.value));
		createGebruiker({
			variables: {
				input: {
					voorletters: initials.value,
					voornamen: firstName.value,
					achternaam: lastName.value,
					geboortedatum: geboorteDatum.toISOString().substring(0, 10),
					straatnaam: street.value,
					huisnummer: houseNumber.value,
					postcode: zipcode.value,
					plaatsnaam: city.value,
					telefoonnummer: phoneNumber.value,
					email: mail.value,
					rekeningen,
				}
			}
		}).then(result => {
			toast({
				status: "success",
				title: t("messages.burgers.createSuccessMessage"),
				position: "top",
			});

			const {id} = result.data.createGebruiker.gebruiker;
			if (id) {
				push(Routes.Burger(id));
			}
		}).catch(err => {
			console.log("Error:", err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				description: t("messages.genericError.description"),
				title: t("messages.genericError.title")
			});
		});
	};

	const isInvalid = (input) => input.dirty && !input.isValid;

	const onChangeRekeningen = (newRekeningen)=> {
		setRekeningen(newRekeningen)
	};

	return (<>
		<BackButton to={Routes.Burgers} />

		<Stack spacing={5}>
			<Heading size={"lg"}>{t("forms.burgers.title")}</Heading>

			{isDev && (
				<Button maxWidth={350} variantColor={"yellow"} variant={"outline"} onClick={() => prePopulateForm()}>Formulier snel invullen met testdata</Button>
			)}

			<Box as={"form"} onSubmit={onSubmit}>
				<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft>
							<Heading size={"md"}>{t("forms.burgers.sections.personal.title")}</Heading>
							<FormHelperText id="personal-helperText">{t("forms.burgers.sections.personal.helperText")}</FormHelperText>
						</FormLeft>
						<FormRight>
							{/*<Stack spacing={1}>*/}
							{/*	<FormLabel htmlFor={"bsn"}>{TRANSLATE}</FormLabel>*/}
							{/*	<Tooltip label={TRANSLATE} aria-label={TRANSLATE} hasArrow placement={isMobile ? "top" : "left"}>*/}
							{/*		<Input isInvalid={isInvalid(bsn)} {...bsn.bind} id="bsn" />*/}
							{/*	</Tooltip>*/}
							{/*</Stack>*/}
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"initials"}>{t("forms.burgers.fields.initials")}</FormLabel>
									<Input isInvalid={isInvalid(initials)} {...initials.bind} id="initials" />
								</Stack>
								<Stack spacing={1} flex={3}>
									<FormLabel htmlFor={"firstName"}>{t("forms.burgers.fields.firstName")}</FormLabel>
									<Input isInvalid={isInvalid(firstName)} {...firstName.bind} id="firstName" />
								</Stack>
								<Stack spacing={1} flex={3}>
									<FormLabel htmlFor={"lastName"}>{t("forms.burgers.fields.lastName")}</FormLabel>
									<Input isInvalid={isInvalid(lastName)} {...lastName.bind} id="lastName" />
								</Stack>
							</Stack>
							<Stack spacing={1}>
								<FormLabel htmlFor={"dateOfBirth"}>{t("forms.burgers.fields.dateOfBirth")}</FormLabel>
								<Stack direction={"row"} maxW="100%">
									<Box flex={1}>
										<Input isInvalid={isInvalid(dateOfBirth.day)} {...dateOfBirth.day.bind} id="dateOfBirth.day" />
									</Box>
									<Box flex={2}>
										<Select isInvalid={isInvalid(dateOfBirth.month)} {...dateOfBirth.month.bind} id="dateOfBirth.month"
										        value={parseInt(dateOfBirth.month.value.toString()).toString()}>
											{Months.map((m, i) => (
												<option key={i} value={i + 1}>{t("months." + m)}</option>
											))}
										</Select>
									</Box>
									<Box flex={1}>
										<Input isInvalid={isInvalid(dateOfBirth.year)} {...dateOfBirth.year.bind} id="dateOfBirth.year" />
									</Box>
								</Stack>
							</Stack>
						</FormRight>
					</Stack>

					<Divider />

					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft>
							<Heading size={"md"}>{t("forms.burgers.sections.contact.title")}</Heading>
							<FormHelperText>{t("forms.burgers.sections.contact.helperText")}</FormHelperText>
						</FormLeft>
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

					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<RekeningenList rekeningen={rekeningen} onChange={onChangeRekeningen} placeholderRekeninghouder={`${firstName.value} ${lastName.value}`.trim()}/>
					</Stack>

					<Divider />

					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft />
						<FormRight>
							<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
								<Button isLoading={loading} type={"submit"} variantColor={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
							</Stack>
						</FormRight>
					</Stack>
				</Stack>
			</Box>
		</Stack>
	</>);
};

export default CreateBurger;