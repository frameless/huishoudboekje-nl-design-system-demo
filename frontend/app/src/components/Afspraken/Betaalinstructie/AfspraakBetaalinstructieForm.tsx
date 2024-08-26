import {Box, Button, Checkbox, CheckboxGroup, FormControl, FormErrorMessage, FormLabel, Input, Radio, RadioGroup, Stack, Wrap, WrapItem} from "@chakra-ui/react";
import React from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afspraak, BetaalinstructieInput, DayOfWeek} from "../../../generated/graphql";
import {RepeatType} from "../../../models/models";
import d from "../../../utils/dayjs";
import {useReactSelectStyles} from "../../../utils/things";
import useForm from "../../../utils/useForm";
import useToaster from "../../../utils/useToaster";
import zod from "../../../utils/zod";
import Asterisk from "../../shared/Asterisk";
import PageNotFound from "../../shared/PageNotFound";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";

const validator2 = zod.object({
	byDay: zod.array(zod.nativeEnum(DayOfWeek)).min(1),
	byMonth: zod.array(zod.number()).min(1),
	byMonthDay: zod.array(zod.number()).min(1),
});

const validator = zod.object({
	type: zod.enum(["eenmalig", "periodiek"]),
	startDate: zod.date(),
	endDate: zod.date().optional(),
	repeatType: zod.nativeEnum(RepeatType).optional(),
	byDay: zod.array(zod.nativeEnum(DayOfWeek)).optional(),
	byMonth: zod.array(zod.number()).optional(),
	byMonthDay: zod.array(zod.number()).optional(),
}).superRefine((data, ctx) => {
	// If "Periodiek" is selected, repeatType is required.
	if (data.type === "periodiek") {
		const parsed = zod.nativeEnum(RepeatType).safeParse(data.repeatType);
		if (!parsed.success) {
			parsed.error.issues.map(i => ctx.addIssue({
				...i,
				path: ["repeatType"],
			}));
		}
	}

	// When "Weekly" is selected, byDay is required.
	if (data.repeatType === RepeatType.Week) {
		const parsed = validator2.shape.byDay.safeParse(data.byDay);
		if (!parsed.success) {
			parsed.error.issues.map(i => ctx.addIssue({
				...i,
				path: ["byDay"],
			}));
		}
	}
	// When "Monthly" or "Yearly" is selected, byMonth and byMonthDay are required.
	else if (data.repeatType && [RepeatType.Month, RepeatType.Year].includes(data.repeatType)) {
		const parsedByMonth = validator2.shape.byMonth.safeParse(data.byMonth);
		const parsedByMonthDay = validator2.shape.byMonthDay.safeParse(data.byMonthDay);
		if (!parsedByMonth.success) {
			parsedByMonth.error.issues.map(i => ctx.addIssue({
				...i,
				path: ["byDay"],
			}));
		}
		if (!parsedByMonthDay.success) {
			parsedByMonthDay.error.issues.map(i => ctx.addIssue({
				...i,
				path: ["byDay"],
			}));
		}
	}
});

type AfspraakBetaalinstructieProps = {
	afspraak: Afspraak,
	onChange: (data: BetaalinstructieInput) => void,
}

