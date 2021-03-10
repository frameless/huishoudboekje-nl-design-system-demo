import {SearchIcon, WarningIcon} from "@chakra-ui/icons";
import {
	Badge,
	Box,
	BoxProps,
	Button,
	Divider,
	FormLabel,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Stack,
	Switch,
	Table,
	Tbody,
	Td,
	Text,
	Tr,
	useToast,
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {useInput, useNumberInput, useToggle, Validators} from "react-grapple";
import {UseInput} from "react-grapple/dist/hooks/useInput";
import {Trans, useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Select from "react-select";
import Routes from "../../config/routes";
import {Afspraak, Burger, Organisatie, Rekening, Rubriek, useGetAfspraakFormDataQuery} from "../../generated/graphql";
import {AfspraakPeriod, AfspraakType, IntervalType} from "../../models/models";
import d from "../../utils/dayjs";
import Queryable from "../../utils/Queryable";
import generateSampleOverschrijvingen from "../../utils/sampleOverschrijvingen";
import {currencyFormat2, formatBurgerName, formatIBAN, intervalString, useReactSelectStyles, XInterval} from "../../utils/things";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import RadioButtonGroup from "../Layouts/RadioButtons/RadioButtonGroup";
import Section from "../Layouts/Section";
import OverschrijvingenListView from "../Overschrijvingen/OverschrijvingenListView";

type AfspraakFormProps = {afspraak?: Afspraak, onSave: (data) => void, burger?: Burger, loading: boolean};
const AfspraakForm: React.FC<BoxProps & AfspraakFormProps> = ({afspraak, onSave, loading = false, ...props}) => {
	const {t} = useTranslation();
	const toast = useToast();
	const reactSelectStyles = useReactSelectStyles();
	const burger = afspraak?.burger || props.burger;
	if (!burger) {
		throw new Error("Missing property burger.");
	}

	const [isSubmitted, setSubmitted] = useState<boolean>(false);
	const [zoektermDuplicates, setZoektermDuplicates] = useState<Afspraak[]>([]);

	const $afspraakFormData = useGetAfspraakFormDataQuery({
		fetchPolicy: "no-cache",
	});

	const [isActive, toggleActive] = useToggle(true);
	const [afspraakType, setAfspraakType] = useState<AfspraakType>(AfspraakType.Expense);
	const description = useInput({
		defaultValue: "",
		validate: [Validators.required],
	});
	const organisatieId = useInput({
		validate: [(v) => v !== undefined && v.toString() !== ""],
	});
	const rubriekId = useInput({
		validate: [Validators.required],
	});
	const rekeningId = useInput({
		validate: [(v) => v !== undefined && v.toString() !== ""],
	});
	const amount = useNumberInput({
		min: 0,
		step: .01,
		validate: [(v) => new RegExp(/^([0-9]+)(([,.])[0-9]{2})?$/).test(v.toString())],
	});
	const zoekterm = useInput({
		defaultValue: "",
		validate: [(v) => (String(v).length === 0 || String(v).length >= 6)],
	});
	const [isRecurring, toggleRecurring] = useToggle(false);
	const startDate = useInput({
		placeholder: d().format("L"),
		defaultValue: d().format("L"),
		validate: [(v: string) => d(v, "L").isValid()],
	});
	const startDate2 = useInput({
		placeholder: d().format("L"),
		defaultValue: d().format("L"),
		validate: [(v: string) => d(v, "L").isValid()],
	});
	const endDate = useInput({
		placeholder: d().format("L"),
		defaultValue: (d(startDate.value, "L").isValid() ? d(startDate.value, "L") : d()).add(1, "year").subtract(1, "day").format("L"),
		validate: [(v: string) => d(v, "L").isValid()],
	});
	const [isContinuous, _toggleContinuous] = useToggle(true);
	const toggleContinuous = (...args) => {
		_toggleContinuous(...args);
		if (!isContinuous) {
			nTimes.reset();
		}
	};
	const nTimes = useNumberInput({
		validate: [(v) => new RegExp(/^[0-9]+$/).test(v.toString())],
	});
	const [automatischBoeken, toggleAutomatischBoeken] = useToggle(false);
	const intervalType = useInput<IntervalType | undefined>({
		validate: [(v) => v !== undefined && Object.values(IntervalType).includes(v)],
	});
	const intervalNumber = useInput({
		defaultValue: "",
		validate: [v => !isNaN(parseInt(v))],
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
			zoekterm.setValue(afspraak.kenmerk || "");
			const interval = XInterval.parse(afspraak.interval);
			if (interval) {
				toggleRecurring(true);
				intervalType.setValue(interval.intervalType);
				intervalNumber.setValue(interval.count.toString());
			}
			const startDatum = new Date(afspraak.startDatum);
			startDate.setValue(d(startDatum).format("L"));
			startDate2.setValue(d(startDatum).format("L"));
			endDate.setValue(d(startDatum).add(1, "year").subtract(1, "day").format("L"));
			if (afspraak.aantalBetalingen) {
				toggleContinuous(false);
				nTimes.setValue(afspraak.aantalBetalingen);
			}
			toggleAutomatischBoeken(afspraak.automatischBoeken);
			toggleAutomatischeIncasso(afspraak.automatischeIncasso);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [afspraak]);

	useEffect(() => {
		const zoektermString = String(zoekterm.value);
		if (zoektermString.length === 0) {
			setZoektermDuplicates([]);
		}
		else {
			const dupesByZoekterm: Afspraak[] = ($afspraakFormData.data?.afspraken || []).filter(a => {
				if (afspraak?.id === a.id || !a.kenmerk) {
					return false;
				}

				/* If the tegenRekening matches */
				if (parseInt(rekeningId.value) === a.tegenRekening?.id && a.kenmerk?.length > 0) {
					/* Check if this afspraak has (partly or whole) the same zoekterm */
					if ((a.kenmerk.length > 0 ? zoektermString.includes(a.kenmerk) : false) || a.kenmerk?.includes(zoektermString)) {
						return true;
					}
				}

				return false;
			});

			setZoektermDuplicates(dupesByZoekterm);
			if (dupesByZoekterm.length > 0) {
				toggleAutomatischBoeken(false);
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [zoekterm.value, $afspraakFormData.data, afspraak, rekeningId.value]);

	const onSubmit = (e) => {
		e.preventDefault();
		setSubmitted(true);

		const fields: UseInput<any>[] = [
			description,
			organisatieId,
			rubriekId,
			rekeningId,
			amount,
			zoekterm,
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
				isClosable: true,
			});
			return;
		}

		onSave({
			burgerId: burger.id,
			credit: afspraakType === AfspraakType.Income,
			beschrijving: description.value,
			tegenRekeningId: parseInt(rekeningId.value),
			organisatieId: parseInt(organisatieId.value) !== 0 ? parseInt(organisatieId.value) : null,
			rubriekId: parseInt(rubriekId.value) !== 0 ? parseInt(rubriekId.value) : null,
			bedrag: amount.value,
			kenmerk: zoekterm.value,
			startDatum: d(startDate.value, "L").format("YYYY-MM-DD"),
			interval: isRecurring ? XInterval.create(intervalType.value!, intervalNumber.value) : XInterval.empty,
			aantalBetalingen: isContinuous ? 1 : nTimes.value,
			actief: isActive,
			automatischeIncasso: afspraakType === AfspraakType.Expense ? isAutomatischeIncasso : undefined,
			automatischBoeken,
		});
	};

	const isInvalid = (input) => (input.dirty || isSubmitted) && !input.isValid;
	const onChangeAfspraakType = val => {
		if (val) {
			setAfspraakType(val);
			rubriekId.clear();
		}
	};

	const afspraakTypeOptions = {
		[AfspraakType.Income]: t("forms.agreements.fields.income"),
		[AfspraakType.Expense]: t("forms.agreements.fields.expenses"),
	};
	const isRecurringOptions = {
		[AfspraakPeriod.Once]: t("forms.agreements.fields.isRecurring_once"),
		[AfspraakPeriod.Periodic]: t("forms.agreements.fields.isRecurring_periodic"),
	};

	const generatedSampleOverschrijvingen = generateSampleOverschrijvingen({
		bedrag: amount.value,
		startDate: d(startDate.value, "L").toDate(),
		startDate2: d(startDate2.value, "L").toDate(),
		endDate: d(endDate.value, "L").toDate(),
		nTimes: nTimes.value || 0,
		interval: XInterval.create(intervalType.value!, intervalNumber.value),
	});

	const HugeDatePicker = () => {
		const components = {
			strong: <strong />,
			start: <DatePicker selected={d(startDate2.value, "L").isValid() ? d(startDate2.value, "L").toDate() : null}
							   dateFormat={"dd-MM-yyyy"}
							   onChange={(value: Date) => {
								   if (value) {
									   startDate2.setValue(d(value).format("L"));
								   }
							   }} customInput={(<Button size={"sm"} mx={1}>{startDate2.value}</Button>)} />,
			end: <DatePicker selected={d(endDate.value, "L").isValid() ? d(endDate.value, "L").toDate() : null}
							 dateFormat={"dd-MM-yyyy"}
							 onChange={(value: Date) => {
								 if (value) {
									 endDate.setValue(d(value).format("L"));
								 }
							 }} customInput={(<Button size={"sm"} mx={1}>{endDate.value}</Button>)} />,
		};
		const outgoingTrans = <Trans count={generatedSampleOverschrijvingen.length} i18nKey={"forms.agreements.sections.2.prognosisText_outgoing"}
									 components={components} values={{ count: generatedSampleOverschrijvingen.length}} />;
		const incomingTrans = <Trans count={generatedSampleOverschrijvingen.length} i18nKey={"forms.agreements.sections.2.prognosisText_incoming"}
									 components={components} values={{ count: generatedSampleOverschrijvingen.length}} />;

		return (
			<Text>
				{afspraakType === AfspraakType.Expense ? outgoingTrans : incomingTrans}
			</Text>
		);
	};

	const filterRubriekenByAfspraakType = (r: Rubriek) => afspraakType === AfspraakType.Expense ? !r.grootboekrekening?.credit : r.grootboekrekening?.credit;

	const onSelectRubriek = (val) => {
		if (val) {
			rubriekId.setValue(String(val.key));
		}
		else {
			rubriekId.reset();
		}
	};
	const onSelectOrganisatie = (val) => {
		rekeningId.reset();

		if (val) {
			organisatieId.setValue(String(val.key));

			if ($afspraakFormData.data?.organisaties) {
				const foundOrganisatie = $afspraakFormData.data.organisaties.find(o => o.id === val.value);
				if (foundOrganisatie) {
					const {rekeningen = []} = foundOrganisatie;

					if (rekeningen.length === 1 && rekeningen[0].id) {
						rekeningId.setValue(String(rekeningen[0].id || 0));
					}
				}
			}
		}
		else {
			organisatieId.reset();
		}
	};
	const onSelectRekening = (val) => {
		if (val) {
			rekeningId.setValue(String(val.key));
		}
		else {
			rekeningId.reset();
		}
	};

	const intervalOptions = [
		{key: "day", label: t("interval.day", {count: parseInt(intervalNumber.value)}), value: IntervalType.Day},
		{key: "week", label: t("interval.week", {count: parseInt(intervalNumber.value)}), value: IntervalType.Week},
		{key: "month", label: t("interval.month", {count: parseInt(intervalNumber.value)}), value: IntervalType.Month},
		{key: "year", label: t("interval.year", {count: parseInt(intervalNumber.value)}), value: IntervalType.Year},
	];

	const automatischBoekenPossible = (zoekterm.value.length > 0 && zoektermDuplicates.length === 0);
	return (
		<Stack spacing={5} as={"form"} onSubmit={onSubmit} {...props}>
			<Section>
				<Stack spacing={5} divider={<Divider />}>
					<Stack spacing={2} direction={["column", "row"]}>
						<FormLeft title={t("forms.agreements.sections.0.title")} helperText={t("forms.agreements.sections.0.helperText")} />
						<FormRight>
							<RadioButtonGroup name={"afspraakType"} onChange={onChangeAfspraakType} defaultValue={AfspraakType.Expense} value={afspraakType} options={afspraakTypeOptions} />

							<Stack spacing={2} direction={["column", "row"]}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"accountId"}>{t("forms.agreements.fields.rubriek")}</FormLabel>
									<Queryable query={$afspraakFormData}>{(data: {rubrieken: Rubriek[]}) => {
										const options = data.rubrieken.filter(r => r.grootboekrekening && r.grootboekrekening.id).filter(filterRubriekenByAfspraakType).map((r: Rubriek) => ({
											key: r.id,
											label: r.naam,
											value: r.grootboekrekening!.id,
										}));
										const value = options.find(r => r.key === parseInt(rubriekId.value));

										return (
											<Select onChange={onSelectRubriek} id="rubriekId" isClearable={true} noOptionsMessage={() => t("forms.agreements.fields.rubriekChoose")}
												maxMenuHeight={200} options={options} value={value || null} styles={reactSelectStyles} />
										);
									}}</Queryable>
								</Stack>
							</Stack>
							<Stack spacing={2} direction={["column", "row"]}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"description"}>{t("forms.agreements.fields.description")}</FormLabel>
									<Input isInvalid={isInvalid(description)} {...description.bind} id="description" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={["column", "row"]}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"beneficiaryId"}>{t("forms.agreements.fields.beneficiary")}</FormLabel>
									<Queryable query={$afspraakFormData}>{(data: {organisaties: Organisatie[]}) => {
										const options = [
											...data.organisaties.map(o => ({
												key: o.id,
												label: o.weergaveNaam,
												value: o.id,
											})),
											{
												key: 0,
												label: formatBurgerName(burger),
												value: 0,
											},
										];
										const value = options.find(o => o.key === parseInt(organisatieId.value));

										return (
											<Select onChange={onSelectOrganisatie} id="beneficiaryId" isClearable={true} noOptionsMessage={() => t("select.noOptions")}
												maxMenuHeight={200} options={options} value={value} styles={reactSelectStyles} />
										);
									}}
									</Queryable>
								</Stack>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"rekeningId"}>{t("forms.agreements.fields.bankAccount")}</FormLabel>
									<Queryable query={$afspraakFormData}>{(data: {organisaties: Organisatie[]}) => {
										if (!data.organisaties) {
											return null;
										}

										let rekeningen: Rekening[];
										if (parseInt(organisatieId.value) === 0) {
											rekeningen = burger.rekeningen || [];
										}
										else {
											rekeningen = data.organisaties.find(o => o.id === parseInt(organisatieId.value))?.rekeningen || [];
										}

										const options = rekeningen.map(r => ({
											key: r.id,
											label: `${formatIBAN(r.iban)} (${r.rekeninghouder})`,
											value: r.id,
										}));
										const value = options.find(r => r.key === parseInt(rekeningId.value));

										return (
											<Select onChange={onSelectRekening} id="rekeningId" isClearable={true} noOptionsMessage={() => t("forms.agreements.fields.bankAccountChoose")}
												maxMenuHeight={200} options={options} value={value} styles={reactSelectStyles} />
										);
									}}
									</Queryable>
								</Stack>
							</Stack>
							<Stack spacing={2} direction={["column", "row"]}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"amount"}>{t("forms.agreements.fields.amount")}</FormLabel>
									<InputGroup maxWidth={"100%"} flex={1}>
										<InputLeftElement zIndex={0}>&euro;</InputLeftElement>
										<Input isInvalid={isInvalid(amount)} {...amount.bind} id="amount" />
									</InputGroup>
								</Stack>
							</Stack>
						</FormRight>
					</Stack>

					<Stack spacing={2} direction={["column", "row"]}>
						<FormLeft title={t("forms.agreements.sections.3.title")} helperText={t("forms.agreements.sections.3.helperText")} />
						<FormRight>
							<Stack spacing={1} flex={1}>
								<Queryable query={$afspraakFormData} children={() => (<>
									<FormLabel htmlFor={"zoekterm"}>{t("forms.agreements.fields.zoekterm")}</FormLabel>
									<InputGroup>
										<Input isInvalid={isInvalid(zoekterm)} {...zoekterm.bind} id="searchTerm" />
										{zoektermDuplicates.length > 0 && <InputRightElement> <WarningIcon color={"orange.500"} /> </InputRightElement>}
									</InputGroup>
									{zoektermDuplicates.length > 0 && (
										<Stack spacing={1}>
											<Text fontSize={"sm"}>{t("forms.agreements.fields.searchtermDuplicateFound", {count: zoektermDuplicates.length})}</Text>
											<Table>
												<Tbody>
													{zoektermDuplicates.map(a => (
														<Tr key={a.id}>
															<Td>{formatBurgerName(a.burger)}</Td>
															<Td>
																<Stack spacing={1} flex={1} alignItems={"flex-end"}>
																	<Box textAlign={"right"} color={a.bedrag < 0 ? "orange.500" : "currentcolor"}>{currencyFormat2().format(a.bedrag)}</Box>
																	<Badge fontSize={"10px"}>{intervalString(a.interval, t)}</Badge>
																</Stack>
															</Td>
															<Td width={"50px"}>
																<IconButton as={NavLink} to={Routes.Burger(a.burger?.id)} variant={"ghost"} size={"sm"} icon={<SearchIcon />}
																	aria-label={t("actions.edit")} />
															</Td>
														</Tr>
													))}
												</Tbody>
											</Table>
										</Stack>
									)}
								</>)} />
							</Stack>
							<Stack direction={["column", "row"]} spacing={1}>
								<Stack isInline={true} alignItems={"center"} spacing={3}>
									<Switch isChecked={automatischBoeken} isDisabled={!automatischBoekenPossible} onChange={() => toggleAutomatischBoeken()}
										id={"automatischBoeken"} />
									<FormLabel mb={0} htmlFor={"automatischBoeken"}
											   color={automatischBoekenPossible ? "currentcolor" : "gray.500"}>{t("forms.agreements.fields.automatischBoeken")}</FormLabel>
								</Stack>
							</Stack>
						</FormRight>
					</Stack>

					<Stack spacing={2} direction={["column", "row"]}>
						<FormLeft title={t("forms.agreements.sections.1.title")} helperText={t("forms.agreements.sections.1.helperText")} />
						<FormRight>

							<Stack spacing={2} direction={["column", "row"]}>
								<RadioButtonGroup name={"isRecurring"} onChange={(val) => toggleRecurring(val === AfspraakPeriod.Periodic)}
												  value={isRecurring ? AfspraakPeriod.Periodic : AfspraakPeriod.Once} options={isRecurringOptions} />
							</Stack>

							{isRecurring && (
								<Stack direction={["column", "row"]} spacing={1} mt={2}>
									<Stack spacing={1} flex={1}>
										<Stack direction={"row"} alignItems={"center"}>
											<FormLabel htmlFor={"interval"}>{t("interval.every")}</FormLabel>
											<Input type={"number"} min={1} {...intervalNumber.bind} width={100} id={"interval"} />

											<Box flex={1}>
												<Select onChange={(val) => intervalType.setValue(() => val?.value)} id="interval" isClearable={false} noOptionsMessage={() => t("interval.choose")}
													maxMenuHeight={200} options={intervalOptions} value={intervalOptions.find(i => i.value === intervalType.value)}
													styles={{...reactSelectStyles}} />
											</Box>
										</Stack>
									</Stack>
								</Stack>
							)}

							<Stack direction={["column", "row"]} spacing={1}>
								<Stack spacing={1} flex={1}>
									<FormLabel htmlFor={"startDate"}>{isRecurring ? t("forms.agreements.fields.startDate") : t("forms.common.fields.date")}</FormLabel>
									<DatePicker selected={d(startDate.value, "L").isValid() ? d(startDate.value, "L").toDate() : null} dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											if (value) {
												startDate.setValue(d(value).format("L"));
											}
										}} customInput={<Input type="text" isInvalid={isInvalid(startDate)} {...startDate.bind} />} id={"startDate"} />
								</Stack>
							</Stack>

							{isRecurring && (
								<Stack direction={["column", "row"]} spacing={1} mt={2}>
									<Stack isInline={true} alignItems={"center"} spacing={3}>
										<Switch isChecked={isContinuous} onChange={() => toggleContinuous()} id={"isContinuous"} />
										<FormLabel mb={0} htmlFor={"isContinuous"}>{t("forms.agreements.fields.continuous")}</FormLabel>
									</Stack>
								</Stack>
							)}

							{isRecurring && !isContinuous && (
								<Stack direction={["column", "row"]} spacing={1}>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"nTimes"}>{t("forms.agreements.fields.nTimes")}</FormLabel>
										<Input isInvalid={isInvalid(nTimes)} type={"number"} {...nTimes.bind} width={100} id={"nTimes"} />
									</Stack>
								</Stack>
							)}

							{afspraakType === AfspraakType.Expense && (
								<Stack direction={["column", "row"]} spacing={1} mt={2}>
									<Stack isInline={true} alignItems={"center"} spacing={3}>
										<Switch isChecked={isAutomatischeIncasso} onChange={() => toggleAutomatischeIncasso()} id={"isAutomatischeIncasso"} />
										<FormLabel mb={0} htmlFor={"isAutomatischeIncasso"}>{t("forms.agreements.fields.automatischeIncasso")}</FormLabel>
									</Stack>
								</Stack>
							)}
						</FormRight>
					</Stack>

					<Stack spacing={2} direction={["column", "row"]}>
						<FormLeft />
						<FormRight>
							<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
								<Button isLoading={loading} type={"submit"} colorScheme={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
							</Stack>
						</FormRight>
					</Stack>
				</Stack>
			</Section>
			{isRecurring && (
				<Section>
					<Stack direction={["column", "row"]} spacing={2}>
						<FormLeft title={t("forms.agreements.sections.2.title")} helperText={t("forms.agreements.sections.2.helperText")} />
						<FormRight>
							<Stack spacing={5}>
								<Stack direction={"row"} alignItems={"center"} spacing={0}>
									<HugeDatePicker />
								</Stack>
								<OverschrijvingenListView overschrijvingen={generatedSampleOverschrijvingen} />
							</Stack>
						</FormRight>
					</Stack>
				</Section>
			)}
		</Stack>
	);
};

export default AfspraakForm;