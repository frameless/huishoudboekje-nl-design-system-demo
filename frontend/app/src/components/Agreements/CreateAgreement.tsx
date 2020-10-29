import React from "react";
import {useTranslation} from "react-i18next";
import {Box, Button, Divider, Flex, FormHelperText, FormLabel, Heading, Input, Select, Stack, useToast} from "@chakra-ui/core";
import {useInput, useIsMobile, useToggle, useNumberInput, Validators} from "react-grapple";
import BackButton from "../BackButton";
import Routes from "../../config/routes";
import {isDev, MOBILE_BREAKPOINT, Months, Regex} from "../../utils/things";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import {useMutation} from "@apollo/client";
import {sampleData} from "../../config/sampleData/sampleData";
import {useHistory} from "react-router-dom";
import {CreateAgreementMutation} from "../../services/graphql/mutations";

// Todo: add more detailed error message per field?
const CreateAgreement = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const isMobile = useIsMobile(MOBILE_BREAKPOINT);
	const toast = useToast();
	const [isSubmitted, toggleSubmitted] = useToggle(false);

	const gebruiker = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(/^[0-9]+$/).test(v)]
	});
	const beschrijving = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const startDate = {
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
	}
	const eind_datum = {
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
	}
	const aantal_betalingen = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(/^[0-9]+$/).test(v)]
	});
	const interval = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const tegen_rekening = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(/^[0-9]+$/).test(v)],
		placeholder: "1234AB"
	});
	const bedrag = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const kenmerk = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});

	const [createAgreement, {loading}] = useMutation(CreateAgreementMutation);

	const prePopulateForm = () => {
		const c = sampleData.agreements[0];

		gebruiker.setValue(c.gebruiker.toString());
		beschrijving.setValue(c.beschrijving);
		startDate.day.setValue(c.start_datum.split("-")[0]);
		startDate.month.setValue(c.start_datum.split("-")[1]);
		startDate.year.setValue(c.start_datum.split("-")[2]);
		eind_datum.day.setValue(c.eind_datum.split("-")[0]);
		eind_datum.month.setValue(c.eind_datum.split("-")[1]);
		eind_datum.year.setValue(c.eind_datum.split("-")[2]);
		aantal_betalingen.setValue(c.aantal_betalingen.toString());
		interval.setValue(c.interval);
		tegen_rekening.setValue(c.tegen_rekening.toString());
		bedrag.setValue(c.bedrag);
		kenmerk.setValue(c.kenmerk);
	}

	const onSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		const isFormValid = [
			gebruiker,
			beschrijving,
			startDate.day,
			startDate.month,
			startDate.year,
			eind_datum.day,
			eind_datum.month,
			eind_datum.year,
			interval,
			tegen_rekening,
			bedrag,
			kenmerk,
		].every(f => f.isValid);

		if (!isFormValid) {
			toast({
				status: "error",
				title: t("messages.organizations.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		createAgreement({
			variables: {
				gebruiker: gebruiker.value,
				beschrijving: beschrijving.value,
				start_datum: [
					startDate.year.value,
					("0" + startDate.month.value).substr(-2, 2),
					("0" + startDate.day.value).substr(-2, 2),
				].join("-"),
				eind_datum: [
					eind_datum.year.value,
					("0" + eind_datum.month.value).substr(-2, 2),
					("0" + eind_datum.day.value).substr(-2, 2),
				].join("-"),
				interval: interval.value,
				tegen_rekening: tegen_rekening.value,
				bedrag: bedrag.value,
				kenmerk: kenmerk.value,
			}
		}).then(result => {
			toast({
				status: "success",
				title: t("messages.organizations.createSuccessMessage"),
				position: "top",
			});

			const {id} = result.data.createAfspraak.afspraak;
			if (id) {
				// todo: need afspraak detail page
				//push(Routes.Afspraak(id));
			}
		}).catch(err => {
			console.log("Error:", err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				title: t("messages.genericError.title"),
				description: t("messages.genericError.description"),
			});
		});
	};

	const isInvalid = (input) => input.dirty && !input.isValid;

	return (<>
		<BackButton to={Routes.AgreementsNew} />

		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Stack>
					<Heading size={"lg"}>{t("forms.agreements.title")}</Heading>
				</Stack>
			</Stack>

			{isDev && (
				<Flex justifyContent={"center"}>
					<Button maxWidth={350} variantColor={"yellow"} variant={"outline"} onClick={() => prePopulateForm()}>Formulier snel invullen met testdata</Button>
				</Flex>
			)}

			<Box as={"form"} onSubmit={onSubmit}>
				<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft>
							<Heading size={"md"}>{t("forms.agreements.title")}</Heading>
							<FormHelperText id="personal-helperText">{t("forms.agreements.subtitle")}</FormHelperText>
						</FormLeft>
						<FormRight>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"gebruiker"}>{t("forms.agreements.fields.user")}</FormLabel>
									<Input isInvalid={isInvalid(gebruiker)} {...gebruiker.bind} id="gebruiker" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"beschrijving"}>{t("forms.agreements.fields.description")}</FormLabel>
									<Input isInvalid={isInvalid(beschrijving)} {...beschrijving.bind} id="beschrijving" />
								</Stack>
							</Stack>
							<Stack spacing={1}>
								<FormLabel htmlFor={"startDate"}>{t("forms.burgers.fields.startDate")}</FormLabel>
								<Stack direction={"row"} maxW="100%">
									<Box flex={1}>
										<Input isInvalid={isInvalid(startDate.day)} {...startDate.day.bind} id="startDate.day" />
									</Box>
									<Box flex={2}>
										<Select isInvalid={isInvalid(startDate.month)} {...startDate.month.bind} id="startDate.month"
										        value={parseInt(startDate.month.value.toString()).toString()}>
											{Months.map((m, i) => (
												<option key={i} value={i + 1}>{t("months." + m)}</option>
											))}
										</Select>
									</Box>
									<Box flex={1}>
										<Input isInvalid={isInvalid(startDate.year)} {...startDate.year.bind} id="start_datum.year" />
									</Box>
								</Stack>
							</Stack>
							<Stack spacing={1}>
								<FormLabel htmlFor={"eind_datum"}>{t("forms.agreements.fields.endDate")}</FormLabel>
								<Stack direction={"row"} maxW="100%">
									<Box flex={1}>
										<Input isInvalid={isInvalid(eind_datum.day)} {...eind_datum.day.bind} id="eind_datum.day" />
									</Box>
									<Box flex={2}>
										<Select isInvalid={isInvalid(eind_datum.month)} {...eind_datum.month.bind} id="eind_datum.month"
										        value={parseInt(eind_datum.month.value.toString()).toString()}>
											{Months.map((m, i) => (
												<option key={i} value={i + 1}>{t("months." + m)}</option>
											))}
										</Select>
									</Box>
									<Box flex={1}>
										<Input isInvalid={isInvalid(eind_datum.year)} {...eind_datum.year.bind} id="eind_datum.year" />
									</Box>
								</Stack>
							</Stack>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"aantal_betalingen"}>{t("forms.agreements.fields.noOfPayments")}</FormLabel>
									<Input isInvalid={isInvalid(aantal_betalingen)} {...aantal_betalingen.bind} id="aantal_betalingen" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"interval"}>{t("forms.agreements.fields.interval")}</FormLabel>
									<Input isInvalid={isInvalid(interval)} {...interval.bind} id="interval" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"tegen_rekening"}>{t("forms.agreements.fields.contraAccount")}</FormLabel>
									<Input isInvalid={isInvalid(tegen_rekening)} {...tegen_rekening.bind} id="tegen_rekening" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"bedrag"}>{t("forms.agreements.fields.amount")}</FormLabel>
									<Input isInvalid={isInvalid(bedrag)} {...bedrag.bind} id="bedrag" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"kenmerk"}>{t("forms.agreements.fields.reference")}</FormLabel>
									<Input isInvalid={isInvalid(kenmerk)} {...kenmerk.bind} id="kenmerk" />
								</Stack>
							</Stack>
						</FormRight>
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

export default CreateAgreement;