import {Box, Button, Divider, FormLabel, Input, Stack, Tooltip, useToast} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import {useInput, useIsMobile, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {useGetOneBurgerQuery, useUpdateBurgerMutation} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {formatBurgerName, Regex} from "../../utils/things";
import BackButton from "../BackButton";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";

const BurgerEdit = () => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const {id} = useParams<{ id: string }>();
	const toast = useToast();
	const {push} = useHistory();

	const initials = useInput({
		validate: [Validators.required]
	});
	const firstName = useInput({
		validate: [Validators.required]
	});
	const lastName = useInput({
		validate: [Validators.required]
	});
	const dateOfBirth = useInput({
		validate: [
			(v: string) => new RegExp(Regex.Date).test(v),
			(v: string) => moment(v, "L").isValid()
		]
	});
	const mail = useInput({
		validate: [Validators.required, Validators.email]
	});
	const street = useInput({
		validate: [Validators.required]
	});
	const houseNumber = useInput({
		validate: [Validators.required]
	});
	const zipcode = useInput({
		validate: [Validators.required, (v) => new RegExp(Regex.ZipcodeNL).test(v)],
		placeholder: "1234AB"
	});
	const city = useInput({
		validate: [Validators.required]
	});
	const phoneNumber = useInput({
		validate: [(v) => new RegExp(Regex.PhoneNumberNL).test(v) || new RegExp(Regex.MobilePhoneNL).test(v)],
		placeholder: "0612345678"
	});

	const $gebruiker = useGetOneBurgerQuery({
		variables: {id: parseInt(id)},
		onCompleted: ({gebruiker}) => {
			if (gebruiker) {
				initials.setValue(gebruiker.voorletters || "");
				firstName.setValue(gebruiker.voornamen || "");
				lastName.setValue(gebruiker.achternaam || "");
				dateOfBirth.setValue(moment(gebruiker.geboortedatum, "YYYY MM DD").format("L"));
				mail.setValue(gebruiker.email || "");
				street.setValue(gebruiker.straatnaam || "");
				houseNumber.setValue(gebruiker.huisnummer || "");
				zipcode.setValue(gebruiker.postcode || "");
				city.setValue(gebruiker.plaatsnaam || "");
				phoneNumber.setValue(gebruiker.telefoonnummer || "");
			}
		}
	});

	const [updateGebruiker, $updateGebruiker] = useUpdateBurgerMutation();

	const onSubmit = (e) => {
		e.preventDefault();

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

		updateGebruiker({
			variables: {
				id: parseInt(id),
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
			}
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.burgers.updateSuccessMessage"),
				position: "top",
			});
			push(Routes.Burger(parseInt(id)));
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				description: t("messages.genericError.description"),
				title: t("messages.genericError.title")
			});
		});
	};

	return (<>
		<BackButton to={Routes.Burger(parseInt(id))} />

		<Queryable query={$gebruiker} error={<Redirect to={Routes.NotFound} />}>{(data) => {
			return (
				<Page title={formatBurgerName(data.gebruiker)}>
					<Box as={"form"} onSubmit={onSubmit}>
						<Section>
							<Stack direction={isMobile ? "column" : "row"} spacing={2}>
								<FormLeft title={t("forms.burgers.sections.personal.title")} helperText={t("forms.burgers.sections.personal.helperText")} />
								<FormRight>
									<Stack spacing={2} direction={isMobile ? "column" : "row"}>
										<Stack spacing={1} flex={1}>
											<FormLabel htmlFor={"initials"}>{t("forms.burgers.fields.initials")}</FormLabel>
											<Input isInvalid={initials.dirty && !initials.isValid} id={"initials"} {...initials.bind} />
										</Stack>
										<Stack spacing={1} flex={3}>
											<FormLabel htmlFor={"firstName"}>{t("forms.burgers.fields.firstName")}</FormLabel>
											<Input isInvalid={firstName.dirty && !firstName.isValid} id={"firstName"}{...firstName.bind} />
										</Stack>
										<Stack spacing={1} flex={3}>
											<FormLabel htmlFor={"lastName"}>{t("forms.burgers.fields.lastName")}</FormLabel>
											<Input isInvalid={lastName.dirty && !lastName.isValid} id={"lastName"} {...lastName.bind} />
										</Stack>
									</Stack>
									<Stack spacing={1}>
										<FormLabel htmlFor={"dateOfBirth"}>{t("forms.burgers.fields.dateOfBirth")}</FormLabel>
										<DatePicker selected={moment(dateOfBirth.value, "L").isValid() ? moment(dateOfBirth.value, "L").toDate() : null} dateFormat={"dd-MM-yyyy"}
										            onChange={(value: Date) => {
											            if (value) {
												            dateOfBirth.setValue(moment(value).format("L"));
											            }
										            }} customInput={<Input type="text" isInvalid={dateOfBirth.dirty && !dateOfBirth.isValid} {...dateOfBirth.bind} />} id={"dateOfBirth"} />
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
											<Input isInvalid={street.dirty && !street.isValid} id={"street"} {...street.bind} />
										</Stack>
										<Stack spacing={1} flex={1}>
											<FormLabel htmlFor={"houseNumber"}>{t("forms.burgers.fields.houseNumber")}</FormLabel>
											<Input isInvalid={houseNumber.dirty && !houseNumber.isValid} id={"houseNumber"} {...houseNumber.bind} />
										</Stack>
									</Stack>
									<Stack spacing={2} direction={isMobile ? "column" : "row"}>
										<Stack spacing={1} flex={1}>
											<FormLabel htmlFor={"zipcode"}>{t("forms.burgers.fields.zipcode")}</FormLabel>
											<Tooltip label={t("forms.burgers.tooltips.zipcode")} aria-label={t("forms.burgers.fields.zipcode")} hasArrow
											         placement={isMobile ? "top" : "left"}>
												<Input isInvalid={zipcode.dirty && !zipcode.isValid} id={"zipcode"} {...zipcode.bind} />
											</Tooltip>
										</Stack>
										<Stack spacing={1} flex={2}>
											<FormLabel htmlFor={"city"}>{t("forms.burgers.fields.city")}</FormLabel>
											<Input isInvalid={city.dirty && !city.isValid} id={"city"} {...city.bind} />
										</Stack>
									</Stack>
									<Stack spacing={1}>
										<FormLabel htmlFor={"phoneNumber"}>{t("forms.burgers.fields.phoneNumber")}</FormLabel>
										<Tooltip label={t("forms.burgers.tooltips.phoneNumber")} aria-label={t("forms.burgers.tooltips.phoneNumber")} hasArrow
										         placement={isMobile ? "top" : "left"}>
											<Input isInvalid={phoneNumber.dirty && !phoneNumber.isValid} id={"phoneNumber"} {...phoneNumber.bind} />
										</Tooltip>
									</Stack>
									<Stack spacing={1}>
										<FormLabel htmlFor={"mail"}>{t("forms.burgers.fields.mail")}</FormLabel>
										<Input isInvalid={mail.dirty && !mail.isValid} id={"mail"} {...mail.bind} />
									</Stack>
								</FormRight>
							</Stack>

							<Divider />

							<Stack direction={isMobile ? "column" : "row"} spacing={2}>
								<FormLeft />
								<FormRight>
									<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
										<Button isLoading={$gebruiker.loading || $updateGebruiker.loading} type={"submit"} colorScheme={"primary"}
										        onClick={onSubmit}>{t("actions.save")}</Button>
									</Stack>
								</FormRight>
							</Stack>
						</Section>
					</Box>
				</Page>
			);
		}}
		</Queryable>
	</>);
};

export default BurgerEdit;