import {Box, Button, Divider, FormControl, FormLabel, Input, Stack, Tooltip, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import DatePicker from "react-datepicker";
import {useInput, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {Burger, useGetBurgerQuery, useUpdateBurgerMutation} from "../../generated/graphql";
import d from "../../utils/dayjs";
import Queryable from "../../utils/Queryable";
import {formatBurgerName, Regex} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import BackButton from "../BackButton";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";

const BurgerEdit = () => {
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {t} = useTranslation();
	const {id} = useParams<{id: string}>();
	const toast = useToaster();
	const {push} = useHistory();

	const voorletters = useInput({
		validate: [Validators.required],
	});
	const voornamen = useInput({
		validate: [Validators.required],
	});
	const achternaam = useInput({
		validate: [Validators.required],
	});
	const geboortedatum = useInput({
		validate: [
			(v: string) => new RegExp(Regex.Date).test(v),
			(v: string) => d(v, "L").isValid(),
		],
	});
	const mail = useInput({
		validate: [Validators.required, Validators.email],
	});
	const straatnaam = useInput({
		validate: [Validators.required],
	});
	const huisnummer = useInput({
		validate: [Validators.required],
	});
	const postcode = useInput({
		validate: [Validators.required, (v) => new RegExp(Regex.ZipcodeNL).test(v)],
		placeholder: "1234AB",
	});
	const plaatsnaam = useInput({
		validate: [Validators.required],
	});
	const telefoonnummer = useInput({
		validate: [(v) => new RegExp(Regex.PhoneNumberNL).test(v) || new RegExp(Regex.MobilePhoneNL).test(v)],
		placeholder: "0612345678",
	});

	const $burger = useGetBurgerQuery({
		variables: {id: parseInt(id)},
		onCompleted: ({burger}) => {
			if (burger) {
				voorletters.setValue(burger.voorletters || "");
				voornamen.setValue(burger.voornamen || "");
				achternaam.setValue(burger.achternaam || "");
				geboortedatum.setValue(d(burger.geboortedatum, "YYYY MM DD").format("L"));
				mail.setValue(burger.email || "");
				straatnaam.setValue(burger.straatnaam || "");
				huisnummer.setValue(burger.huisnummer || "");
				postcode.setValue(burger.postcode || "");
				plaatsnaam.setValue(burger.plaatsnaam || "");
				telefoonnummer.setValue(burger.telefoonnummer || "");
			}
		},
	});

	const [updateBurger, $updateBurger] = useUpdateBurgerMutation();

	const onSubmit = (e) => {
		e.preventDefault();

		const isFormValid = [
			voorletters,
			voornamen,
			achternaam,
			geboortedatum,
			straatnaam,
			huisnummer,
			postcode,
			plaatsnaam,
			telefoonnummer,
			mail,
		].every(f => f.isValid);
		if (!isFormValid) {
			toast({
				error: t("messages.burgers.invalidFormMessage"),
			});
			return;
		}

		updateBurger({
			variables: {
				id: parseInt(id),
				voorletters: voorletters.value,
				voornamen: voornamen.value,
				achternaam: achternaam.value,
				geboortedatum: d(geboortedatum.value, "L").format("YYYY-MM-DD"),
				straatnaam: straatnaam.value,
				huisnummer: huisnummer.value,
				postcode: postcode.value,
				plaatsnaam: plaatsnaam.value,
				telefoonnummer: telefoonnummer.value,
				email: mail.value,
			},
		}).then(() => {
			toast({
				success: t("messages.burgers.updateSuccessMessage"),
			});
			push(Routes.Burger(parseInt(id)));
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	return (
		<Queryable query={$burger} error={<Redirect to={Routes.NotFound} />}>{(data) => {
			const burger: Burger = data.burger;

			return (
				<Page title={formatBurgerName(burger)} backButton={<BackButton to={Routes.Burger(parseInt(id))} />}>
					<Box as={"form"} onSubmit={onSubmit}>
						<Section divider={<Divider />}>
							<Stack direction={["column", "row"]} spacing={2}>
								<FormLeft title={t("forms.burgers.sections.personal.title")} helperText={t("forms.burgers.sections.personal.helperText")} />
								<FormRight>
									<Stack spacing={2} direction={["column", "row"]}>
										<FormControl id={"voorletters"} isRequired={true}>
											<Stack spacing={1} flex={1}>
												<FormLabel>{t("forms.burgers.fields.voorletters")}</FormLabel>
												<Input isInvalid={voorletters.dirty && !voorletters.isValid} {...voorletters.bind} />
											</Stack>
										</FormControl>
										<FormControl id={"voornamen"} isRequired={true}>
											<Stack spacing={1} flex={3}>
												<FormLabel>{t("forms.burgers.fields.voornamen")}</FormLabel>
												<Input isInvalid={voornamen.dirty && !voornamen.isValid}{...voornamen.bind} />
											</Stack>
										</FormControl>
										<FormControl id={"achternaam"} isRequired={true}>
											<Stack spacing={1} flex={3}>
												<FormLabel>{t("forms.burgers.fields.achternaam")}</FormLabel>
												<Input isInvalid={achternaam.dirty && !achternaam.isValid} {...achternaam.bind} />
											</Stack>
										</FormControl>
									</Stack>
									<FormControl id={"geboortedatum"} isRequired={true}>
										<Stack spacing={1}>
											<FormLabel>{t("forms.burgers.fields.geboortedatum")}</FormLabel>
											<DatePicker selected={d(geboortedatum.value, "L").isValid() ? d(geboortedatum.value, "L").toDate() : null}
												dateFormat={"dd-MM-yyyy"} onChange={(value: Date) => {
													if (value) {
														geboortedatum.setValue(d(value).format("L"));
													}
												}} customInput={<Input type="text" isInvalid={geboortedatum.dirty && !geboortedatum.isValid} {...geboortedatum.bind} />} />
										</Stack>
									</FormControl>
								</FormRight>
							</Stack>

							<Stack direction={["column", "row"]} spacing={2}>
								<FormLeft title={t("forms.burgers.sections.contact.title")} helperText={t("forms.burgers.sections.contact.helperText")} />
								<FormRight>
									<Stack spacing={2} direction={["column", "row"]}>
										<FormControl id={"straatnaam"} isRequired={true}>
											<Stack spacing={1} flex={2}>
												<FormLabel>{t("forms.burgers.fields.straatnaam")}</FormLabel>
												<Input isInvalid={straatnaam.dirty && !straatnaam.isValid} {...straatnaam.bind} />
											</Stack>
										</FormControl>
										<FormControl id={"huisnummer"} isRequired={true}>
											<Stack spacing={1} flex={1}>
												<FormLabel>{t("forms.burgers.fields.huisnummer")}</FormLabel>
												<Input isInvalid={huisnummer.dirty && !huisnummer.isValid} {...huisnummer.bind} />
											</Stack>
										</FormControl>
									</Stack>
									<Stack spacing={2} direction={["column", "row"]}>
										<FormControl id={"postcode"} isRequired={true}>
											<Stack spacing={1} flex={1}>
												<FormLabel>{t("forms.burgers.fields.postcode")}</FormLabel>
												<Tooltip label={t("forms.burgers.tooltips.postcode")} aria-label={t("forms.burgers.fields.postcode")} placement={isMobile ? "top" : "left"}>
													<Input isInvalid={postcode.dirty && !postcode.isValid} {...postcode.bind} />
												</Tooltip>
											</Stack>
										</FormControl>
										<FormControl id={"plaatsnaam"} isRequired={true}>
											<Stack spacing={1} flex={2}>
												<FormLabel>{t("forms.burgers.fields.plaatsnaam")}</FormLabel>
												<Input isInvalid={plaatsnaam.dirty && !plaatsnaam.isValid} {...plaatsnaam.bind} />
											</Stack>
										</FormControl>
									</Stack>
									<FormControl id={"telefoonnummer"} isRequired={true}>
										<Stack spacing={1}>
											<FormLabel>{t("forms.burgers.fields.telefoonnummer")}</FormLabel>
											<Tooltip label={t("forms.burgers.tooltips.telefoonnummer")} aria-label={t("forms.burgers.tooltips.telefoonnummer")} placement={isMobile ? "top" : "left"}>
												<Input isInvalid={telefoonnummer.dirty && !telefoonnummer.isValid} {...telefoonnummer.bind} />
											</Tooltip>
										</Stack>
									</FormControl>
									<FormControl id={"mail"} isRequired={true}>
										<Stack spacing={1}>
											<FormLabel>{t("forms.burgers.fields.mail")}</FormLabel>
											<Input isInvalid={mail.dirty && !mail.isValid} {...mail.bind} />
										</Stack>
									</FormControl>
								</FormRight>
							</Stack>

							<Stack direction={["column", "row"]} spacing={2}>
								<FormLeft />
								<FormRight>
									<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
										<Button isLoading={$burger.loading || $updateBurger.loading} type={"submit"} colorScheme={"primary"}
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
	);
};

export default BurgerEdit;