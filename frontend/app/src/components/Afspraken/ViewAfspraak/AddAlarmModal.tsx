import {Box, Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, InputGroup, InputLeftElement, Stack, Text} from "@chakra-ui/react";
import React from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afspraak, CreateAlarmInput, DayOfWeek, useGetConfiguratieQuery} from "../../../generated/graphql";
import {RepeatType} from "../../../models/models";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";
import {currencyFormat2, useReactSelectStyles} from "../../../utils/things";
import useForm from "../../../utils/useForm";
import useToaster from "../../../utils/useToaster";
import zod from "../../../utils/zod";
import Asterisk from "../../shared/Asterisk";
import Modal from "../../shared/Modal";
import MonthSelector from "../../shared/MonthSelector";
import PeriodiekSelector, {Periodiek} from "../../shared/PeriodiekSelector";
import WeekDaySelector from "../../shared/WeekDaySelector";

const eenmaligValidator = zod.object({
	startDate: zod.date(), //.refine(val => d().endOf("day").isSameOrBefore(val)), // Must be in the future
	datumMargin: zod.number().min(0),
	byMonthDay: zod.number().min(1).max(28),
	byDay: zod.array(zod.nativeEnum(DayOfWeek)).min(1),
});

const validator = zod.object({
	isPeriodiek: zod.nativeEnum(Periodiek),
	repeatType: zod.nativeEnum(RepeatType).optional(),
	bedrag: zod.number().min(0),
	bedragMargin: zod.number().min(0),
	startDate: zod.date().optional(),
	endDate: zod.date().optional(),
	datumMargin: zod.number().min(0).optional(),
	byDay: zod.array(zod.nativeEnum(DayOfWeek)).min(1).optional(),
	byMonth: zod.array(zod.number().min(1).max(12)).min(1).max(12).optional(),
	byMonthDay: zod.number().min(1).max(28).optional(),
}).superRefine((data, ctx) => {
	if (data.isPeriodiek === Periodiek.Eenmalig) {
		const parsed = eenmaligValidator.safeParse(data);
		if (!parsed.success) {
			parsed.error.issues.map(ctx.addIssue);
		}
	}
});

type AddAlarmModalProps = {
	afspraak: Afspraak,
	onSubmit: (data: CreateAlarmInput) => void,
	onClose: VoidFunction,
};

