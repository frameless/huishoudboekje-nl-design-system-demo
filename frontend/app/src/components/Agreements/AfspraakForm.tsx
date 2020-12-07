import {Box, BoxProps, Button, Divider, FormLabel, Input, InputGroup, InputLeftElement, Select, Stack, Switch, useToast,} from "@chakra-ui/react";
import moment from "moment";
import "moment-recur-ts";
import React, {useEffect, useState} from "react";
import {useInput, useIsMobile, useNumberInput, useToggle, Validators} from "react-grapple";
import {UseInput} from "react-grapple/dist/hooks/useInput";
import {useTranslation} from "react-i18next";
import {sampleData} from "../../config/sampleData/sampleData";
import {Afspraak, Gebruiker, Interval, Organisatie, Overschrijving, OverschrijvingStatus, useGetAllOrganisatiesQuery, useGetAllRubriekenQuery} from "../../generated/graphql";
import {AfspraakPeriod, AfspraakType, IntervalType,} from "../../models";
import Queryable from "../../utils/Queryable";
import {isDev, XInterval} from "../../utils/things";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import RadioButtonGroup from "../Layouts/RadioButtons/RadioButtonGroup";
import OverschrijvingenListView from "../Overschrijvingen/OverschrijvingenListView";

const maxOverschrijvingenInList = 12;
type SampleOverschrijvingenProps = { bedrag: number, startDate: Date, interval: Interval, nTimes: number };
const sampleOverschrijvingen = ({bedrag, startDate, interval, nTimes = 0}: SampleOverschrijvingenProps): Overschrijving[] => {
	const o: Overschrijving = {
		export: {},
		datum: "",
		bedrag,
		status: OverschrijvingStatus.Verwachting
	};

	const parsedInterval = XInterval.parse(interval);
	const _nTimes = nTimes === 0 ? maxOverschrijvingenInList : nTimes;

	if (!parsedInterval || !moment(startDate).isValid()) {
		return [];
	}

	const recursion = moment(startDate).recur().every(parsedInterval.count)[parsedInterval.intervalType]();
	const nextDates = [moment(startDate), ...recursion.next(_nTimes)];
	return nextDates.map(m => ({
		...o,
		datum: m.toDate()
	}));
};