const AfspraakBetaalinstructieForm: React.FC<AfspraakBetaalinstructieProps> = ({afspraak, onChange}) => {
	const {id} = afspraak;
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();
	const toast = useToaster();

	const [form, {setForm, updateForm, toggleSubmitted, isFieldValid, isValid}] = useForm<zod.infer<typeof validator>>({
		validator,
	});
	const isFieldValid2 = (field: string) => validator2.shape[field].safeParse(form[field]).success;

	if (!id) {
		return <PageNotFound />;
	}

	const onSubmit = e => {
		e.preventDefault();
		toggleSubmitted(true);

		if (isValid()) {
			const {startDate, endDate, byDay, byMonth, byMonthDay} = form;
			onChange({
				startDate: d(startDate).format("YYYY-MM-DD"),
				endDate: endDate ? d(endDate).format("YYYY-MM-DD") : undefined,
				byDay,
				byMonth,
				byMonthDay,
				repeatFrequency: "", // Not in use, but this needs to be passed a an empty string.
			});
			return;
		}

		toast({error: t("global.formError")});
	};

	const repeatTypeOptions = [
		// {key: RepeatType.Day, value: RepeatType.Day, label: t("schedule.repeatType_day")},
		{key: RepeatType.Week, value: RepeatType.Week, label: t("schedule.repeatType_week")},
		{key: RepeatType.Month, value: RepeatType.Month, label: t("schedule.repeatType_month")},
		{key: RepeatType.Year, value: RepeatType.Year, label: t("schedule.repeatType_year")},
	];

	const getDayOfWeekFromStartDate = () => {
		switch (form.startDate?.getDay()) {
				case 1:
					return [DayOfWeek.Monday]
				case 2:
					return [DayOfWeek.Tuesday]
				case 3:
					return [DayOfWeek.Wednesday]
				case 4:
					return [DayOfWeek.Thursday]
				case 5:
					return [DayOfWeek.Friday]
				case 6:
					return [DayOfWeek.Saturday]
				case 0:
					return [DayOfWeek.Sunday]
				default:
					return undefined
		}
	}

	const getDayOfMonth = () => {
		const day = form.startDate?.getDate();
		return day ? day > 28 ? [28] : [day] : undefined
	}

	return (
		<SectionContainer>
			<Section title={t("afspraakBetaalinstructie.title")} helperText={t("afspraakBetaalinstructie.helperText")}>
				<form onSubmit={onSubmit}>
					<Stack spacing={5}>

						<Stack direction={["column", "row"]}>
							<FormControl flex={1} isInvalid={!isFieldValid("type")} isRequired>
								<FormLabel>{t("afspraken.periodiek")}</FormLabel>
								<RadioGroup value={form.type} onChange={(value: "periodiek" | "eenmalig") => {
									setForm({
										type: value,
									});
								}}>
									<Stack>
										<Radio data-test="radio.once" value={"eenmalig"}>{t("schedule.eenmalig")}</Radio>
										<Radio data-test="radio.periodically" value={"periodiek"}>{t("schedule.periodiek")}</Radio>
									</Stack>
								</RadioGroup>
								<FormErrorMessage>{t("afspraakBetaalinstructie.invalidPeriodiekError")}</FormErrorMessage>
							</FormControl>
						</Stack>

						{form.type === "eenmalig" && (
							<Stack direction={["column", "row"]}>
								<FormControl flex={1} isInvalid={!isFieldValid("startDate")} isRequired>
									<FormLabel>{t("schedule.datum")}</FormLabel>
									<DatePicker
									 	autoComplete="no"
										aria-autocomplete="none"
										dateFormat={"dd-MM-yyyy"}
										selected={form.startDate ? d(form.startDate).startOf("day").toDate() : null}
										onChange={(value: Date) => {
											if (value) {
												updateForm("startDate", value);
												setForm(x => ({
													...x,
													byMonth: [d(value).month() + 1],
													byMonthDay: [d(value).date()],
													startDate: d(value).toDate(),
													endDate: d(value).toDate(),
												}));
											}
										}}
										customInput={<Input type={"text"} autoComplete="no" aria-autocomplete="none" />}
									/>
									<FormErrorMessage>{t("afspraakBetaalinstructie.invalidDateError")}</FormErrorMessage>
								</FormControl>
							</Stack>
						)}

						{form.type === "periodiek" && (<>
							<Stack direction={["column", "row"]}>

								<FormControl flex={1} isInvalid={!isFieldValid("startDate")} isRequired>
									<FormLabel>{t("schedule.startDate")}</FormLabel>
									<DatePicker
									 	autoComplete="no"
										aria-autocomplete="none"
										dateFormat={"dd-MM-yyyy"}
										selected={form.startDate}
										onChange={(value: Date) => {
											if (value) {
												updateForm("startDate", value)
											} else {
												updateForm("startDate", undefined)
											}
										}}
										customInput={<Input data-test="input.startDate" type={"text"} autoComplete="no" aria-autocomplete="none" />}
										isClearable={true}
									/>
									<FormErrorMessage>{t("afspraakBetaalinstructie.invalidDateError")}</FormErrorMessage>
								</FormControl>

								<FormControl flex={1} isInvalid={!isFieldValid("endDate")}>
									<FormLabel>{t("schedule.endDate")}</FormLabel>
									<DatePicker
									 	autoComplete="no"
										aria-autocomplete="none"
										dateFormat={"dd-MM-yyyy"}
										selected={form.endDate ? d(form.endDate).endOf("day").toDate() : null}
										onChange={(value: Date) => {
											if (value) {
												updateForm("endDate", value)
											} else {
												updateForm("endDate", undefined)
											}
										}}
										customInput={<Input data-test="input.endDate" type={"text"} autoComplete="no" aria-autocomplete="none" />}
										isClearable={true}
									/>
									<FormErrorMessage>{t("afspraakBetaalinstructie.invalidDateError")}</FormErrorMessage>
								</FormControl>

							</Stack>

							<Stack direction={["column", "row"]}>
								<FormControl flex={1} data-test="select.repeat" isInvalid={!isFieldValid("repeatType")} isRequired>
									<FormLabel>{t("schedule.repeatType")}</FormLabel>
									<Box flex={1}>
										<Select
											value={repeatTypeOptions.find(r => r.value === form.repeatType)}
											isClearable={true}
											noOptionsMessage={() => t("schedule.repeatTypeChoose")}
											maxMenuHeight={200}
											options={repeatTypeOptions}
											placeholder={t("select.placeholder")}
											styles={isFieldValid("repeatType") ? reactSelectStyles.default : reactSelectStyles.error}
											onChange={(val) => {
												updateForm("repeatType", val?.value);

												const allMonths = Array.from({length: 12}).map((x, i) => i + 1);
												setForm(data => ({
													...data,
													byDay: val?.value === RepeatType.Week ? getDayOfWeekFromStartDate() : undefined,
													byMonth: val?.value === RepeatType.Month ? allMonths : undefined,
													byMonthDay: val?.value === RepeatType.Month ? getDayOfMonth() : undefined,
												}));
											}}
										/>
									</Box>
									<FormErrorMessage>{t("schedule.invalidPeriodiekError")}</FormErrorMessage>
								</FormControl>
							</Stack>

							{form.repeatType === RepeatType.Week && ( /* Wekelijks */
								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isFieldValid("byDay") || !isFieldValid2("byDay")} isRequired>
										<FormLabel>{t("schedule.byDay")}</FormLabel>
										<CheckboxGroup colorScheme={"primary"} defaultValue={[]} value={form.byDay || []} onChange={(val: string[]) => updateForm("byDay", val)}>
											<Wrap>
												<WrapItem><Checkbox value={String(DayOfWeek.Monday)} isRequired={false}>Maandag</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(DayOfWeek.Tuesday)} isRequired={false}>Dinsdag</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(DayOfWeek.Wednesday)} isRequired={false}>Woensdag</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(DayOfWeek.Thursday)} isRequired={false}>Donderdag</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(DayOfWeek.Friday)} isRequired={false}>Vrijdag</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(DayOfWeek.Saturday)} isRequired={false}>Zaterdag</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(DayOfWeek.Sunday)} isRequired={false}>Zondag</Checkbox></WrapItem>
											</Wrap>
										</CheckboxGroup>
										<FormErrorMessage>{t("schedule.invalidByDayError")}</FormErrorMessage>
									</FormControl>
								</Stack>
							)}

							{form.repeatType && [RepeatType.Month, RepeatType.Year].includes(form.repeatType) && (/* Maandelijks / Jaarlijks */ <>
								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isFieldValid("byMonth") || !isFieldValid2("byMonth")} isRequired>
										<FormLabel>{t("schedule.byMonth")}</FormLabel>
										<CheckboxGroup colorScheme={"primary"} defaultValue={[]} value={(form.byMonth || [])?.map(x => String(x)) || []} onChange={(val: string[]) => updateForm("byMonth", val.map(x => parseInt(x)))}>
											<Wrap>
												<WrapItem><Checkbox value={String(1)} isRequired={false}>{t("months.jan")}</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(2)} isRequired={false}>{t("months.feb")}</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(3)} isRequired={false}>{t("months.mrt")}</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(4)} isRequired={false}>{t("months.apr")}</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(5)} isRequired={false}>{t("months.may")}</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(6)} isRequired={false}>{t("months.jun")}</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(7)} isRequired={false}>{t("months.jul")}</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(8)} isRequired={false}>{t("months.aug")}</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(9)} isRequired={false}>{t("months.sep")}</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(10)} isRequired={false}>{t("months.oct")}</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(11)} isRequired={false}>{t("months.nov")}</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(12)} isRequired={false}>{t("months.dec")}</Checkbox></WrapItem>
											</Wrap>
										</CheckboxGroup>
										<FormErrorMessage>{t("schedule.invalidByMonthError")}</FormErrorMessage>
									</FormControl>
								</Stack>

								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isFieldValid("byMonthDay") || !isFieldValid2("byMonthDay")} isRequired>
										<FormLabel>{t("schedule.byMonthDay")}</FormLabel>
										<Input
											autoComplete="no"
											data-test="input.byMonthDay"
											aria-autocomplete="none"
											type={"number"}
											min={1}
											max={28}
											value={String(form.byMonthDay?.[0] || "")}
											onChange={
												e => updateForm("byMonthDay", [parseInt(e.target.value)], newData => ({
													...newData,
													byDay: undefined,
												})
											)}
										/>
										<FormErrorMessage>{t("schedule.invalidByMonthDayError")}</FormErrorMessage>
									</FormControl>
								</Stack>
							</>)}
						</>)}

						<Stack align={"flex-end"}>
							<Button data-test="button.Submit" type={"submit"} colorScheme={"primary"}>{t("global.actions.save")}</Button>
							<Asterisk />
						</Stack>
					</Stack>
				</form>
			</Section>
		</SectionContainer>
	);
};

export default AfspraakBetaalinstructieForm;