const AddAlarmModal: React.FC<AddAlarmModalProps> = ({afspraak, onSubmit, onClose}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const reactSelectStyles = useReactSelectStyles();
	const [form, {setForm, updateForm, toggleSubmitted, isSubmitted, isFieldValid, isValid, reset}] = useForm<zod.infer<typeof validator>>({
		validator,
		initialValue: {
			bedrag: parseFloat(afspraak.bedrag),
			isPeriodiek: Periodiek.Periodiek,
			repeatType: RepeatType.Month,
			byMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		},
	});
	const $configuratie = useGetConfiguratieQuery({
		onCompleted: data => {
			const configuraties: Record<string, string> = (data.configuraties || []).reduce((result, c) => {
				return ({
					...result,
					[c.id!]: c.waarde,
				});
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

		const {startDate, endDate, datumMargin, byMonthDay, byDay} = form;
		const parsed = eenmaligValidator.safeParse({startDate, endDate, datumMargin, byMonthDay, byDay});
		return parsed.success || !parsed.error.issues.find(issue => issue.path?.[0] === field);
	};

	const repeatTypeOptions = [
		{key: RepeatType.Week, value: RepeatType.Week, label: t("schedule.repeatType_week")},
		{key: RepeatType.Month, value: RepeatType.Month, label: t("schedule.repeatType_month")},
	];

	const onClickSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		if (isValid()) {
			const {bedrag, bedragMargin, startDate, endDate, datumMargin, byDay, byMonth, byMonthDay} = form;
			onSubmit({
				afspraakId: afspraak.id!,
				isActive: true,
				bedrag,
				bedragMargin,
				...form.isPeriodiek === Periodiek.Eenmalig ? {
					startDate: d(startDate).format("YYYY-MM-DD"),
					endDate: d(startDate).format("YYYY-MM-DD"),
				} : {
					startDate: d(startDate).format("YYYY-MM-DD"),
					endDate: d(endDate).format("YYYY-MM-DD"),
				},
				datumMargin,
				byDay,
				byMonth,
				...byMonthDay && {byMonthDay: [byMonthDay]},
			});
			return;
		}

		toast({error: t("global.formError"), title: t("messages.genericError.title")});
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

							<PeriodiekSelector value={form.isPeriodiek} isInvalid={!isFieldValid("isPeriodiek")} onChange={p => {
								reset();
								updateForm("isPeriodiek", p);
							}} isRequired />

							{form.isPeriodiek === Periodiek.Eenmalig && (<>
								<FormControl flex={1} isInvalid={!isFieldValid("startDate") || !isFieldValid2("startDate")} isRequired>
									<FormLabel>{t("alarmForm.date")}</FormLabel>
									<DatePicker selected={form.startDate} dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											if (value) {
												updateForm("startDate", d(value).startOf("day").toDate());
											}
										}} customInput={<Input type={"text"} />} />
									<FormErrorMessage>{t("alarmForm.errors.invalidDateError")}</FormErrorMessage>
								</FormControl>

								<FormControl flex={1} isInvalid={!isFieldValid("datumMargin") || !isFieldValid2("datumMargin")} isRequired>
									<FormLabel>{t("alarmForm.datumMargin")}</FormLabel>
									<Input type={"number"} value={form.datumMargin ?? ""} onChange={e => setForm(x => ({
										...x,
										datumMargin: parseInt(e.target.value),
									}))} min={0} />
									<FormErrorMessage>{t("alarmForm.errors.invalidDatumMarginError")}</FormErrorMessage>
								</FormControl>
							</>)}

							{form.isPeriodiek === Periodiek.Periodiek && (<>
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
												const allMonths = Array.from({length: 12}).map((x, i) => i + 1);
												updateForm("byMonth", val?.value === RepeatType.Month ? allMonths : undefined);
											}}
										/>
									</Box>
									<FormErrorMessage>{t("schedule.invalidPeriodiekError")}</FormErrorMessage>
								</FormControl>

								{form.repeatType === RepeatType.Week && (<>
									<WeekDaySelector value={form.byDay || []} onChange={(value => updateForm("byDay", value))} isInvalid={!isFieldValid("byDay") || !isFieldValid2("byDay")} isRequired={true} />

									<FormControl flex={1} isInvalid={!isFieldValid("datumMargin") || !isFieldValid2("datumMargin")} isRequired>
										<FormLabel>{t("alarmForm.datumMargin")}</FormLabel>
										<Input type={"number"} value={form.datumMargin ?? ""} onChange={e => updateForm("datumMargin", parseInt(e.target.value))} min={0} />
										<FormErrorMessage>{t("alarmForm.errors.invalidDatumMarginError")}</FormErrorMessage>
									</FormControl>
								</>)}

								{form.repeatType === RepeatType.Month && (<>
									<MonthSelector value={form.byMonth || []} onChange={(value => updateForm("byMonth", value))} isInvalid={!isFieldValid("byMonth")} isRequired={true} />

									<FormControl flex={1} isInvalid={!isFieldValid("byMonthDay") || !isFieldValid2("byMonthDay")} isRequired>
										<FormLabel>{t("alarmForm.byMonthDay")}</FormLabel>
										<Input type={"number"} value={form.byMonthDay || ""} onChange={e => updateForm("byMonthDay", parseInt(e.target.value))} min={0} max={28} />
										<FormErrorMessage>{t("alarmForm.errors.invalidMonthDayError")}</FormErrorMessage>
									</FormControl>

									<FormControl flex={1} isInvalid={!isFieldValid("datumMargin") || !isFieldValid2("datumMargin")} isRequired>
										<FormLabel>{t("alarmForm.datumMargin")}</FormLabel>
										<Input type={"number"} value={form.datumMargin ?? ""} onChange={e => setForm(x => ({
											...x,
											datumMargin: parseInt(e.target.value),
										}))} min={0} />
										<FormErrorMessage>{t("alarmForm.errors.invalidDatumMarginError")}</FormErrorMessage>
									</FormControl>
								</>)}
							</>)}

							{form.isPeriodiek !== undefined && (<>
								<FormControl flex={1} isInvalid={!isFieldValid("bedrag")} isRequired>
									<FormLabel>{t("alarmForm.bedrag")}</FormLabel>
									<InputGroup>
										<InputLeftElement zIndex={0}>&euro;</InputLeftElement>
										<Input
											type={"number"}
											pattern={"^[^.]*$"}
											defaultValue={form.bedrag ? currencyFormat2(false).format(form.bedrag) : ""}
											min={0}
											step={.01}
											onChange={e => updateForm("bedrag", parseFloat(e.target.value))}
										/>
									</InputGroup>
									<FormErrorMessage>{t("alarmForm.errors.invalidBedragError")}</FormErrorMessage>
								</FormControl>

								<FormControl flex={1} isInvalid={!isFieldValid("bedragMargin")} isRequired>
									<FormLabel>{t("alarmForm.bedragMargin")}</FormLabel>
									<InputGroup>
										<InputLeftElement zIndex={0}>&euro;</InputLeftElement>
										<Input
											type={"number"}
											pattern={"^[^.]*$"}
											defaultValue={form.bedragMargin ? currencyFormat2(false).format(form.bedragMargin) : ""}
											min={0}
											step={.01}
											onChange={e => updateForm("bedragMargin", parseFloat(e.target.value))}
										/>
									</InputGroup>
									<FormErrorMessage>{t("alarmForm.errors.invalidBedragMarginError")}</FormErrorMessage>
								</FormControl>

							</>)}

							<Stack align={"flex-end"}>
								<HStack>
									<Button variant={"ghost"} onClick={onClose}>{t("global.actions.cancel")}</Button>
									<Button type={"submit"} colorScheme={"primary"}>{t("global.actions.save")}</Button>
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
