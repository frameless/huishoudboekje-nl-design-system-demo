import {Box, Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, InputGroup, InputLeftElement, Stack, Text, VStack} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afspraak, CreateAlarmInput, useGetConfiguratieQuery} from "../../../generated/graphql";
import {RepeatType} from "../../../models/models";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";
import {useReactSelectStyles} from "../../../utils/things";
import useForm from "../../../utils/useForm";
import useToaster from "../../../utils/useToaster";
import zod from "../../../utils/zod";
import useAlarmValidator, {useEenmaligAlarmValidator} from "../../../validators/useAlarmValidator";
import Asterisk from "../../shared/Asterisk";
import Modal from "../../shared/Modal";
import MonthSelector from "../../shared/MonthSelector";
import PeriodiekSelector, {Periodiek} from "../../shared/PeriodiekSelector";
import WeekDaySelector from "../../shared/WeekDaySelector";
import DataItem from "../../shared/DataItem";

type AddAlarmModalProps = {
	afspraak: Afspraak,
	onSubmit: (data: CreateAlarmInput) => void,
	onClose: VoidFunction,
};

const AddAlarmModal: React.FC<AddAlarmModalProps> = ({afspraak, onSubmit, onClose}) => {
	const validator = useAlarmValidator();
	const eenmaligValidator = useEenmaligAlarmValidator();
	const {t} = useTranslation();
	const toast = useToaster();
	const [showOptions, setShowOptions] = useState(false);
	const reactSelectStyles = useReactSelectStyles();

	const [form, {setForm, updateForm, toggleSubmitted, isSubmitted, isFieldValid, capInput, reset}] = useForm<zod.infer<typeof validator>>({
		validator,
		initialValue: {
			startDate: d(afspraak.validFrom).isSameOrAfter(d(), "date") ? d(afspraak.validFrom).toDate() : d().toDate(),
			bedrag: parseFloat(afspraak.bedrag),
			isPeriodiek: Periodiek.Periodiek,
			repeatType: RepeatType.Month,
			byMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		},
	});

	function toggleOptions() {
		setShowOptions(!showOptions)
	}

	const $configuratie = useGetConfiguratieQuery({
		onCompleted: data => {
			const configuraties: Record<string, string> = (data.configuraties || []).reduce((result, c) => {
				return {
					...result,
					[c.id!]: c.waarde,
				};
			}, {});

			const bedragMargin = parseInt(configuraties.alarm_afwijking_bedrag);
			const datumMargin = parseInt(configuraties.alarm_afwijking_datum);

			setForm(prevForm => ({
				...prevForm,
				...!isNaN(bedragMargin) && {bedragMargin},
				...!isNaN(datumMargin) && {datumMargin},
			}));
		},
	});
	const isFieldValid2 = (field: string) => {
		if (!isSubmitted) {
			return true;
		}

		const {date, datumMargin, byMonthDay, byDay} = form;
		const parsed = eenmaligValidator.safeParse({date, datumMargin, byMonthDay, byDay});
		return parsed.success || !parsed.error.issues.find(issue => issue.path?.[0] === field);
	};

	const repeatTypeOptions = [
		{key: RepeatType.Week, value: RepeatType.Week, label: t("schedule.repeatType_week")},
		{key: RepeatType.Month, value: RepeatType.Month, label: t("schedule.repeatType_month")},
	];

	const allMonths = Array.from({length: 12}).map((x, i) => i + 1);

	const onClickSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		try {
			const data = validator.parse(form);
			const {bedrag, bedragMargin, date, datumMargin, byDay, byMonth, byMonthDay, startDate} = data;
			onSubmit({
				afspraakId: afspraak.id!,
				isActive: true,
				bedrag: String(bedrag),
				bedragMargin: String(bedragMargin),
				...data.isPeriodiek === Periodiek.Eenmalig && {
					startDate: d(date).format("YYYY-MM-DD"),
					endDate: d(date).format("YYYY-MM-DD"),
				},
				...data.isPeriodiek === Periodiek.Periodiek && {
					startDate: d(startDate).format("YYYY-MM-DD"),
				},
				datumMargin,
				byDay,
				byMonth,
				...byMonthDay && {byMonthDay: [byMonthDay]},
			});
		}
		catch (err) {
			toast({error: t("global.formError"), title: t("messages.genericError.title")});
		}
	};


	return (
		<Modal title={t("addAlarmModal.title")} onClose={onClose}>
			<form onSubmit={onClickSubmit} noValidate>
				<Stack>
					<Stack>
						<Text>{t("addAlarmModal.helperText")}</Text>
					</Stack>

					<Queryable query={$configuratie} children={() => (
						<Stack>
							{!showOptions && <Stack>
								<DataItem label={t("alarmForm.repeated")}>
									<HStack justify={"space-between"}>
										<VStack spacing={2}>
											<Text>{t("schedule.everyMonth")}</Text>
										</VStack>
										<VStack spacing={2}>
											<Button _hover={{bg: "white"}} fontWeight={"normal"} backgroundColor={"white"} textColor={"blue"} onClick={toggleOptions}>{t("alarmForm.editRepeated")}</Button>
										</VStack>
									</HStack>
								</DataItem>
							</Stack>

							}
							{showOptions &&
								<PeriodiekSelector value={form.isPeriodiek} isInvalid={!isFieldValid("isPeriodiek")} onChange={p => {
									reset();
									updateForm("isPeriodiek", p);
								}} isRequired />
							}

							{showOptions && form.isPeriodiek === Periodiek.Eenmalig && (<>
								<FormControl flex={1} isInvalid={!isFieldValid("date") || !isFieldValid2("date")} isRequired>
									<FormLabel>{t("alarmForm.date")}</FormLabel>
									<DatePicker
									 	autoComplete="no"
										aria-autocomplete="none"
										selected={form.date}
										dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											if (value) {
												const date = d(value).startOf("day");
												updateForm("date", date.toDate());
												updateForm("byMonth", [date.month() + 1]);
												updateForm("byMonthDay", date.date());
											}
										}} customInput={<Input type={"text"} autoComplete="no" aria-autocomplete="none" />} />
									<FormErrorMessage>{t("alarmForm.errors.invalidDateError")}</FormErrorMessage>
								</FormControl>

								<FormControl flex={1} isInvalid={!isFieldValid("datumMargin") || !isFieldValid2("datumMargin")} isRequired>
									<FormLabel>{t("alarmForm.datumMargin")}</FormLabel>
									<Input
									 	autoComplete="no"
										aria-autocomplete="none"
										type={"number"}
										value={form.datumMargin ?? ""}
										onChange={
											e => setForm(x => ({
												...x,
												datumMargin: parseInt(e.target.value),
											}
										))}
										min={0}
									/>
									<FormErrorMessage>{t("alarmForm.errors.invalidDatumMarginError")}</FormErrorMessage>
								</FormControl>
							</>)}

							{form.isPeriodiek === Periodiek.Periodiek && (<>
								{showOptions &&
									<FormControl flex={1} isInvalid={!isFieldValid("repeatType")} isRequired>
										<FormLabel>{t("schedule.repeatType")}</FormLabel>
										<Box flex={1}>
											<Select
												value={repeatTypeOptions.find(r => r.value === form.repeatType)}
												isClearable={false}
												noOptionsMessage={() => t("schedule.repeatTypeChoose")}
												maxMenuHeight={200}
												options={repeatTypeOptions}
												placeholder={t("select.placeholder")}
												styles={!isFieldValid("repeatType") ? reactSelectStyles.error : reactSelectStyles.default}
												onChange={(val) => {
													updateForm("repeatType", val?.value);
													updateForm("byDay", undefined);
													updateForm("byMonth", val?.value === RepeatType.Month ? allMonths : undefined);
												}}
											/>
										</Box>
										<FormErrorMessage>{t("schedule.invalidPeriodiekError")}</FormErrorMessage>
									</FormControl>
								}

								{form.repeatType === RepeatType.Week && (<>
									<WeekDaySelector
										value={form.byDay || []}
										onChange={(value => updateForm("byDay", value))}
										isInvalid={!isFieldValid("byDay") || !isFieldValid2("byDay")}
										isRequired={true}
									/>

									<FormControl flex={1} isInvalid={!isFieldValid("startDate")}>
										<FormLabel>{t("alarmForm.startDate")}</FormLabel>
										<DatePicker selected={form.startDate}
										 	autoComplete="no"
											aria-autocomplete="none"
											data-test="alarmForm.startDate"
											dateFormat={"dd-MM-yyyy"}
											showYearDropdown={true}
											dropdownMode={"select"}
											onChange={(date) => {
												if (date) {
													updateForm("startDate", date)
												}
											}}
											customInput={(<Input autoComplete="no" aria-autocomplete="none" />)} />
										<FormErrorMessage>{t("afspraakDetailView.invalidValidFromError")}</FormErrorMessage>
									</FormControl>

									<FormControl flex={1} isInvalid={!isFieldValid("datumMargin") || !isFieldValid2("datumMargin")} isRequired>
										<FormLabel>{t("alarmForm.datumMargin")}</FormLabel>
										<Input
										 	autoComplete="no"
											aria-autocomplete="none"
											data-test="alarmForm.dateMargin"
											type={"number"}
											value={form.datumMargin ?? ""}
											onChange={
												e => updateForm("datumMargin", parseInt(e.target.value))} 
											min={0}
										/>
										<FormErrorMessage>{t("alarmForm.errors.invalidDatumMarginError")}</FormErrorMessage>
									</FormControl>
								</>)}

								{form.repeatType === RepeatType.Month && (<>
									{showOptions &&
										<MonthSelector
											value={form.byMonth || []}
											onChange={(value => updateForm("byMonth", value))}
											isInvalid={!isFieldValid("byMonth")}
											isRequired={true}
										/>
									}

									<FormControl flex={1} isInvalid={!isFieldValid("startDate")}>
										<FormLabel>{t("alarmForm.startDate")}</FormLabel>
										<DatePicker
										 	autoComplete="no"
											aria-autocomplete="none"
											data-test="alarmForm.startDate"
											selected={form.startDate}
											dateFormat={"dd-MM-yyyy"}
											showYearDropdown={true}
											dropdownMode={"select"}
											onChange={(date) => {
												if (date) {
													updateForm("startDate", date)
												}
											}}
											customInput={(<Input autoComplete="no" aria-autocomplete="none" data-test="alarmForm.startDate"/>)} />
										<FormErrorMessage>{t("afspraakDetailView.invalidValidFromError")}</FormErrorMessage>
									</FormControl>

									<FormControl flex={1} isInvalid={!isFieldValid("byMonthDay") || !isFieldValid2("byMonthDay")} isRequired>
										<FormLabel>{t("alarmForm.byMonthDay")}</FormLabel>
										<Input
										 	autoComplete="no"
											aria-autocomplete="none"
											data-test="alarmForm.byMonthDay"
											type={"number"}
											value={form.byMonthDay || ""}
											onChange={e => updateForm("byMonthDay", parseInt(e.target.value))}
											min={0}
											max={28}
										/>
										<FormErrorMessage>{t("alarmForm.errors.invalidMonthDayError")}</FormErrorMessage>
									</FormControl>

									<FormControl flex={1} isInvalid={!isFieldValid("datumMargin") || !isFieldValid2("datumMargin")} isRequired>
										<FormLabel>{t("alarmForm.datumMargin")}</FormLabel>
										<Input
										 	autoComplete="no"
											aria-autocomplete="none"
											data-test="alarmForm.dateMargin"
											type={"number"}
											value={form.datumMargin ?? ""}
											onChange={
												e => setForm(x => ({
													...x,
													datumMargin: parseInt(e.target.value),
												})
											)}
											min={0}
										/>
										<FormErrorMessage>{t("alarmForm.errors.invalidDatumMarginError")}</FormErrorMessage>
									</FormControl>
								</>)}
							</>)}


							{form.isPeriodiek !== undefined && (<>
								<FormControl flex={1} isInvalid={!(isFieldValid("bedrag") && capInput("bedrag", 20000000))} isRequired>
									<FormLabel>{t("alarmForm.bedrag")}</FormLabel>
									<InputGroup>
										<InputLeftElement zIndex={0}>&euro;</InputLeftElement>
										<Input
										 	autoComplete="no"
											aria-autocomplete="none"
											data-test="alarmForm.amount"
											type={"number"}
											pattern={"^\\d*(,{0,1}\\d{0,2})$"}
											value={form.bedrag ? form.bedrag : 0}
											min={0}
											step={.01}
											onChange={e => updateForm("bedrag", parseFloat(e.target.value.toString().replace(",", ".")))}
										/>
									</InputGroup>
									<FormErrorMessage>{t("alarmForm.errors.invalidBedragError")}</FormErrorMessage>
								</FormControl>

								<FormControl flex={1} isInvalid={!(isFieldValid("bedragMargin") && capInput("bedragMargin", 20000000))} isRequired>
									<FormLabel>{t("alarmForm.bedragMargin")}</FormLabel>
									<InputGroup>
										<InputLeftElement zIndex={0}>&euro;</InputLeftElement>
										<Input
										 	autoComplete="no"
											aria-autocomplete="none"
											data-test="alarmForm.amountMargin"
											type={"number"}
											pattern={"^\\d*"}
											value={form.bedragMargin && form.bedragMargin > 0 ? parseInt(form.bedragMargin.toString()) : undefined}
											min={0}
											step={1}
											onKeyUp={e => updateForm("bedragMargin", parseInt((e.target as HTMLInputElement).value))}
											onChange={e => updateForm("bedragMargin", parseInt(e.target.value))}
										/>
									</InputGroup>
									<FormErrorMessage>{t("alarmForm.errors.invalidBedragMarginError")}</FormErrorMessage>
								</FormControl>
							</>)}

							<Stack align={"flex-end"}>
								<HStack>
									<Button variant={"ghost"} data-test="alarmForm.buttonCancel" onClick={onClose}>{t("global.actions.cancel")}</Button>
									<Button type={"submit"} data-test="alarmForm.buttonSubmit" colorScheme={"primary"}>{t("global.actions.save")}</Button>
								</HStack>
								<Asterisk />
							</Stack>
						</Stack>
					)} />
				</Stack>
			</form>
		</Modal>
	);
};

export default AddAlarmModal;
