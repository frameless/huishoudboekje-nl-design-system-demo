import React from "react";
import {useTranslation} from "react-i18next";
import {Box, Button, Divider, Flex, FormHelperText, FormLabel, Heading, Input, Select, Spinner, Stack, useToast,} from "@chakra-ui/core";
import {useInput, useIsMobile, useNumberInput, Validators} from "react-grapple";
import BackButton from "../BackButton";
import Routes from "../../config/routes";
import {isDev, MOBILE_BREAKPOINT, Months} from "../../utils/things";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import {useMutation, useQuery} from "@apollo/client";
import {sampleData} from "../../config/sampleData/sampleData";
import {Redirect, useHistory, useParams} from "react-router-dom";
import {CreateAfspraakMutation} from "../../services/graphql/mutations";
import {GetOneGebruikerQuery} from "../../services/graphql/queries";

const CreateAgreement = () => {
	const {t} = useTranslation();
	const {burgerId} = useParams();
	const {push} = useHistory();
	const isMobile = useIsMobile(MOBILE_BREAKPOINT);
	const toast = useToast();

	const gebruiker = useQuery(GetOneGebruikerQuery, {
		variables: {
			id: burgerId
		}
	})

	const beschrijving = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const startDate = {
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
		})
	}
	const endDate = {
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
		})
	}
	const nBetalingen = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(/^[0-9]+$/).test(v)]
	});
	const intervalYears = useNumberInput({
		min: 0
	});
	const intervalMonths = useNumberInput({
		min: 0
	});
	const intervalWeeks = useNumberInput({
		min: 0
	});
	const intervalDays = useNumberInput({
		min: 0
	});
	const tegenrekening = useNumberInput();
	const bedrag = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const kenmerk = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});

	const [createAfspraak, {loading}] = useMutation(CreateAfspraakMutation);

	const prePopulateForm = () => {
		const c = sampleData.agreements[0];

		const startDatum: Date = new Date(c.startDatum)
		const eindDatum: Date = new Date(c.eindDatum)
		beschrijving.setValue(c.beschrijving);
		startDate.day.setValue(startDatum.getDate());
		startDate.month.setValue(startDatum.getMonth() + 1);
		startDate.year.setValue(startDatum.getFullYear());
		endDate.day.setValue(eindDatum.getDate());
		endDate.month.setValue(eindDatum.getMonth() + 1);
		endDate.year.setValue(eindDatum.getFullYear());
		nBetalingen.setValue(c.nBetalingen.toString());

		intervalYears.setValue(c.interval.years);
		intervalMonths.setValue(c.interval.months);
		intervalWeeks.setValue(c.interval.weeks);
		intervalDays.setValue(c.interval.days);

		tegenrekening.setValue(c.tegenRekening.toString());
		bedrag.setValue(c.bedrag);
		kenmerk.setValue(c.kenmerk);
	}

	const onSubmit = (e) => {
		e.preventDefault();

		const isFormValid = [
			beschrijving,
			startDate.day,
			startDate.month,
			startDate.year,
			endDate.day,
			endDate.month,
			endDate.year,
			intervalYears,
			intervalMonths,
			intervalWeeks,
			intervalDays,
			tegenrekening,
			bedrag,
			kenmerk,
		].every(f => f.isValid);

		if (!isFormValid) {
			toast({
				status: "error",
				title: t("messages.agreements.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		const startDatum = new Date(Date.UTC(startDate.year.value, startDate.month.value - 1, startDate.day.value));
		const eindDatum = new Date(Date.UTC(endDate.year.value, endDate.month.value - 1, endDate.day.value));

		createAfspraak({
			variables: {
				aantalBetalingen: nBetalingen.value,
				actief: true,
				bedrag: bedrag.value,
				beschrijving: beschrijving.value,
				startDatum: startDatum.toISOString().substring(0, 10),
				eindDatum: eindDatum.toISOString().substring(0, 10),
				gebruikerId: burgerId,
				interval: {
					jaren: intervalYears.value,
					maanden: intervalMonths.value,
					weken: intervalWeeks.value,
					dagen: intervalDays.value,
				},
				kenmerk: kenmerk.value,
				tegenRekeningId: tegenrekening.value
			}
		}).then(result => {
			toast({
				status: "success",
				title: t("messages.agreements.createSuccessMessage"),
				position: "top",
			});
			push(Routes.Burger(burgerId))
		}).catch(err => {
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
		<BackButton to={Routes.Burger(burgerId)} />
		{gebruiker.loading && (
			<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
				<Spinner />
			</Stack>
		)}
		{!gebruiker.loading && gebruiker.error && (
			<Redirect to={Routes.NotFound} />
		)}
		{!gebruiker.loading && !gebruiker.error && gebruiker.data && (
			<Stack spacing={5}>
				<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
					<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
						<Heading size={"lg"}>{gebruiker.data.gebruiker.voornamen} {gebruiker.data.gebruiker.achternaam}</Heading>
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
										<FormLabel htmlFor={"beschrijving"}>{t("forms.agreements.fields.description")}</FormLabel>
										<Input isInvalid={isInvalid(beschrijving)} {...beschrijving.bind} id="beschrijving" />
									</Stack>
								</Stack>
								<Stack spacing={1}>
									<FormLabel htmlFor={"startDate"}>{t("forms.agreements.fields.startDate")}</FormLabel>
									<Stack direction={"row"} maxW="100%">
										<Box flex={1}>
											<Input isInvalid={isInvalid(startDate.day)} {...startDate.day.bind} id="startDate.day" />
										</Box>
										<Box flex={2}>
											<Select isInvalid={isInvalid(startDate.month)} {...startDate.month.bind} id="startDate.month"
											        value={startDate.month.value.toString()}>
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
											<Input isInvalid={isInvalid(endDate.day)} {...endDate.day.bind} id="eind_datum.day" />
										</Box>
										<Box flex={2}>
											<Select isInvalid={isInvalid(endDate.month)} {...endDate.month.bind} id="eind_datum.month"
											        value={endDate.month.value.toString()}>
												{Months.map((m, i) => (
													<option key={i} value={i + 1}>{t("months." + m)}</option>
												))}
											</Select>
										</Box>
										<Box flex={1}>
											<Input isInvalid={isInvalid(endDate.year)} {...endDate.year.bind} id="eind_datum.year" />
										</Box>
									</Stack>
								</Stack>
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={2}>
										<FormLabel htmlFor={"nPayments"}>{t("forms.agreements.fields.nPayments")}</FormLabel>
										<Input isInvalid={isInvalid(nBetalingen)} {...nBetalingen.bind} id="nPayments" />
									</Stack>
								</Stack>
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={2}>
										<FormLabel htmlFor={"interval"}>{t("forms.agreements.fields.interval")}</FormLabel>
										<Stack direction={isMobile ? "column" : "row"} spacing={1}>
											<Stack flex={1}>
												<FormLabel htmlFor={"intervalYears"}>{t("forms.agreements.fields.intervalYears")}</FormLabel>
												<Input isInvalid={isInvalid(intervalYears)} {...intervalYears.bind} id="intervalYears" />
											</Stack>
											<Stack flex={1}>
												<FormLabel htmlFor={"intervalMonths"}>{t("forms.agreements.fields.intervalMonths")}</FormLabel>
												<Input isInvalid={isInvalid(intervalMonths)} {...intervalMonths.bind} id="intervalMonths" />
											</Stack>
											<Stack flex={1}>
												<FormLabel htmlFor={"intervalWeeks"}>{t("forms.agreements.fields.intervalWeeks")}</FormLabel>
												<Input isInvalid={isInvalid(intervalWeeks)} {...intervalWeeks.bind} id="intervalWeeks" />
											</Stack>
											<Stack flex={1}>
												<FormLabel htmlFor={"intervalDays"}>{t("forms.agreements.fields.intervalDays")}</FormLabel>
												<Input isInvalid={isInvalid(intervalDays)} {...intervalDays.bind} id="intervalDays" />
											</Stack>
										</Stack>
									</Stack>
								</Stack>
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={2}>
										<FormLabel htmlFor={"tegenRekening"}>{t("forms.agreements.fields.beneficiaryAccount")}</FormLabel>
										<Input isInvalid={isInvalid(tegenrekening)} {...tegenrekening.bind} id="tegenRekening" />
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
		)}
	</>);
};

export default CreateAgreement;