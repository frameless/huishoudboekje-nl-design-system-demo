import {Box, Button, Divider, FormLabel, Input, Select, Stack, Tooltip, useToast} from "@chakra-ui/react";
import React from "react";
import {useInput, useIsMobile, useNumberInput, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {useGetOneBurgerQuery, useUpdateBurgerMutation} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {formatBurgerName, Months, Regex} from "../../utils/things";
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

				const {geboortedatum} = gebruiker;
				if (geboortedatum) {
					dateOfBirth.day.setValue(new Date(geboortedatum).getDate());
					dateOfBirth.month.setValue(new Date(geboortedatum).getMonth() + 1);
					dateOfBirth.year.setValue(new Date(geboortedatum).getFullYear());
				}
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

		updateGebruiker({
			variables: {
				id: parseInt(id),
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
									{/*<Stack spacing={1}>*/}
									{/*	<FormLabel htmlFor={"bsn"}>{TRANSLATE}</FormLabel>*/}
									{/*	<Tooltip label={TRANSLATE} aria-label={TRANSLATE} hasArrow placement={isMobile ? "top" : "left"}>*/}
									{/*		<Input isInvalid={bsn.dirty && !bsn.isValid} {...bsn.bind} />*/}
									{/*	</Tooltip>*/}
									{/*</Stack>*/}
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
										<Stack direction={"row"} maxW="100%">
											<Box flex={1}>
												<Input isInvalid={dateOfBirth.day.dirty && !dateOfBirth.day.isValid} {...dateOfBirth.day.bind} id="dateOfBirth-day" />
											</Box>
											<Box flex={2}>
												<Select isInvalid={dateOfBirth.month.dirty && !dateOfBirth.month.isValid} {...dateOfBirth.month.bind} id="dateOfBirth-month"
												        value={parseInt(dateOfBirth.month.value.toString()).toString()}>
													{Months.map((m, i) => (
														/* t("months.jan") t("months.feb") t("months.mrt") t("months.apr") t("months.may") t("months.jun")
														 * t("months.jul") t("months.aug") t("months.sep") t("months.oct") t("months.nov") t("months.dec") */
														<option key={i} value={i + 1}>{t("months." + m)}</option>
													))}
												</Select>
											</Box>
											<Box flex={1}>
												<Input isInvalid={dateOfBirth.year.dirty && !dateOfBirth.year.isValid} {...dateOfBirth.year.bind} id="dateOfBirth-year" />
											</Box>
										</Stack>
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