import { useQuery } from "@apollo/client";
import {
	Box,
	BoxProps,
	Button,
	Divider,
	FormLabel,
	Heading,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
	Spinner,
	Stack,
	Switch,
	Text,
	useToast,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useInput, useIsMobile, useNumberInput, useToggle, Validators } from "react-grapple";
import { UseInput } from "react-grapple/dist/hooks/useInput";
import { useTranslation } from "react-i18next";
import { sampleData } from "../../config/sampleData/sampleData";
import {
	AfspraakPeriod,
	AfspraakType,
	IAfspraak,
	IGebruiker,
	IntervalType,
	IOrganisatie,
	IRubriek,
} from "../../models";
import { GetAllOrganisatiesQuery, GetAllRubricsQuery } from "../../services/graphql/queries";
import Queryable from "../../utils/Queryable";
import { Interval, isDev } from "../../utils/things";
import { FormLeft, FormRight } from "../Forms/FormLeftRight";
import RadioButtonGroup from "../Layouts/RadioButtons";

const AfspraakForm: React.FC<BoxProps & { afspraak?: IAfspraak, onSave: (data) => void, gebruiker: IGebruiker, loading: boolean }> = ({afspraak, onSave, gebruiker, loading = false, ...props}) => {
	const {t} = useTranslation();
	const toast = useToast();
	const isMobile = useIsMobile();

	const {data: orgsData, loading: orgsLoading} = useQuery<{ organisaties: IOrganisatie[] }>(GetAllOrganisatiesQuery);
	const $rubrics = useQuery<{ rubrieken: IRubriek[] }>(GetAllRubricsQuery);

	const [isSubmitted, setSubmitted] = useState<boolean>(false);
	const [isActive, toggleActive] = useToggle(true);
	const [afspraakType, setAfspraakType] = useState<AfspraakType>(AfspraakType.Expense);
	const description = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const organizationId = useInput<number>({
		validate: [(v) => v !== undefined && v.toString() !== ""]
	});
	const rubriekId = useInput<number>();
	const rekeningId = useInput<number>({
		validate: [(v) => v !== undefined && v.toString() !== ""]
	});
	const amount = useNumberInput({
		min: 0,
		step: .01,
		validate: [v => new RegExp(/^([0-9]+)((,|\.)[0-9]{2})?$/).test(v.toString())]
	});
	const searchTerm = useInput({
		defaultValue: "",
	});
	const [isRecurring, toggleRecurring] = useToggle(false);
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
	const [isContinuous, toggleContinuous] = useToggle(true);
	const nTimes = useNumberInput({
		validate: [(v) => new RegExp(/^[0-9]+$/).test(v.toString())]
	});
	const intervalType = useInput<IntervalType>({
		defaultValue: IntervalType.Month,
		validate: [(v) => Object.values(IntervalType).includes(v)]
	})
	const intervalNumber = useInput({
		defaultValue: "",
		validate: [v => !isNaN(parseInt(v))]
	});
	const [isAutomatischeIncasso, toggleAutomatischeIncasso] = useToggle(true);

	useEffect(() => {
		if (organizationId.value) {
			if (orgsData && orgsData.organisaties) {
				const selectedOrg = orgsData.organisaties.find(o => o.id === parseInt(organizationId.value as unknown as string));

				if (selectedOrg && selectedOrg.rekeningen.length === 1) {
					rekeningId.setValue(selectedOrg.rekeningen[0].id);
				}
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [organizationId.value, orgsData]);

	useEffect(() => {
		if (afspraak) {
			toggleActive(afspraak.actief);
			setAfspraakType(afspraak.credit ? AfspraakType.Income : AfspraakType.Expense);
			description.setValue(afspraak.beschrijving);
			organizationId.setValue(afspraak.organisatie?.id || 0);
			rubriekId.setValue(afspraak.rubriek?.id || 0);
			if (afspraak.tegenRekening) {
				rekeningId.setValue(afspraak.tegenRekening.id);
			}
			amount.setValue(afspraak.bedrag);
			searchTerm.setValue(afspraak.kenmerk);
			const interval = Interval.parse(afspraak.interval);
			if (interval) {
				toggleRecurring(true);
				intervalType.setValue(interval.intervalType);
				intervalNumber.setValue(interval.count.toString());
			}
			const startDatum = new Date(afspraak.startDatum);
			startDate.day.setValue(startDatum.getDate());
			startDate.month.setValue(startDatum.getMonth() + 1);
			startDate.year.setValue(startDatum.getFullYear());
			if (afspraak.aantalBetalingen) {
				toggleContinuous(false);
				nTimes.setValue(afspraak.aantalBetalingen);
			}
			toggleAutomatischeIncasso(afspraak.automatischeIncasso)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [afspraak]);

	const prePopulateForm = () => {
		const c = sampleData.agreements[0];

		setAfspraakType(c.credit ? AfspraakType.Income : AfspraakType.Expense);
		description.setValue(c.omschrijving);
		organizationId.setValue(c.organisatie.id);
		if (c.organisatie?.rekeningen?.length > 0) {
			rekeningId.setValue(c.organisatie.rekeningen[0].id);
		}
		rubriekId.setValue(c.rubriek.id);
		amount.setValue(c.bedrag);
		searchTerm.setValue(c.kenmerk);
		toggleRecurring(c.type === AfspraakPeriod.Periodic);
		intervalType.setValue(IntervalType.Month);
		intervalNumber.setValue("3");
		startDate.day.setValue(parseInt(c.startDatum.split("-")[2]));
		startDate.month.setValue(parseInt(c.startDatum.split("-")[1]));
		startDate.year.setValue(parseInt(c.startDatum.split("-")[0]));
		toggleContinuous(c.isContinuous);
		nTimes.setValue(10);
	}

	const onSubmit = (e) => {
		e.preventDefault();
		setSubmitted(true);

		const fields: UseInput<any>[] = [
			description,
			organizationId,
			rubriekId,
			rekeningId,
			amount,
			searchTerm,
			startDate.day,
			startDate.month,
			startDate.year,
		];

		if (isRecurring) {
			fields.push(intervalType);
			fields.push(intervalNumber);

			if (!isContinuous) {
				fields.push(nTimes);
			}
		}


		const formValid = fields.every(f => f.isValid);
		if (!formValid) {
			toast({
				status: "error",
				title: t("messages.agreements.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		onSave({
			gebruikerId: gebruiker.id,
			credit: afspraakType === AfspraakType.Income,
			beschrijving: description.value,
			tegenRekeningId: rekeningId.value,
			organisatieId: parseInt(organizationId.value as unknown as string) !== 0 ? organizationId.value : null,
			...rubriekId.value && {rubriekId: rubriekId.value},
			bedrag: amount.value,
			kenmerk: searchTerm.value,
			startDatum: moment(Date.UTC(startDate.year.value, startDate.month.value - 1, startDate.day.value)).format("YYYY-MM-DD"),
			interval: isRecurring ? Interval.create(intervalType.value, intervalNumber.value) : Interval.empty,
			aantalBetalingen: !isContinuous ? nTimes.value : 0,
			actief: isActive,
			automatischeIncasso: afspraakType === AfspraakType.Expense ? isAutomatischeIncasso : null,
		});
	};

	const isInvalid = (input) => (input.dirty || isSubmitted) && !input.isValid;
	const onChangeAfspraakType = val => {
		console.log(val);
		if (val) {
			setAfspraakType(val);
		}
	};

	const afspraakTypeOptions = {
		[AfspraakType.Income]: t("forms.agreements.fields.income"),
		[AfspraakType.Expense]: t("forms.agreements.fields.expenses")
	};
	const isRecurringOptions = {
		[AfspraakPeriod.Once]: t("forms.agreements.fields.isRecurring_once"),
		[AfspraakPeriod.Periodic]: t("forms.agreements.fields.isRecurring_periodic")
	};

	return (<>
		{isDev && (
			<Button maxWidth={350} mb={5} colorScheme={"yellow"} variant={"outline"} onClick={() => prePopulateForm()}>Formulier snel invullen met testdata</Button>
		)}

		<Box as={"form"} onSubmit={onSubmit} {...props}>
			<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
				<Stack spacing={2} direction={isMobile ? "column" : "row"}>
					<FormLeft>
						<Heading size={"md"}>{t("forms.agreements.sections.0.title")}</Heading>
						<Text id="personal-helperText">{t("forms.agreements.sections.0.helperText")}</Text>
					</FormLeft>
					<FormRight>
						{/*<Stack spacing={2} direction={isMobile ? "column" : "row"}>*/}
						{/*	<Stack direction={isMobile ? "column" : "row"} spacing={1} mt={2}>*/}
						{/*		<Stack isInline={true} alignItems={"center"} spacing={3}>*/}
						{/*			<Switch isChecked={isActive} onChange={() => toggleActive()} id={"isActive"} />*/}
						{/*			<FormLabel htmlFor={"isActive"}>{isActive ? t("forms.agreements.fields.active") : t("forms.agreements.fields.inactive")}</FormLabel>*/}
						{/*		</Stack>*/}
						{/*	</Stack>*/}
						{/*</Stack>*/}

						<RadioButtonGroup name={"afspraakType"} onChange={onChangeAfspraakType} defaultValue={AfspraakType.Expense} value={afspraakType} options={afspraakTypeOptions} />

						<Stack spacing={2} direction={isMobile ? "column" : "row"}>
							<Stack spacing={1} flex={1}>
								<FormLabel htmlFor={"description"}>{t("forms.agreements.fields.description")}</FormLabel>
								<Input isInvalid={isInvalid(description)} {...description.bind} id="description" />
							</Stack>
						</Stack>
						<Stack spacing={2} direction={isMobile ? "column" : "row"}>
							<Stack spacing={1} flex={1}>
								<FormLabel htmlFor={"organizationId"}>{t("forms.agreements.fields.organization")}</FormLabel>
								{orgsLoading ? (<Spinner />) : (<Select {...organizationId.bind} isInvalid={isInvalid(organizationId)} id="organizationId"
								                                        value={organizationId.value}>
									<option>{t("forms.agreements.fields.organizationChoose")}</option>
									{orgsData?.organisaties.map(o => (
										<option key={"o" + o.id} value={o.id}>{o.weergaveNaam}</option>
									))}
									<option value={0}>{gebruiker.voorletters} {gebruiker.achternaam}</option>
								</Select>)}
							</Stack>
							<Stack spacing={1} flex={1}>
								<FormLabel htmlFor={"rekeningId"}>{t("forms.agreements.fields.bankAccount")}</FormLabel>
								<Select {...rekeningId.bind} isInvalid={isInvalid(rekeningId)} id="rekeningId" value={rekeningId.value}>
									<option>{t("forms.agreements.fields.bankAccountChoose")}</option>
									{parseInt(organizationId.value as unknown as string) === 0 ? (<>
										{gebruiker.rekeningen.map(r => (
											<option key={r.id} value={r.id}>{r.rekeninghouder} ({r.iban})</option>
										))}
									</>) : (<>
										{orgsData?.organisaties.find(o => o.id === parseInt(organizationId.value as unknown as string))?.rekeningen.map(r => (
											<option key={r.id} value={r.id}>{r.rekeninghouder} ({r.iban})</option>
										))}
									</>)}
								</Select>
							</Stack>
						</Stack>
						<Stack spacing={2} direction={isMobile ? "column" : "row"}>
							<Stack spacing={1} flex={1}>
								<FormLabel htmlFor={"amount"}>{t("forms.agreements.fields.amount")}</FormLabel>
								<InputGroup maxWidth={"100%"} flex={1}>
									<InputLeftElement>&euro;</InputLeftElement>
									<Input isInvalid={isInvalid(amount)} {...amount.bind} id="amount" />
								</InputGroup>
							</Stack>
							<Stack spacing={1} flex={1}>
								<FormLabel htmlFor={"searchTerm"}>{t("forms.agreements.fields.searchTerm")}</FormLabel>
								<Input isInvalid={isInvalid(searchTerm)} {...searchTerm.bind} id="searchTerm" />
							</Stack>
						</Stack>
						<Stack spacing={2} direction={isMobile ? "column" : "row"}>
							<Stack spacing={1} flex={1}>
								<FormLabel htmlFor={"accountId"}>{t("forms.agreements.fields.rubriek")}</FormLabel>
								<Queryable query={$rubrics}>{(data) => (
									<Select {...rubriekId.bind} isInvalid={isInvalid(rubriekId)} id="rubriekId" value={rubriekId.value}>
										<option value="">{t("forms.agreements.fields.rubriekChoose")}</option>
										{data.rubrieken.map(o => (
											<option key={"o" + o.id} value={o.id}>{o.naam}</option>
										))}
									</Select>
								)}</Queryable>
							</Stack>
						</Stack>
					</FormRight>
				</Stack>

				<Divider />

				<Stack spacing={2} direction={isMobile ? "column" : "row"}>
					<FormLeft>
						<Heading size={"md"}>{t("forms.agreements.sections.1.title")}</Heading>
						<Text data-legacy="FormHelperText" id="personal-helperText">{t("forms.agreements.sections.1.helperText")}</Text>
					</FormLeft>
					<FormRight>

						<Stack spacing={2} direction={isMobile ? "column" : "row"}>
							<RadioButtonGroup name={"isRecurring"} onChange={(val) => toggleRecurring(val === AfspraakPeriod.Periodic)} value={isRecurring ? AfspraakPeriod.Periodic : AfspraakPeriod.Once} options={isRecurringOptions} />
						</Stack>

						{isRecurring && (
							<Stack direction={isMobile ? "column" : "row"} spacing={1} mt={2}>
								<Stack spacing={1} flex={1}>
									<Stack direction={"row"} alignItems={"center"}>
										<FormLabel htmlFor={"interval"}>{t("interval.every")}</FormLabel>
										<Input type={"number"} min={1} {...intervalNumber.bind} width={100} id={"interval"} />
										<Select {...intervalType.bind} id="interval" value={intervalType.value}>
											<option value={"day"}>{t("interval.day", {count: parseInt(intervalNumber.value)})}</option>
											<option value={"week"}>{t("interval.week", {count: parseInt(intervalNumber.value)})}</option>
											<option value={"month"}>{t("interval.month", {count: parseInt(intervalNumber.value)})}</option>
											<option value={"year"}>{t("interval.year", {count: parseInt(intervalNumber.value)})}</option>
										</Select>
									</Stack>
								</Stack>
							</Stack>
						)}

						<Stack direction={isMobile ? "column" : "row"} spacing={1}>
							<Stack spacing={1} flex={1}>
								{isRecurring ? (
									<FormLabel htmlFor={"startDate.day"}>{t("forms.agreements.fields.startDate")}</FormLabel>
								) : (
									<FormLabel htmlFor={"startDate.day"}>{t("forms.common.fields.date")}</FormLabel>
								)}
								<Stack justifyContent={"flex-start"} direction={"row"} spacing={1} maxWidth={isMobile ? "100%" : 280} width={"100%"}>
									<Box flex={1}><Input isInvalid={isInvalid(startDate.day)} {...startDate.day.bind} id="startDate.day" /></Box>
									<Box flex={1}><Input isInvalid={isInvalid(startDate.month)} {...startDate.month.bind} id="startDate.month" /></Box>
									<Box flex={1}><Input isInvalid={isInvalid(startDate.year)} {...startDate.year.bind} id="startDate.year" /></Box>
								</Stack>
							</Stack>
						</Stack>

						{isRecurring && (
							<Stack direction={isMobile ? "column" : "row"} spacing={1} mt={2}>
								<Stack isInline={true} alignItems={"center"} spacing={3}>
									<Switch isChecked={isContinuous} onChange={() => toggleContinuous()} id={"isContinuous"} />
									<FormLabel mb={0} htmlFor={"isContinuous"}>{t("forms.agreements.fields.continuous")}</FormLabel>
								</Stack>
							</Stack>
						)}

						{isRecurring && !isContinuous && (
							<Stack direction={isMobile ? "column" : "row"} spacing={1}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"nTimes"}>{t("forms.agreements.fields.nTimes")}</FormLabel>
									<Input type={"number"} {...nTimes.bind} width={100} id={"nTimes"} />
								</Stack>
							</Stack>
						)}

						{afspraakType === AfspraakType.Expense && (
							<Stack direction={isMobile ? "column" : "row"} spacing={1} mt={2}>
								<Stack isInline={true} alignItems={"center"} spacing={3}>
									<Switch isChecked={isAutomatischeIncasso} onChange={() => toggleAutomatischeIncasso()}
										id={"isAutomatischeIncasso"} />
									<FormLabel mb={0}
										htmlFor={"isAutomatischeIncasso"}>{t("forms.agreements.fields.automatischeIncasso")}</FormLabel>
								</Stack>
							</Stack>
						)}

					</FormRight>
				</Stack>

				<Divider />

				<Stack direction={isMobile ? "column" : "row"} spacing={2}>
					<FormLeft />
					<FormRight>
						<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
							<Button isLoading={loading} type={"submit"} colorScheme={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
						</Stack>
					</FormRight>
				</Stack>
			</Stack>
		</Box>
	</>);
};

export default AfspraakForm;