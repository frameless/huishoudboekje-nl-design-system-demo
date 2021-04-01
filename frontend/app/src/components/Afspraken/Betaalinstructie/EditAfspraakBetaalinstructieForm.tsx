import {Box, Button, Checkbox, CheckboxGroup, FormControl, FormErrorMessage, FormLabel, HStack, Input, Radio, RadioGroup, Stack} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afspraak, Betaalinstructie, BetaalinstructieInput, DayOfWeek} from "../../../generated/graphql";
import {allDaysOfWeek, IntervalType} from "../../../models/models";
import d from "../../../utils/dayjs";
import {useReactSelectStyles} from "../../../utils/things";
import useToaster from "../../../utils/useToaster";
import zod from "../../../utils/zod";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import Section from "../../Layouts/Section";
import PageNotFound from "../../PageNotFound";

/*
* Todo:
* - Hoe slaan we "herhaal elke 2 weken (op dag)" op?
* - Hoe slaan we "herhaal elke week" op?
* */

const validatorEenmalig = zod.object({
	periodiek: zod.literal(false),
	startDate: zod.date(),
});

const validatorPeriodiek = zod.object({
	periodiek: zod.literal(true),
	startDate: zod.date(),
	endDate: zod.date().optional(),
	byDay: zod.array(zod.nativeEnum(DayOfWeek)).min(1),
	byMonthDay: zod.number().min(1).max(28),
	intervalType: zod.enum([IntervalType.Week, IntervalType.Month]),
	intervalCount: zod.number().min(1),
});

const validatorPeriodiekWeek = zod.object({
	periodiek: zod.literal(true),
	startDate: zod.date(),
	endDate: zod.date().optional(),
	byDay: zod.array(zod.nativeEnum(DayOfWeek)).min(1), // Todo: enable byDay? (01-04-2021)
	intervalType: zod.literal(IntervalType.Week),
	intervalCount: zod.number().min(1),
});

const validatorPeriodiekMonth = zod.object({
	periodiek: zod.literal(true),
	startDate: zod.date(),
	endDate: zod.date().optional(),
	byMonthDay: zod.number().min(1).max(28),
	intervalType: zod.literal(IntervalType.Month),
	intervalCount: zod.number().min(1),
});

type EditAfspraakBetaalinstructieProps = {
	afspraak: Afspraak,
	values?: Betaalinstructie,
	onChange: (data: BetaalinstructieInput) => void,
}

type BetaalinstructieFormValues = Betaalinstructie & {
	intervalType?: IntervalType,
	intervalCount?: number,
	startDate?: Date,
	endDate?: Date,
	periodiek?: boolean,
};

const getScenario = data => {
	if (!data.periodiek) {
		return "eenmalig";
	}
	if (data.periodiek && data.intervalType === IntervalType.Week) {
		return "periodiekWeek";
	}
	if (data.periodiek && data.intervalType === IntervalType.Month) {
		return "periodiekMonth";
	}

	return "periodiek";
};
const getValidator = (data) => ({
	"eenmalig": validatorEenmalig,
	"periodiek": validatorPeriodiek,
	"periodiekWeek": validatorPeriodiekWeek,
	"periodiekMonth": validatorPeriodiekMonth,
}[getScenario(data)]);
const prepareData = (data) => {
	const scenario = getScenario(data);

	switch (scenario) {
		case "eenmalig": {
			return {startDate: data.startDate};
		}
		case "periodiekWeek": {
			return {
				startDate: d(data.startDate).format("YYYY-MM-DD"),
				...data.endDate && { endDate: d(data.endDate).format("YYYY-MM-DD") },
				byDay: data.byDay,
			};
		}
		case "periodiekMonth": {
			return {
				startDate: d(data.startDate).format("YYYY-MM-DD"),
				...data.endDate && { endDate: d(data.endDate).format("YYYY-MM-DD") },
				byMonthDay: data.byMonthDay,
			};
		}
	}

	return data;
};


