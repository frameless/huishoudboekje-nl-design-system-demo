import {Box, Button, Divider, FormHelperText, FormLabel, Heading, Input, Spinner, Stack, Tooltip, useToast} from "@chakra-ui/core";
import React, {useEffect} from "react";
import {useAsync} from "react-async";
import {useInput, useIsMobile, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {GetCitizenByIdQuery} from "../../services/citizens";
import BackButton from "../BackButton";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import {Regex} from "../../utils/things";

const CitizenDetail = () => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const {id} = useParams();
	const toast = useToast();

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
		validate: [(v) => new RegExp(Regex.PhoneNumberNL).test(v) || new RegExp(Regex.MobilePhoneNL).test(v)],
		placeholder: "0612345678"
	});
	const iban = useInput<string>({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.IbanNL).test(v)],
		placeholder: t("forms.iban-placeholder")
	});

	const {data, isPending, cancel} = useAsync({
		promiseFn: GetCitizenByIdQuery,
		id: parseInt(id),
	});

	const onSubmit = (e) => {
		e.preventDefault();
		toast({
			position: "top",
			status: "error",
			variant: "solid",
			description: t("generalError")
		})
	}

	useEffect(() => {
		let mounted = true;

		if (mounted && data) {
			bsn.setValue(data.bsn.toString());
			initials.setValue(data.initials);
			firstName.setValue(data.firstName);
			lastName.setValue(data.lastName);
			dateOfBirth.setValue(data.dateOfBirth);
			mail.setValue(data.mail);
			street.setValue(data.street);
			houseNumber.setValue(data.houseNumber);
			zipcode.setValue(data.zipcode);
			city.setValue(data.city);
			phoneNumber.setValue(data.phoneNumber);
			iban.setValue(data.iban);
		}

		return () => {
			mounted = false;
			cancel();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isPending, cancel]);

	return (<>
		<BackButton to={Routes.Citizens} />

		{isPending && (
			<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
				<Spinner />
			</Stack>
		)}
		{!isPending && data && (
			<Stack spacing={5}>
				<Heading size={"lg"}>{data.firstName} {data.lastName}</Heading>

				<Box as={"form"} onSubmit={onSubmit}>
					<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
						<Stack direction={isMobile ? "column" : "row"} spacing={2}>
							<FormLeft>
								<Heading size={"md"}>{t("personal")}</Heading>
								<FormHelperText id="personal-helperText">{t("forms.citizens.personal-helperText")}</FormHelperText>
							</FormLeft>
							<FormRight>
								<Stack spacing={1}>
									<FormLabel htmlFor={"bsn"}>{t("bsn")}</FormLabel>
									<Tooltip label={t("forms.bsn-tooltip")} aria-label={t("bsn")} hasArrow placement={isMobile ? "top" : "left"}>
										<Input isInvalid={!bsn.isValid} {...bsn.bind} />
									</Tooltip>
								</Stack>
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
									<Tooltip label={t("forms.dateOfBirth-tooltip")} aria-label={t("dateOfBirth")} hasArrow placement={isMobile ? "top" : "left"}>
										<Input isInvalid={!dateOfBirth.isValid} {...dateOfBirth.bind} />
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
									<Button isLoading={isPending} type={"submit"} variantColor={"primary"} onClick={onSubmit}>{t("save")}</Button>
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