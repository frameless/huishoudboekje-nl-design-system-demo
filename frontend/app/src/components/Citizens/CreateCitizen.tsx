import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Box, Button, Divider, FormHelperText, FormLabel, Heading, Input, Stack, Tooltip, useToast} from "@chakra-ui/core";
import {useInput, useIsMobile, useToggle, Validators} from "react-grapple";
import BackButton from "../BackButton";
import Routes from "../../config/routes";
import {MOBILE_BREAKPOINT, Regex} from "../../utils/things";
import {useAsync} from "react-async"
import {CreateCitizenMutation} from "../../services/citizens";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";

// Todo: add more detailed error message per field?
const CreateCitizen = () => {
	const {t} = useTranslation();
	// const {push} = useHistory(); // Todo redirect to page after successful submit
	const isMobile = useIsMobile(MOBILE_BREAKPOINT);
	const toast = useToast();

	const [isSubmitted, toggleSubmitted] = useToggle();

	const bsn = useInput<string>({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.BsnNL).test(v)],
		placeholder: "123456789"
	});
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
	const dateOfBirth = useInput<string>({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.Date).test(v)],
		placeholder: "24-09-1960"
	});
	const mail = useInput<string>({
		defaultValue: "",
		validate: [Validators.required, Validators.email]
	});
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
	const iban = useInput<string>({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.IbanNL).test(v)]
	});

	const {data, error, isPending, run, cancel} = useAsync({deferFn: CreateCitizenMutation});

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

		run();
	};

	useEffect(() => {
		if (!isPending && error) {
			toast({
				status: "error",
				title: error.name + ": " + error.message,
				position: "top"
			});
		}

		if (!isPending && data) {
			toast({
				status: "success",
				title: t("forms.citizens.successMessage"),
				position: "top"
			});
			// Todo: redirect to citizen detail page
		}

		return () => {
			cancel();
		}
	}, [cancel, data, error, isPending, t, toast]);

	const isInvalid = (input) => isSubmitted && !input.isValid;

	return (<>
		<BackButton to={Routes.Citizens} />

		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Heading size={"lg"}>{t("forms.citizens.title")}</Heading>
			</Stack>

			<Box>
				<form onSubmit={onSubmit}>
					<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>

						<Stack direction={isMobile ? "column" : "row"} spacing={2}>
							<FormLeft>
								<Heading size={"md"}>{t("personal")}</Heading>
								<FormHelperText id="personal-helperText">{t("forms.citizens.personal-helperText")}</FormHelperText>
							</FormLeft>
							<FormRight>
								<Stack spacing={1}>
									<FormLabel htmlFor={"bsn"}>{t("bsn")}</FormLabel>
									<Input isInvalid={isInvalid(bsn)} {...bsn.bind} id="bsn" />
								</Stack>
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
									<Tooltip label={t("forms.dateOfBirth-tooltip")} aria-label={t("dateOfBirth")} hasArrow placement={isMobile ? "top" : "left"}>
										<Input isInvalid={isInvalid(dateOfBirth)} {...dateOfBirth.bind} id="dateOfBirth" />
									</Tooltip>
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
									<Input isInvalid={isInvalid(iban)} {...iban.bind} id="iban" />
								</Stack>
							</FormRight>
						</Stack>

						<Divider />

						<Stack direction={isMobile ? "column" : "row"} spacing={2}>
							<FormLeft />
							<FormRight>
								<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
									<Button isLoading={isPending} type={"submit"} variantColor={"primary"} onClick={onSubmit}>{t("save")}</Button>
								</Stack>
							</FormRight>
						</Stack>
					</Stack>
				</form>
			</Box>
		</Stack>
	</>);
};

export default CreateCitizen;