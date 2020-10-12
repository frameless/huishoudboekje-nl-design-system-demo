import {Box, Button, Divider, FormHelperText, FormLabel, Heading, Input, Spinner, Stack, Tooltip, useToast} from "@chakra-ui/core";
import React, {useEffect} from "react";
import {useInput, useIsMobile, useNumberInput, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import Routes from "../../config/routes";
import BackButton from "../BackButton";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import {Regex} from "../../utils/things";
import {useQuery} from "@apollo/client";
import {GetOneGebruikerQuery} from "../../services/graphql";
import {IGebruiker} from "../../models";

const CitizenDetail = () => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const {id} = useParams();
	const toast = useToast();

	// const bsn = useInput<string>({
	//
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
	const iban = useInput<string>({
		validate: [Validators.required, (v) => new RegExp(Regex.IbanNL).test(v)],
		placeholder: t("forms.iban-placeholder")
	});

	const {data, loading} = useQuery<{ gebruiker: IGebruiker }>(GetOneGebruikerQuery, {
		variables: {id}
	});

	// Todo: API call
	const onSubmit = (e) => {
		e.preventDefault();
		toast({
			position: "top",
			status: "error",
			variant: "solid",
			description: t("genericError.description"),
			title: t("genericError.title")
		});
	};

	useEffect(() => {
		let mounted = true;

		if (mounted && data) {
			const {gebruiker} = data;

			// bsn.setValue(gebruiker.bsn.toString());
			initials.setValue(gebruiker.burger?.voorletters || "");
			firstName.setValue(gebruiker.burger?.voornamen || "");
			lastName.setValue(gebruiker.burger?.achternaam || "");
			dateOfBirth.day.setValue(new Date(gebruiker.geboortedatum).getDate());
			dateOfBirth.month.setValue(new Date(gebruiker.geboortedatum).getMonth() + 1);
			dateOfBirth.year.setValue(new Date(gebruiker.geboortedatum).getFullYear());
			mail.setValue(gebruiker.email);
			street.setValue(gebruiker.burger?.straatnaam || "");
			houseNumber.setValue(gebruiker.burger?.huisnummer || "");
			zipcode.setValue(gebruiker.burger?.postcode || "");
			city.setValue(gebruiker.burger?.woonplaatsnaam || "");
			phoneNumber.setValue(gebruiker.telefoonnummer);
			iban.setValue(gebruiker.iban);
		}

		return () => {
			mounted = false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, loading]);

	return (<>
		<BackButton to={Routes.Citizens} />

		{loading && (
			<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
				<Spinner />
			</Stack>
		)}
		{!loading && data && (
			<Stack spacing={5}>
				<Heading size={"lg"}>{data.gebruiker.burger?.voornamen} {data.gebruiker.burger?.achternaam}</Heading>

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
								{/*		<Input isInvalid={!bsn.isValid} {...bsn.bind} />*/}
								{/*	</Tooltip>*/}
								{/*</Stack>*/}
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"initials"}>{t("initials")}</FormLabel>
										<Input isInvalid={!initials.isValid} {...initials.bind} />
									</Stack>
									<Stack spacing={1} flex={3}>
										<FormLabel htmlFor={"firstName"}>{t("firstName")}</FormLabel>
										<Input isInvalid={!firstName.isValid} {...firstName.bind} />
									</Stack>
									<Stack spacing={1} flex={3}>
										<FormLabel htmlFor={"lastName"}>{t("lastName")}</FormLabel>
										<Input isInvalid={!lastName.isValid} {...lastName.bind} />
									</Stack>
								</Stack>
								<Stack spacing={1}>
									<FormLabel htmlFor={"dateOfBirth"}>{t("dateOfBirth")}</FormLabel>
									<Stack direction={"row"} maxW="100%">
										<Box flex={1}>
											<Input isInvalid={!dateOfBirth.day.isValid} {...dateOfBirth.day.bind} id="dateOfBirth.day" />
										</Box>
										<Box flex={1}>
											<Input isInvalid={!dateOfBirth.month.isValid} {...dateOfBirth.month.bind} id="dateOfBirth.month" />
										</Box>
										<Box flex={2}>
											<Input isInvalid={!dateOfBirth.year.isValid} {...dateOfBirth.year.bind} id="dateOfBirth.year" />
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
										<Input isInvalid={!street.isValid} {...street.bind} />
									</Stack>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"houseNumber"}>{t("houseNumber")}</FormLabel>
										<Input isInvalid={!houseNumber.isValid} {...houseNumber.bind} />
									</Stack>
								</Stack>
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"zipcode"}>{t("zipcode")}</FormLabel>
										<Tooltip label={t("forms.zipcode-tooltip")} aria-label={t("zipcode")} hasArrow placement={isMobile ? "top" : "left"}>
											<Input isInvalid={!zipcode.isValid} {...zipcode.bind} />
										</Tooltip>
									</Stack>
									<Stack spacing={1} flex={2}>
										<FormLabel htmlFor={"city"}>{t("city")}</FormLabel>
										<Input isInvalid={!city.isValid} {...city.bind} />
									</Stack>
								</Stack>
								<Stack spacing={1}>
									<FormLabel htmlFor={"phoneNumber"}>{t("phoneNumber")}</FormLabel>
									<Tooltip label={t("forms.phoneNumber-tooltip")} aria-label={t("phoneNumber")} hasArrow placement={isMobile ? "top" : "left"}>
										<Input isInvalid={!phoneNumber.isValid} {...phoneNumber.bind} />
									</Tooltip>
								</Stack>
								<Stack spacing={1}>
									<FormLabel htmlFor={"mail"}>{t("mail")}</FormLabel>
									<Input isInvalid={!mail.isValid} {...mail.bind} aria-describedby="mail-helper-text" />
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
										<Input id="iban" {...iban.bind} />
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
		)}
	</>);
};

export default CitizenDetail;