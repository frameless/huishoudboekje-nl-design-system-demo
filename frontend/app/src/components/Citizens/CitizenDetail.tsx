import {Box, Button, Divider, FormHelperText, FormLabel, Heading, Input, Spinner, Stack, Tooltip} from "@chakra-ui/core";
import React, {useEffect, useState} from "react";
import {useAsync} from "react-async";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {GetCitizenByIdQuery} from "../../services/citizens";
import BackButton from "../BackButton";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";

const CitizenDetail = () => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const {id} = useParams();
	const [formData, setFormData] = useState<{ [key: string]: any }>({
		bsn: undefined,
		initials: undefined,
		firstName: undefined,
		lastName: undefined,
		dateOfBirth: undefined,
		mail: undefined,
		street: undefined,
		houseNumber: undefined,
		zipcode: undefined,
		city: undefined,
		phoneNumber: undefined,
		iban: undefined,
	});
	const {data, isPending, cancel} = useAsync({
		promiseFn: GetCitizenByIdQuery,
		id: parseInt(id),
	});

	const onChange = (e) => {
		e.persist();
		setFormData(fd => ({...fd, [e.target.name]: e.target.value}))
	};

	const onSubmit = () => {
		console.log("SUBMIT");
	}

	const isValid = (field, value) => {
		return false;
	}

	useEffect(() => {
		let mounted = true;

		if (mounted && data) {
			setTimeout(() => {
				setFormData({
					bsn: data.bsn,
					initials: data.initials,
					firstName: data.firstName,
					lastName: data.lastName,
					dateOfBirth: data.dateOfBirth,
					mail: data.mail,
					street: data.street,
					houseNumber: data.houseNumber,
					zipcode: data.zipcode,
					city: data.city,
					phoneNumber: data.phoneNumber,
					iban: data.iban,
				});
			}, 2000);
		}

		return () => {
			mounted = false;
			cancel();
		}
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
										<Input type="number" value={formData.bsn || ""} onChange={onChange} name="bsn" />
									</Tooltip>
								</Stack>
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"initials"}>{t("initials")}</FormLabel>
										<Input type="text" value={formData.initials || ""} onChange={onChange} name="initials" />
									</Stack>
									<Stack spacing={1} flex={3}>
										<FormLabel htmlFor={"firstName"}>{t("firstName")}</FormLabel>
										<Input value={formData.firstName || ""} onChange={onChange} name="firstName" />
									</Stack>
									<Stack spacing={1} flex={3}>
										<FormLabel htmlFor={"lastName"}>{t("lastName")}</FormLabel>
										<Input value={formData.lastName || ""} onChange={onChange} name="lastName" />
									</Stack>
								</Stack>
								<Stack spacing={1}>
									<FormLabel htmlFor={"dateOfBirth"}>{t("dateOfBirth")}</FormLabel>
									<Tooltip label={t("forms.dateOfBirth-tooltip")} aria-label={t("dateOfBirth")} hasArrow placement={isMobile ? "top" : "left"}>
										<Input value={formData.dateOfBirth || ""} onChange={onChange} name="dateOfBirth" />
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
										<Input value={formData.street || ""} onChange={onChange} name="street" />
									</Stack>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"houseNumber"}>{t("houseNumber")}</FormLabel>
										<Input value={formData.houseNumber || ""} onChange={onChange} name="houseNumber" />
									</Stack>
								</Stack>
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"zipcode"}>{t("zipcode")}</FormLabel>
										<Tooltip label={t("forms.zipcode-tooltip")} aria-label={t("zipcode")} hasArrow placement={isMobile ? "top" : "left"}>
											<Input value={formData.zipcode || ""} onChange={onChange} name="zipcode" />
										</Tooltip>
									</Stack>
									<Stack spacing={1} flex={2}>
										<FormLabel htmlFor={"city"}>{t("city")}</FormLabel>
										<Input value={formData.city || ""} onChange={onChange} name="city" />
									</Stack>
								</Stack>
								<Stack spacing={1}>
									<FormLabel htmlFor={"phoneNumber"}>{t("phoneNumber")}</FormLabel>
									<Tooltip label={t("forms.phoneNumber-tooltip")} aria-label={t("phoneNumber")} hasArrow placement={isMobile ? "top" : "left"}>
										<Input value={formData.phoneNumber || ""} onChange={onChange} name="phoneNumber" />
									</Tooltip>
								</Stack>
								<Stack spacing={1}>
									<FormLabel htmlFor={"mail"}>{t("mail")}</FormLabel>
									<Input value={formData.mail || ""} onChange={onChange} name="mail" aria-describedby="mail-helper-text" />
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
										<Input id="iban" value={formData.iban || ""} onChange={onChange} name="iban" />
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