type AfspraakFormProps = { afspraak?: Afspraak, onSave: (data) => void, burger?: Gebruiker, loading: boolean };
const AfspraakForm: React.FC<BoxProps & AfspraakFormProps> = ({afspraak, onSave, loading = false, ...props}) => {
	const {t} = useTranslation();
	const toast = useToast();
	const isMobile = useIsMobile();
	const gebruiker = afspraak?.gebruiker || props.burger;
	if (!gebruiker) {
		throw new Error("Missing property gebruiker.");
	}

	const {rekeningen = []} = gebruiker;
	const [isSubmitted, setSubmitted] = useState<boolean>(false);

	const $rubrics = useGetAllRubriekenQuery();
	const $organisaties = useGetAllOrganisatiesQuery();

	const [isActive, toggleActive] = useToggle(true);
	const [afspraakType, setAfspraakType] = useState<AfspraakType>(AfspraakType.Expense);
	const description = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const organisatieId = useInput({
		validate: [(v) => v !== undefined && v.toString() !== ""]
	});
	const rubriekId = useInput({
		validate: [Validators.required]
	});
	const rekeningId = useInput({
		validate: [(v) => v !== undefined && v.toString() !== ""]
	});
	const amount = useNumberInput({
		min: 0,
		step: .01,
		validate: [(v) => new RegExp(/^([0-9]+)((,|\.)[0-9]{2})?$/).test(v.toString())]
	});
	const searchTerm = useInput({
		defaultValue: "",
	});
	const [isRecurring, toggleRecurring] = useToggle(false);
	const startDate = useInput({
		placeholder: moment().format("L"),
		validate: [(v: string) => moment(v, "L").isValid()]
	});
	const [isContinuous, _toggleContinuous] = useToggle(true);
	const toggleContinuous = (...args) => {
		_toggleContinuous(...args);
		if (!isContinuous) {
			nTimes.reset();
		}
	};
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
		if (afspraak) {
			toggleActive(afspraak.actief);
			setAfspraakType(afspraak.credit ? AfspraakType.Income : AfspraakType.Expense);
			description.setValue(afspraak.beschrijving || "");
			organisatieId.setValue((afspraak.organisatie?.id || 0).toString());
			rubriekId.setValue((afspraak.rubriek?.id || 0).toString());
			if (afspraak.tegenRekening) {
				rekeningId.setValue((afspraak.tegenRekening?.id || 0).toString());
			}
			amount.setValue(afspraak.bedrag);
			searchTerm.setValue(afspraak.kenmerk || "");
			const interval = XInterval.parse(afspraak.interval);
			if (interval) {
				toggleRecurring(true);
				intervalType.setValue(interval.intervalType);
				intervalNumber.setValue(interval.count.toString());
			}
			const startDatum = new Date(afspraak.startDatum);
			startDate.setValue(moment(startDatum).format("L"));
			if (afspraak.aantalBetalingen) {
				toggleContinuous(false);
				nTimes.setValue(afspraak.aantalBetalingen);
			}
			toggleAutomatischeIncasso(afspraak.automatischeIncasso)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [afspraak]);

	/* When an organisatie is selected, and it has one rekening, prefill the rekeningId input with that rekening. */
	useEffect(() => {
		const {organisaties = []} = $organisaties.data || {};

		const selectedOrg = organisaties.find(o => o.id === parseInt(organisatieId.value));
		if (selectedOrg) {
			const {rekeningen = []} = selectedOrg;

			if (rekeningen.length === 1 && rekeningen[0].id) {
				rekeningId.setValue((rekeningen[0].id || 0).toString());
			}
		}
	}, [$organisaties.data, organisatieId.value, rekeningId]);

	const prePopulateForm = () => {
		const c = sampleData.agreements[0];

		setAfspraakType(c.credit ? AfspraakType.Income : AfspraakType.Expense);
		description.setValue(c.omschrijving);
		organisatieId.setValue(c.organisatie.id);
		if (c.organisatie?.rekeningen?.length > 0) {
			rekeningId.setValue(c.organisatie.rekeningen[0].id);
		}
		rubriekId.setValue(c.rubriek.id);
		amount.setValue(c.bedrag);
		searchTerm.setValue(c.kenmerk);
		toggleRecurring(c.type === AfspraakPeriod.Periodic);
		intervalType.setValue(IntervalType.Month);
		intervalNumber.setValue("3");
		startDate.setValue(moment(c.startDatum).format("L"));
		toggleContinuous(c.isContinuous);
		nTimes.setValue(10);
	}

	const onSubmit = (e) => {
		e.preventDefault();
		setSubmitted(true);

		const fields: UseInput<any>[] = [
			description,
			organisatieId,
			rubriekId,
			rekeningId,
			amount,
			searchTerm,
			startDate,
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
			organisatieId: parseInt(organisatieId.value) !== 0 ? organisatieId.value : null,
			...rubriekId.value && {rubriekId: rubriekId.value},
			bedrag: amount.value,
			kenmerk: searchTerm.value,
			startDatum: moment(startDate.value, "DD MM YYYY").format("YYYY-MM-DD"),
			interval: isRecurring ? XInterval.create(intervalType.value, intervalNumber.value) : XInterval.empty,
			aantalBetalingen: !isContinuous ? nTimes.value : 0,
			actief: isActive,
			automatischeIncasso: afspraakType === AfspraakType.Expense ? isAutomatischeIncasso : null,
		});
	};

	const isInvalid = (input) => (input.dirty || isSubmitted) && !input.isValid;
	const onChangeAfspraakType = val => {
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
					<FormLeft title={t("forms.agreements.sections.0.title")} helperText={t("forms.agreements.sections.0.helperText")} />
					<FormRight>
						<RadioButtonGroup name={"afspraakType"} onChange={onChangeAfspraakType} defaultValue={AfspraakType.Expense} value={afspraakType}
						                  options={afspraakTypeOptions} />

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
						<Stack spacing={2} direction={isMobile ? "column" : "row"}>
							<Stack spacing={1} flex={1}>
								<FormLabel htmlFor={"description"}>{t("forms.agreements.fields.description")}</FormLabel>
								<Input isInvalid={isInvalid(description)} {...description.bind} id="description" />
							</Stack>
						</Stack>
						<Stack spacing={2} direction={isMobile ? "column" : "row"}>
							<Stack spacing={1} flex={1}>
								<FormLabel htmlFor={"organisatieId"}>{t("forms.agreements.fields.organization")}</FormLabel>
								<Queryable query={$organisaties}>{({organisaties = []}: { organisaties: Organisatie[] }) => {
									return (
										<Select {...organisatieId.bind} isInvalid={isInvalid(organisatieId)} id="organizationId" value={organisatieId.value}>
											<option>{t("forms.agreements.fields.organizationChoose")}</option>
											{organisaties.map(o => (
												<option key={"o" + o.id} value={o.id}>{o.weergaveNaam}</option>
											))}
											<option value={0}>{gebruiker.voorletters} {gebruiker.achternaam}</option>
										</Select>
									);
								}}
								</Queryable>
							</Stack>
							<Stack spacing={1} flex={1}>
								<FormLabel htmlFor={"rekeningId"}>{t("forms.agreements.fields.bankAccount")}</FormLabel>
								<Queryable query={$organisaties}>{({organisaties = []}: { organisaties: Organisatie[] }) => {
									const organisatieRekeningen = organisaties.find(o => o.id === parseInt(organisatieId.value))?.rekeningen || [];

									return (
										<Select {...rekeningId.bind} isInvalid={isInvalid(rekeningId)} id="rekeningId" value={rekeningId.value}>
											<option>{t("forms.agreements.fields.bankAccountChoose")}</option>
											{parseInt(organisatieId.value) === 0 ? (<>
												{rekeningen.map(r => (
													<option key={r.id} value={r.id}>{r.rekeninghouder} ({r.iban})</option>
												))}
											</>) : (<>
												{organisatieRekeningen.map(r => (
													<option key={r.id} value={r.id}>{r.rekeninghouder} ({r.iban})</option>
												))}
											</>)}
										</Select>
									);
								}}
								</Queryable>
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
					</FormRight>
				</Stack>

				<Divider />

				<Stack spacing={2} direction={isMobile ? "column" : "row"}>
					<FormLeft title={t("forms.agreements.sections.1.title")} helperText={t("forms.agreements.sections.1.helperText")} />
					<FormRight>

						<Stack spacing={2} direction={isMobile ? "column" : "row"}>
							<RadioButtonGroup name={"isRecurring"} onChange={(val) => toggleRecurring(val === AfspraakPeriod.Periodic)}
							                  value={isRecurring ? AfspraakPeriod.Periodic : AfspraakPeriod.Once} options={isRecurringOptions} />
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
								<FormLabel htmlFor={"startDate"}>{isRecurring ? t("forms.agreements.fields.startDate") : t("forms.common.fields.date")}</FormLabel>
								<Input isInvalid={isInvalid(startDate)} {...startDate.bind} id="startDate" />
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
					<FormLeft title={t("forms.agreements.sections.2.title")} helperText={t("forms.agreements.sections.2.helperText", {max: maxOverschrijvingenInList})} />
					<FormRight>
						<OverschrijvingenListView overschrijvingen={sampleOverschrijvingen({
							bedrag: amount.value,
							startDate: moment(startDate.value, "L").toDate(),
							nTimes: nTimes.value || 0,
							interval: XInterval.create(intervalType.value, intervalNumber.value)
						})} />
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