const EditAfspraakBetaalinstructieForm = (props: any) => {
	return null;
};

export default EditAfspraakBetaalinstructieForm;

// import {Box, Button, Checkbox, CheckboxGroup, FormControl, FormErrorMessage, FormLabel, HStack, Input, Radio, RadioGroup, Stack} from "@chakra-ui/react";
// import React, {useState} from "react";
// import DatePicker from "react-datepicker";
// import {useTranslation} from "react-i18next";
// import Select from "react-select";
// import {Afspraak, Betaalinstructie, BetaalinstructieInput, DayOfWeek} from "../../../generated/graphql";
// import d from "../../../utils/dayjs";
// import {useReactSelectStyles} from "../../../utils/things";
// import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
// import Section from "../../Layouts/Section";
// import PageNotFound from "../../PageNotFound";
// import {validatorEenmalig, validatorPeriodiek, validatorPeriodiekMonth, validatorPeriodiekWeek} from "./validators";
//
// // Todo
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// enum CustomIntervalTypeEnum {
// 	ElkeWeek = 1,
// 	ElkeMaand,
// 	Elke3Maanden
// }
//
// type EditAfspraakBetaalinstructieProps = {
// 	afspraak: Afspraak,
// 	values?: Betaalinstructie,
// 	onChange: (data: BetaalinstructieInput) => void,
// }
//
// enum IntervalType {
// 	Week = "WEEK",
// 	Month = "MONTH",
// 	Year = "YEAR"
// }
//
// type BetaalinstructieFormValues = Betaalinstructie & {
// 	intervalType?: IntervalType,
// 	intervalCount?: number,
// 	startDate?: string | Date,
// 	endDate?: string | Date,
// 	periodiek?: boolean,
// };
//
// const getScenario = (data, customIntervalType?: CustomIntervalTypeEnum) => {
// 	if (!customIntervalType) {
// 		return "eenmalig";
// 	}
//
// 	switch (customIntervalType) {
// 		case CustomIntervalTypeEnum.ElkeWeek: {
// 			return "periodiekWeek";
// 		}
// 		case CustomIntervalTypeEnum.ElkeMaand: {
// 			return "periodiekMonth";
// 		}
// 		case CustomIntervalTypeEnum.Elke3Maanden: {
// 			return "periodiekQuarter";
// 		}
// 	}
//
// 	return "periodiek";
// };
//
// const getValidator = (data, customIntervalType?: CustomIntervalTypeEnum) => ({
// 	"eenmalig": validatorEenmalig,
// 	"periodiek": validatorPeriodiek,
// 	"periodiekWeek": validatorPeriodiekWeek,
// 	"periodiekMonth": validatorPeriodiekMonth,
// 	"periodiekQuarter": validatorPeriodiekMonth,
// }[getScenario(data, customIntervalType)]);
//
// // const prepareData = (data, customIntervalType?: CustomIntervalTypeEnum) => {
// // 	const scenario = getScenario(data, customIntervalType);
// //
// // 	switch (scenario) {
// // 		case "eenmalig": {
// // 			return {
// // 				...data.startDate && {startDate: d(data.startDate).format("YYYY-MM-DD")},
// // 			};
// // 		}
// // 		case "periodiekWeek": {
// // 			return {
// // 				...data.startDate && {startDate: d(data.startDate).format("YYYY-MM-DD")},
// // 				...data.endDate && {endDate: d(data.endDate).format("YYYY-MM-DD")},
// // 				byDay: String(Object.keys(DayOfWeek)[d(data.startDate).day() - 1]),
// // 			};
// // 		}
// // 		case "periodiekMonth": {
// // 			return {
// // 				...data.startDate && {startDate: d(data.startDate).format("YYYY-MM-DD")},
// // 				...data.endDate && {endDate: d(data.endDate).format("YYYY-MM-DD")},
// // 				byMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
// // 				byMonthDay: d(data.startDate).date(),
// // 			};
// // 		}
// // 		case "periodiekQuarter": {
// // 			return {
// // 				...data.startDate && {startDate: d(data.startDate).format("YYYY-MM-DD")},
// // 				...data.endDate && {endDate: d(data.endDate).format("YYYY-MM-DD")},
// // 				byMonth: [1, 4, 7, 10],
// // 				byMonthDay: d(data.startDate).date(),
// // 			};
// // 		}
// // 		default: {
// // 			return data;
// // 		}
// // 	}
// // };
//
// const EditAfspraakBetaalinstructieForm: React.FC<EditAfspraakBetaalinstructieProps> = ({afspraak, values, onChange}) => {
// 	const {t} = useTranslation();
// 	const reactSelectStyles = useReactSelectStyles();
// 	// const toast = useToaster();
// 	const [data, setData] = useState<Partial<BetaalinstructieFormValues>>(values || {});
// 	const [customIntervalType, setCustomIntervalType] = useState<CustomIntervalTypeEnum>();
// 	const {id} = afspraak;
//
// 	if (!id) {
// 		return <PageNotFound />;
// 	}
//
// 	const intervalOptions = [
// 		// {key: "day", label: t("interval.day", {count: data.intervalCount}), value: IntervalType.Day},
// 		{key: "week", label: t("interval.week", {count: data.intervalCount || 0}), value: "P1W"},
// 		{key: "month", label: t("interval.month", {count: data.intervalCount || 0}), value: "P1M"},
// 		{key: "year", label: t("interval.year", {count: data.intervalCount}), value: "P1Y"},
// 	];
//
// 	const customIntervalOptions = [
// 		{key: CustomIntervalTypeEnum.ElkeWeek, label: t("customInterval.elkeWeek"), value: CustomIntervalTypeEnum.ElkeWeek},
// 		{key: CustomIntervalTypeEnum.ElkeMaand, label: t("customInterval.elkeMaand"), value: CustomIntervalTypeEnum.ElkeMaand},
// 		{key: CustomIntervalTypeEnum.Elke3Maanden, label: t("customInterval.elke3Maanden"), value: CustomIntervalTypeEnum.Elke3Maanden},
// 	];
//
// 	const validator = getValidator(data, customIntervalType);
// 	const isValid = (fieldName: string) => {
// 		if (fieldName === "periodiek") {
// 			return data.periodiek === true || data.periodiek === false;
// 		}
//
// 		return validator.shape[fieldName]?.safeParse(data[fieldName]).success;
// 	};
//
// 	const updateForm = (field: string, value: any, callback?: (data) => any) => {
// 		setData(prevData => {
// 			let newData = {
// 				...prevData,
// 				[field]: value,
// 			};
//
// 			if (callback) {
// 				newData = {
// 					...newData,
// 					...callback(newData),
// 				};
// 			}
// 			return newData;
// 		});
//
// 	};
//
// 	return (
// 		<Section>
// 			<form onSubmit={e => {
// 				e.preventDefault();
// 				// try {
// 				// 	const newData = prepareData(data, customIntervalType);
// 				// 	const validatedData = validator.parse(newData);
// 				// 	onChange(validatedData as any);
// 				// }
// 				// catch (err) {
// 				// 	toast({error: err.message, title: t("messages.genericError.title")});
// 				// }
// 			}}>
// 				<Stack direction={["column", "row"]}>
// 					<FormLeft title={t("afspraakBetaalinstructie.title")} helperText={t("afspraakBetaalinstructie.helperText")}>
// 						<pre>{JSON.stringify({data}, null, 2)}</pre>
// 					</FormLeft>
// 					<FormRight spacing={5}>
//
// 						<Stack direction={["column", "row"]}>
// 							<FormControl flex={1} isInvalid={!isValid("periodiek")} isRequired>
// 								<FormLabel>{t("afspraak.periodiek")}</FormLabel>
// 								<RadioGroup onChange={e => updateForm("periodiek", e === "periodiek", () => {
// 									setCustomIntervalType(e === "periodiek" ? CustomIntervalTypeEnum.ElkeMaand : undefined);
// 									return {
// 										periodiek: e === "periodiek",
// 									};
// 								})} value={data.periodiek ? "periodiek" : "eenmalig"}>
// 									<Stack>
// 										<Radio value="eenmalig">{t("schedule.eenmalig")}</Radio>
// 										<Radio value="periodiek">{t("schedule.periodiek")}</Radio>
// 									</Stack>
// 								</RadioGroup>
// 								<FormErrorMessage>{t("afspraakBetaalinstructie.invalidPeriodiekError")}</FormErrorMessage>
// 							</FormControl>
// 						</Stack>
//
// 						{data.periodiek === false && ( /* Eenmalig */
// 							<Stack direction={["column", "row"]}>
// 								<FormControl flex={1} isInvalid={!isValid("startDate")} isRequired>
// 									<FormLabel>{t("schedule.datum")}</FormLabel>
// 									<DatePicker selected={(data.startDate && d(data.startDate, "YYYY-MM-DD").isValid()) ? d(data.startDate, "YYYY-MM-DD").startOf("day").toDate() : null} dateFormat={"dd-MM-yyyy"}
// 										onChange={(value: Date) => {
// 											if (value) {
// 												updateForm("startDate", d(value).startOf("day").format("YYYY-MM-DD"), x => ({
// 													...x,
// 													repeatFrequency: "",
// 													byMonth: d(value).month() + 1,
// 													byMonthDay: d(value).date(),
// 												}));
// 											}
// 										}} customInput={<Input type="text" isInvalid={!isValid("startDate")} />} />
// 									<FormErrorMessage>{t("afspraakBetaalinstructie.invalidDateError")}</FormErrorMessage>
// 								</FormControl>
// 							</Stack>
// 						)}
//
// 						{data.periodiek === true && (<>
// 							<Stack direction={["column", "row"]}>
//
// 								<FormControl flex={1} isInvalid={!isValid("startDate")} isRequired>
// 									<FormLabel>{t("schedule.startDate")}</FormLabel>
// 									<DatePicker selected={(data.startDate && d(data.startDate, "YYYY-MM-DD").isValid()) ? d(data.startDate, "YYYY-MM-DD").startOf("day").toDate() : null} dateFormat={"dd-MM-yyyy"}
// 										onChange={(value: Date) => {
// 											if (value) {
// 												updateForm("startDate", d(value).startOf("day").format("YYYY-MM-DD"));
// 											}
// 										}} customInput={<Input type="text" isInvalid={!isValid("startDate")} />} />
// 									<FormErrorMessage>{t("afspraakBetaalinstructie.invalidDateError")}</FormErrorMessage>
// 								</FormControl>
//
// 								<FormControl flex={1} isInvalid={!isValid("endDate")}>
// 									<FormLabel>{t("schedule.endDate")}</FormLabel>
// 									<DatePicker selected={(data.endDate && d(data.endDate, "YYYY-MM-DD").isValid()) ? d(data.endDate, "YYYY-MM-DD").endOf("day").toDate() : null} dateFormat={"dd-MM-yyyy"}
// 										onChange={(value: Date) => {
// 											if (value) {
// 												updateForm("endDate", d(value).startOf("day").format("YYYY-MM-DD"));
// 											}
// 										}} customInput={<Input type="text" isInvalid={!isValid("endDate")} />} />
// 									<FormErrorMessage>{t("afspraakBetaalinstructie.invalidDateError")}</FormErrorMessage>
// 								</FormControl>
//
// 							</Stack>
//
// 							<Stack direction={["column", "row"]}>
// 								<FormControl flex={1} isRequired>
// 									<FormLabel>{t("schedule.customIntervalType")}</FormLabel>
// 									<Box flex={1}>
// 										<Select onChange={(val) => {
// 											if (val?.value) {
// 												setCustomIntervalType(() => val?.value);
// 											}
// 										}}
// 										isClearable={false} noOptionsMessage={() => t("interval.choose")}
// 										maxMenuHeight={200} options={customIntervalOptions} value={customIntervalOptions.find(i => i.value === customIntervalType)}
// 										styles={reactSelectStyles.default} />
// 									</Box>
// 									<FormErrorMessage>{t("schedule.invalidPeriodiekError")}</FormErrorMessage>
// 								</FormControl>
// 							</Stack>
// 						</>)}
//
// 						{/* Todo: Everything below here is not possible as long as the backend keeps saving intervals in R-format. */}
// 						<Stack direction={["column", "row"]}>
//
// 							<FormControl flex={1} maxW={"200px"} isInvalid={!isValid("intervalCount")} isRequired>
// 								<FormLabel>{t("schedule.repeatEvery")}</FormLabel>
// 								<Input type={"number"} min={1} value={data.intervalCount || ""} onChange={e => updateForm("intervalCount", parseInt(e.target.value))} />
// 								<FormErrorMessage>{t("schedule.invalidIntervalCountError")}</FormErrorMessage>
// 							</FormControl>
//
// 							<FormControl flex={1} isInvalid={!isValid("intervalType")} isRequired>
// 								<FormLabel>{t("schedule.repeatEveryPeriod")}</FormLabel>
// 								<Box flex={1}>
// 									<Select onChange={(val) => updateForm("intervalType", val?.value)}
// 										isClearable={false} noOptionsMessage={() => t("interval.choose")}
// 										maxMenuHeight={200} options={intervalOptions} value={intervalOptions.find(i => i.value === data.intervalType)}
// 										styles={isValid("intervalType") ? reactSelectStyles.default : reactSelectStyles.error} />
// 								</Box>
// 								<FormErrorMessage>{t("schedule.invalidIntervalTypeError")}</FormErrorMessage>
// 							</FormControl>
//
// 						</Stack>
//
// 						{/* Todo: enable selection of weekdays in byDay field of Schedule */}
// 						{/* Only when every n week(s). */}
// 						{data.intervalType === IntervalType.Week && (
// 							<Stack direction={["column", "row"]}>
// 								<FormControl flex={1} isInvalid={!isValid("byDay")}>
// 									<FormLabel>{t("schedule.byDay")}</FormLabel>
// 									<CheckboxGroup colorScheme={"primary"} defaultValue={[]} value={data.byDay} onChange={(val: string[]) => updateForm("byDay", val)}>
// 										<HStack>
// 											<Checkbox value={String(DayOfWeek.Monday)}>Maandag</Checkbox>
// 											<Checkbox value={String(DayOfWeek.Tuesday)}>Dinsdag</Checkbox>
// 											<Checkbox value={String(DayOfWeek.Wednesday)}>Woensdag</Checkbox>
// 											<Checkbox value={String(DayOfWeek.Thursday)}>Donderdag</Checkbox>
// 											<Checkbox value={String(DayOfWeek.Friday)}>Vrijdag</Checkbox>
// 											<Checkbox value={String(DayOfWeek.Saturday)}>Zaterdag</Checkbox>
// 											<Checkbox value={String(DayOfWeek.Sunday)}>Zondag</Checkbox>
// 										</HStack>
// 									</CheckboxGroup>
// 									<FormErrorMessage>{t("schedule.invalidByDayError")}</FormErrorMessage>
// 								</FormControl>
// 							</Stack>
// 						)}
//
// 						{/* Only when every n month(s). */}
// 						{data.intervalType && [IntervalType.Month].includes(data.intervalType) && (<>
// 							{ /* Todo: enable selection of months in byMonth field of Schedule */}
// 							<Stack direction={["column", "row"]}>
// 								<FormControl flex={1} isInvalid={!isValid("byMonth")}>
// 									<FormLabel>{t("schedule.byMonth")}</FormLabel>
// 									<CheckboxGroup colorScheme={"primary"} defaultValue={[]} value={data.byMonth?.map(x => String(x)) || []} onChange={(val: string[]) => {
// 										updateForm("byMonth", val.map(x => parseInt(x)), (newData) => {
// 											// if (newData.byMonth.length !== allDaysOfWeek.length) {
// 											// 	newData.intervalType = IntervalType.Week;
// 											// }
// 											//
// 											return newData;
// 										});
// 									}}>
// 										<Stack>
// 											<Checkbox value={String(1)}> Januari </Checkbox>
// 											<Checkbox value={String(2)}> Februari </Checkbox>
// 											<Checkbox value={String(3)}> Maart </Checkbox>
// 											<Checkbox value={String(4)}> April </Checkbox>
// 											<Checkbox value={String(5)}> Mei </Checkbox>
// 											<Checkbox value={String(6)}> Juni </Checkbox>
// 											<Checkbox value={String(7)}> Juli </Checkbox>
// 											<Checkbox value={String(8)}> Augustus </Checkbox>
// 											<Checkbox value={String(9)}> September </Checkbox>
// 											<Checkbox value={String(10)}> Oktober </Checkbox>
// 											<Checkbox value={String(11)}> November </Checkbox>
// 											<Checkbox value={String(12)}> December </Checkbox>
// 										</Stack>
// 									</CheckboxGroup>
// 									<FormErrorMessage>{t("schedule.invalidByDayError")}</FormErrorMessage>
// 								</FormControl>
// 							</Stack>
//
// 							<Stack direction={["column", "row"]}>
//
// 								<FormControl flex={1} isInvalid={!isValid("byMonthDay")} isRequired>
// 									<FormLabel>{t("schedule.byMonthDay")}</FormLabel>
// 									<Input type={"number"} min={1} max={28} value={undefined} onChange={e => updateForm("byMonthDay", parseInt(e.target.value), newData => ({
// 										...newData,
// 										byDay: [],
// 									}))} placeholder={t("schedule.byMonthDay_placeholder")} />
// 									<FormErrorMessage>{t("schedule.invalidByMonthDayError")}</FormErrorMessage>
// 								</FormControl>
//
// 							</Stack>
// 						</>)}
//
// 						<Box>
// 							<Button type={"submit"} colorScheme={"primary"}>{t("actions.save")}</Button>
// 						</Box>
// 					</FormRight>
// 				</Stack>
// 			</form>
// 		</Section>
// 	);
// };
//
// export default EditAfspraakBetaalinstructieForm;