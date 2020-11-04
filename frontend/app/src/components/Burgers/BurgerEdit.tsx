import React, {useEffect} from "react";
import {Box, Button, Divider, FormHelperText, FormLabel, Heading, Input, Select, Spinner, Stack, Tooltip, useToast} from "@chakra-ui/core";
import {useInput, useIsMobile, useNumberInput, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Redirect, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import BackButton from "../BackButton";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import {Months, Regex} from "../../utils/things";
import {useMutation, useQuery} from "@apollo/client";
import {IGebruiker} from "../../models";
import {GetOneGebruikerQuery} from "../../services/graphql/queries";
import {UpdateGebruikerMutation} from "../../services/graphql/mutations";

const BurgerEdit = () => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const {id} = useParams();
	const toast = useToast();

	// const bsn = useInput<string>({
	// 	validate: [Validators.required, (v) => new RegExp(Regex.BsnNL).test(v)],
	// 	placeholder: "123456789"
	// });
	const initials = useInput<string>({
		validate: [Validators.required]
	});
	const firstName = useInput<string>({
		validate: [Validators.required]
	});
	const lastName = useInput<string>({
		validate: [Validators.required]
	});
	const dateOfBirth = {
		day: useNumberInput({
			validate: [(v) => new RegExp(/^[0-9]{1,2}$/).test(v.toString())],
			placeholder: t("forms.burgers.fields.dateOfBirthDay"),
			min: 1,
			max: 31,
		}),
		month: useNumberInput({
			validate: [(v) => new RegExp(/^[0-9]{1,2}$/).test(v.toString())],
			placeholder: t("forms.burgers.fields.dateOfBirthMonth"),
			min: 1, max: 12
		}),
		year: useNumberInput({
			validate: [(v) => new RegExp(/^[0-9]{4}$/).test(v.toString())],
			placeholder: t("forms.burgers.fields.dateOfBirthYear"),
			max: (new Date()).getFullYear(), // No future births.
		})
	};
	const mail = useInput<string>({
		validate: [Validators.required, Validators.email]
	});
	const street = useInput<string>({
		validate: [Validators.required]
	});
	const houseNumber = useInput<string>({
		validate: [Validators.required]
	});
	const zipcode = useInput<string>({
		validate: [Validators.required, (v) => new RegExp(Regex.ZipcodeNL).test(v)],
		placeholder: "1234AB"
	});
	const city = useInput<string>({
		validate: [Validators.required]
	});
	const phoneNumber = useInput<string>({
		validate: [(v) => new RegExp(Regex.PhoneNumberNL).test(v) || new RegExp(Regex.MobilePhoneNL).test(v)],
		placeholder: "0612345678"
	});
	// const iban = useInput({
	// 	validate: [Validators.required, (v) => IbanCheck.isValid(v)],
	// 	placeholder: !!TRANSLATE!!
	// });
	// const bankAccountHolder = useInput<string>({
	// 	validate: [Validators.required],
	// });

	const {data, loading, error} = useQuery<{ gebruiker: IGebruiker }>(GetOneGebruikerQuery, {
		variables: {id}
	});

	const [updateMutation, {loading: updateLoading}] = useMutation(UpdateGebruikerMutation);

	useEffect(() => {
		let mounted = true;

		if (mounted && data) {
			const {gebruiker} = data;

			if (gebruiker) {
				// bsn.setValue(gebruiker.bsn.toString() || "");
				initials.setValue(gebruiker.voorletters || "");
				firstName.setValue(gebruiker.voornamen || "");
				lastName.setValue(gebruiker.achternaam || "");
				dateOfBirth.day.setValue(new Date(gebruiker.geboortedatum).getDate());
				dateOfBirth.month.setValue(new Date(gebruiker.geboortedatum).getMonth() + 1);
				dateOfBirth.year.setValue(new Date(gebruiker.geboortedatum).getFullYear());
				mail.setValue(gebruiker.email || "");
				street.setValue(gebruiker.straatnaam || "");
				houseNumber.setValue(gebruiker.huisnummer || "");
				zipcode.setValue(gebruiker.postcode || "");
				city.setValue(gebruiker.plaatsnaam || "");
				phoneNumber.setValue(gebruiker.telefoonnummer || "");
				// iban.setValue(gebruiker.iban || "");
				// bankAccountHolder.setValue(gebruiker.rekeninghouder || "");
			}
		}

		return () => {
			mounted = false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, loading]);

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

		updateMutation({
			variables: {
				id,
				voorletters: initials.value,
				voornamen: firstName.value,
				achternaam: lastName.value,
				geboortedatum: [
					dateOfBirth.year.value,
					("0" + dateOfBirth.month.value).substr(-2, 2),
					("0" + dateOfBirth.day.value).substr(-2, 2),
				].join("-"),
				straatnaam: street.value,
				huisnummer: houseNumber.value,
				postcode: zipcode.value,
				plaatsnaam: city.value,
				telefoonnummer: phoneNumber.value,
				email: mail.value,
			}
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.burgers.updateSuccessMessage"),
				position: "top",
			});
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				description: t("messages.genericError.description"),
				title: t("messages.genericError.title")
			});
		})
	};

	return (<>
		<BackButton to={Routes.Burger(id)} />

		{loading && (
			<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
				<Spinner />
			</Stack>
		)}
		{!loading && error && (
			<Redirect to={Routes.NotFound} />
		)}
		{!loading && !error && data && (
			<Stack spacing={5}>
				<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
					<Heading size={"lg"}>{data.gebruiker.voornamen} {data.gebruiker.achternaam}</Heading>
				</Stack>

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
								{/*		<Input isInvalid={bsn.dirty && !bsn.isValid} {...bsn.bind} />*/}
								{/*	</Tooltip>*/}
								{/*</Stack>*/}
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"initials"}>{t("forms.burgers.fields.initials")}</FormLabel>
										<Input isInvalid={initials.dirty && !initials.isValid} {...initials.bind} />
									</Stack>
									<Stack spacing={1} flex={3}>
										<FormLabel htmlFor={"firstName"}>{t("forms.burgers.fields.firstName")}</FormLabel>
										<Input isInvalid={firstName.dirty && !firstName.isValid} {...firstName.bind} />
									</Stack>
									<Stack spacing={1} flex={3}>
										<FormLabel htmlFor={"lastName"}>{t("forms.burgers.fields.lastName")}</FormLabel>
										<Input isInvalid={lastName.dirty && !lastName.isValid} {...lastName.bind} />
									</Stack>
								</Stack>
								<Stack spacing={1}>
									<FormLabel htmlFor={"dateOfBirth"}>{t("forms.burgers.fields.dateOfBirth")}</FormLabel>
									<Stack direction={"row"} maxW="100%">
										<Box flex={1}>
											<Input isInvalid={dateOfBirth.day.dirty && !dateOfBirth.day.isValid} {...dateOfBirth.day.bind} id="dateOfBirth.day" />
										</Box>
										<Box flex={2}>
											<Select isInvalid={dateOfBirth.month.dirty && !dateOfBirth.month.isValid} {...dateOfBirth.month.bind} id="dateOfBirth.month"
											        value={parseInt(dateOfBirth.month.value.toString()).toString()}>
												{Months.map((m, i) => (
													<option key={i} value={i + 1}>{t("months." + m)}</option>
												))}
											</Select>
										</Box>
										<Box flex={1}>
											<Input isInvalid={dateOfBirth.year.dirty && !dateOfBirth.year.isValid} {...dateOfBirth.year.bind} id="dateOfBirth.year" />
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
										<Input isInvalid={street.dirty && !street.isValid} {...street.bind} />
									</Stack>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"houseNumber"}>{t("forms.burgers.fields.houseNumber")}</FormLabel>
										<Input isInvalid={houseNumber.dirty && !houseNumber.isValid} {...houseNumber.bind} />
									</Stack>
								</Stack>
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"zipcode"}>{t("forms.burgers.fields.zipcode")}</FormLabel>
										<Tooltip label={t("forms.burgers.tooltips.zipcode")} aria-label={t("forms.burgers.fields.zipcode")} hasArrow
										         placement={isMobile ? "top" : "left"}>
											<Input isInvalid={zipcode.dirty && !zipcode.isValid} {...zipcode.bind} />
										</Tooltip>
									</Stack>
									<Stack spacing={1} flex={2}>
										<FormLabel htmlFor={"city"}>{t("forms.burgers.fields.city")}</FormLabel>
										<Input isInvalid={city.dirty && !city.isValid} {...city.bind} />
									</Stack>
								</Stack>
								<Stack spacing={1}>
									<FormLabel htmlFor={"phoneNumber"}>{t("forms.burgers.fields.phoneNumber")}</FormLabel>
									<Tooltip label={t("forms.burgers.tooltips.phoneNumber")} aria-label={t("forms.burgers.tooltips.phoneNumber")} hasArrow
									         placement={isMobile ? "top" : "left"}>
										<Input isInvalid={phoneNumber.dirty && !phoneNumber.isValid} {...phoneNumber.bind} />
									</Tooltip>
								</Stack>
								<Stack spacing={1}>
									<FormLabel htmlFor={"mail"}>{t("forms.burgers.fields.mail")}</FormLabel>
									<Input isInvalid={mail.dirty && !mail.isValid} {...mail.bind} />
								</Stack>
							</FormRight>
						</Stack>

						<Divider />

						<Stack direction={isMobile ? "column" : "row"} spacing={2}>
							<FormLeft />
							<FormRight>
								<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
									<Button isLoading={loading || updateLoading} type={"submit"} variantColor={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
								</Stack>
							</FormRight>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		)}
	</>);
};

export default BurgerEdit;