const EditAfspraakBetaalinstructieForm: React.FC<EditAfspraakBetaalinstructieProps> = ({afspraak, values, onChange}) => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();
	const toast = useToaster();
	const [data, setData] = useState<Partial<BetaalinstructieFormValues>>(values || {});
	const {id} = afspraak;

	if (!id) {
		return <PageNotFound />;
	}

	const intervalOptions = [
		// {key: "day", label: t("interval.day", {count: data.intervalCount}), value: IntervalType.Day},
		{key: "week", label: t("interval.week", {count: data.intervalCount || 0}), value: IntervalType.Week},
		{key: "month", label: t("interval.month", {count: data.intervalCount || 0}), value: IntervalType.Month},
		// {key: "year", label: t("interval.year", {count: data.intervalCount}), value: IntervalType.Year},
	];

	const validator = getValidator(data);
	const isValid = (fieldName: string) => validator.shape[fieldName]?.safeParse(data[fieldName]).success;

	const updateForm = (field: string, value: any, callback?: (data) => any) => {
		setData(prevData => {
			let newData = {
				...prevData,
				[field]: value,
			};

			if (callback) {
				newData = {
					...newData,
					...callback(newData),
				};
			}
			return newData;
		});

	};

	return (
		<Section>
			<form onSubmit={e => {
				e.preventDefault();
				try {
					const validatedData = validator.parse(data);
					onChange(prepareData(validatedData));
				}
				catch (err) {
					toast({error: err.message, title: t("messages.genericError.title")});
				}
			}}>
				<Stack direction={["column", "row"]}>
					<FormLeft title={t("afspraakDetailView.section4.title")} helperText={t("afspraakDetailView.section4.helperText")}>
						<pre>{JSON.stringify({data: prepareData(data)}, null, 2)}</pre>
					</FormLeft>
					<FormRight spacing={5}>

						<Stack direction={["column", "row"]}>
							<FormControl flex={1} isInvalid={!isValid("periodiek")} isRequired>
								<FormLabel>{t("afspraak.periodiek")}</FormLabel>
								<RadioGroup onChange={e => updateForm("periodiek", e === "periodiek", (newData) => {
									return {
										periodiek: e === "periodiek",
									};
								})} value={data.periodiek !== undefined ? (data.periodiek ? "periodiek" : "eenmalig") : undefined}>
									<Stack>
										<Radio value="eenmalig">{t("schedule.eenmalig")}</Radio>
										<Radio value="periodiek">{t("schedule.periodiek")}</Radio>
									</Stack>
								</RadioGroup>
								<FormErrorMessage>{t("afspraakBetaalinstructie.invalidPeriodiekError")}</FormErrorMessage>
							</FormControl>
						</Stack>

						{data.periodiek === true && (<>
							<Stack direction={["column", "row"]}>

								<FormControl flex={1} isInvalid={!isValid("startDate")} isRequired>
									<FormLabel>{t("schedule.startDate")}</FormLabel>
									<DatePicker selected={(data.startDate && d(data.startDate).isValid()) ? d(data.startDate).startOf("day").toDate() : null} dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											if (value) {
												updateForm("startDate", d(value).startOf("day").toDate());
											}
										}} customInput={<Input type="text" isInvalid={!isValid("startDate")} />} />
									<FormErrorMessage>{t("afspraakBetaalinstructie.invalidDateError")}</FormErrorMessage>
								</FormControl>

								<FormControl flex={1} isInvalid={!isValid("endDate")}>
									<FormLabel>{t("schedule.endDate")}</FormLabel>
									<DatePicker selected={(data.endDate && d(data.endDate).isValid()) ? d(data.endDate).endOf("day").toDate() : null} dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											if (value) {
												updateForm("endDate", d(value).startOf("day").toDate());
											}
										}} customInput={<Input type="text" isInvalid={!isValid("endDate")} />} />
									<FormErrorMessage>{t("afspraakBetaalinstructie.invalidDateError")}</FormErrorMessage>
								</FormControl>

							</Stack>

							<Stack direction={["column", "row"]}>

								<FormControl flex={1} maxW={"200px"} isInvalid={!isValid("intervalCount")} isRequired>
									<FormLabel>{t("schedule.repeatEvery")}</FormLabel>
									<Input type={"number"} min={1} value={data.intervalCount || ""} onChange={e => updateForm("intervalCount", parseInt(e.target.value), newData => {
										// Every day
										if (newData.intervalType === IntervalType.Day && newData.intervalCount === 1) {
											newData.byDay = allDaysOfWeek;
										}

										return newData;
									},
									)} />
									<FormErrorMessage>{t("schedule.invalidIntervalCountError")}</FormErrorMessage>
								</FormControl>

								<FormControl flex={1} isInvalid={!isValid("intervalType")} isRequired>
									<FormLabel>{t("schedule.repeatEveryPeriod")}</FormLabel>
									<Box flex={1}>
										<Select onChange={(val) => updateForm("intervalType", val?.value, (newData) => {
											/* If "every 1 day" is selected, enable all days */
											if (newData.intervalType === IntervalType.Day && newData.intervalCount === 1) {
												newData.byDay = allDaysOfWeek;
											}
											/* If "every n month(s)" or "every n years" is selected, disable all days */
											else if ([IntervalType.Month, IntervalType.Year].includes(newData.intervalType)) {
												newData.byDay = [];
											}

											return newData;
										})}
										isClearable={false} noOptionsMessage={() => t("interval.choose")}
										maxMenuHeight={200} options={intervalOptions} value={intervalOptions.find(i => i.value === data.intervalType)}
										styles={isValid("intervalType") ? reactSelectStyles.default : reactSelectStyles.error} />
									</Box>
									<FormErrorMessage>{t("schedule.invalidIntervalTypeError")}</FormErrorMessage>
								</FormControl>

							</Stack>

							{/* Todo: enable selection of weekdays in byDay field of Schedule */}
							{/* Only when every n week(s). */}
							{data.intervalType === IntervalType.Week && (
								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isValid("byDay")}>
										<FormLabel>{t("schedule.byDay")}</FormLabel>
										<CheckboxGroup colorScheme={"primary"} defaultValue={[]} value={data.byDay} onChange={(val: string[]) => updateForm("byDay", val)}>
											<HStack>
												<Checkbox value={String(DayOfWeek.Monday)}>Maandag</Checkbox>
												<Checkbox value={String(DayOfWeek.Tuesday)}>Dinsdag</Checkbox>
												<Checkbox value={String(DayOfWeek.Wednesday)}>Woensdag</Checkbox>
												<Checkbox value={String(DayOfWeek.Thursday)}>Donderdag</Checkbox>
												<Checkbox value={String(DayOfWeek.Friday)}>Vrijdag</Checkbox>
												<Checkbox value={String(DayOfWeek.Saturday)}>Zaterdag</Checkbox>
												<Checkbox value={String(DayOfWeek.Sunday)}>Zondag</Checkbox>
											</HStack>
										</CheckboxGroup>
										<FormErrorMessage>{t("schedule.invalidByDayError")}</FormErrorMessage>
									</FormControl>
								</Stack>
							)}

							{/* Only when every n month(s). */}
							{data.intervalType && [IntervalType.Month].includes(data.intervalType) && (<>
								{/* Todo: enable selection of months in byMonth field of Schedule */}
								{/*<Stack direction={["column", "row"]}>*/}
								{/*	<FormControl flex={1} isInvalid={!isValid("byMonth")}>*/}
								{/*		<FormLabel>{t("schedule.byMonth")}</FormLabel>*/}
								{/*		<CheckboxGroup colorScheme={"primary"} defaultValue={[]} value={data.byMonth?.map(x => String(x)) || []} onChange={(val: string[]) => {*/}
								{/*			updateForm("byMonth", val.map(x => parseInt(x)), (newData) => {*/}
								{/*				// if (newData.byMonth.length !== allDaysOfWeek.length) {*/}
								{/*				// 	newData.intervalType = IntervalType.Week;*/}
								{/*				// }*/}
								{/*				//*/}
								{/*				return newData;*/}
								{/*			});*/}
								{/*		}}>*/}
								{/*			<Stack>*/}
								{/*				<Checkbox value={String(1)}> Januari </Checkbox>*/}
								{/*				<Checkbox value={String(2)}> Februari </Checkbox>*/}
								{/*				<Checkbox value={String(3)}> Maart </Checkbox>*/}
								{/*				<Checkbox value={String(4)}> April </Checkbox>*/}
								{/*				<Checkbox value={String(5)}> Mei </Checkbox>*/}
								{/*				<Checkbox value={String(6)}> Juni </Checkbox>*/}
								{/*				<Checkbox value={String(7)}> Juli </Checkbox>*/}
								{/*				<Checkbox value={String(8)}> Augustus </Checkbox>*/}
								{/*				<Checkbox value={String(9)}> September </Checkbox>*/}
								{/*				<Checkbox value={String(10)}> Oktober </Checkbox>*/}
								{/*				<Checkbox value={String(11)}> November </Checkbox>*/}
								{/*				<Checkbox value={String(12)}> December </Checkbox>*/}
								{/*			</Stack>*/}
								{/*		</CheckboxGroup>*/}

								{/*		<FormErrorMessage>{t("schedule.invalidByDayError")}</FormErrorMessage>*/}
								{/*	</FormControl>*/}
								{/*</Stack>*/}

								<Stack direction={["column", "row"]}>

									<FormControl flex={1} isInvalid={!isValid("byMonthDay")} isRequired>
										<FormLabel>{t("schedule.byMonthDay")}</FormLabel>
										<Input type={"number"} min={1} max={28} value={data.byMonthDay || ""} onChange={e => updateForm("byMonthDay", parseInt(e.target.value), newData => ({
											...newData,
											byDay: [],
										}))} placeholder={t("schedule.byMonthDay_placeholder")} />
										<FormErrorMessage>{t("schedule.invalidByMonthDayError")}</FormErrorMessage>
									</FormControl>

								</Stack>
							</>)}
						</>)}

						{data.periodiek === false && (
							<Stack direction={["column", "row"]}>

								<FormControl flex={1} isInvalid={!isValid("startDate")} isRequired>
									<FormLabel>{t("schedule.datum")}</FormLabel>
									<DatePicker selected={(data.startDate && d(data.startDate).isValid()) ? d(data.startDate).startOf("day").toDate() : null} dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											if (value) {
												updateForm("startDate", d(value).startOf("day").toDate());
											}
										}} customInput={<Input type="text" isInvalid={!isValid("startDate")} />} />
									<FormErrorMessage>{t("afspraakBetaalinstructie.invalidDateError")}</FormErrorMessage>
								</FormControl>

							</Stack>
						)}

						<Box>
							<Button type={"submit"} colorScheme={"primary"}>{t("actions.save")}</Button>
						</Box>
					</FormRight>
				</Stack>
			</form>
		</Section>
	);
};

export default EditAfspraakBetaalinstructieForm;