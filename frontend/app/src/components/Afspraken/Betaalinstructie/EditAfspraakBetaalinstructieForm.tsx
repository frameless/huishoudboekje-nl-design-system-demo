import {Box, Button, Checkbox, CheckboxGroup, FormControl, FormErrorMessage, FormLabel, Input, Radio, RadioGroup, Stack, Wrap, WrapItem} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afspraak, Betaalinstructie, BetaalinstructieInput, DayOfWeek} from "../../../generated/graphql";
import {RepeatType} from "../../../models/RepeatType";
import d from "../../../utils/dayjs";
import {useReactSelectStyles} from "../../../utils/things";
import useForm from "../../../utils/useForm";
import useToaster from "../../../utils/useToaster";
import {FormLeft, FormRight} from "../../Layouts/Forms";
import Section from "../../Layouts/Section";
import PageNotFound from "../../PageNotFound";

type EditAfspraakBetaalinstructieProps = {
	afspraak: Afspraak,
	values?: Betaalinstructie,
	onChange: (data: BetaalinstructieInput) => void,
}

const EditAfspraakBetaalinstructieForm: React.FC<EditAfspraakBetaalinstructieProps> = ({afspraak, values, onChange}) => {
	const {id} = afspraak;
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();
	const toast = useToaster();

	const [isPeriodiek, setPeriodiek] = useState<boolean>(true);
	const [repeatType, setRepeatType] = useState<RepeatType | undefined>(undefined);
	const [data, {setForm, updateForm, reset}] = useForm<string, any>({});

	if (!id) {
		return <PageNotFound />;
	}

	const isValid = (fieldName: string) => {
		const validators = {
			startDate: d(data.startDate, "YYYY-MM-DD").isValid(),
			endDate: data.endDate ? d(data.endDate, "YYYY-MM-DD").isValid() : true,
			byDay: (data.byDay || []).length > 0,
			byMonth: (data.byMonth || []).length > 0,
			byMonthDay: data.byMonthDay && parseInt(data.byMonthDay) >= 1 && parseInt(data.byMonthDay) <= (isPeriodiek ? 28 : 31),
		};

		return validators[fieldName] || false;
	};

	const onSubmit = e => {
		e.preventDefault();

		const isDataValid = Object.keys(data).filter(d => typeof data[d] !== "undefined").every(fieldName => isValid(fieldName));
		if (!isDataValid) {
			toast({error: t("genericInputErrorMessage")});
			return;
		}

		const {startDate, endDate, byDay, byMonth, byMonthDay} = data;
		onChange({startDate, endDate, byDay, byMonth, byMonthDay, repeatFrequency: ""});
	};

	const repeatTypeOptions = [
		// {key: RepeatType.Day, value: RepeatType.Day, label: t("schedule.repeatType_day")},
		{key: RepeatType.Week, value: RepeatType.Week, label: t("schedule.repeatType_week")},
		{key: RepeatType.Month, value: RepeatType.Month, label: t("schedule.repeatType_month")},
		{key: RepeatType.Year, value: RepeatType.Year, label: t("schedule.repeatType_year")},
	];

	return (
		<Section>
			<form onSubmit={onSubmit}>
				<Stack direction={["column", "row"]}>
					<FormLeft title={t("afspraakBetaalinstructie.title")} helperText={t("afspraakBetaalinstructie.helperText")} />
					<FormRight spacing={5}>

						<Stack direction={["column", "row"]}>
							<FormControl flex={1} isInvalid={typeof isPeriodiek !== "boolean"} isRequired>
								<FormLabel>{t("afspraak.periodiek")}</FormLabel>
								<RadioGroup onChange={e => {
									setPeriodiek(e === "periodiek");
									reset();
								}} value={typeof isPeriodiek === "boolean" ? (isPeriodiek ? "periodiek" : "eenmalig") : undefined}>
									<Stack>
										<Radio value="eenmalig">{t("schedule.eenmalig")}</Radio>
										<Radio value="periodiek">{t("schedule.periodiek")}</Radio>
									</Stack>
								</RadioGroup>
								<FormErrorMessage>{t("afspraakBetaalinstructie.invalidPeriodiekError")}</FormErrorMessage>
							</FormControl>
						</Stack>

						{isPeriodiek === false && ( /* Eenmalig */
							<Stack direction={["column", "row"]}>
								<FormControl flex={1} isInvalid={!isValid("startDate")} isRequired>
									<FormLabel>{t("schedule.datum")}</FormLabel>
									<DatePicker selected={data.startDate ? d(data.startDate, "YYYY-MM-DD").startOf("day").toDate() : null} dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											if (value) {
												updateForm("startDate", d(value).format("YYYY-MM-DD"), x => ({
													...x,
													byMonth: [d(value).month() + 1],
													byMonthDay: [d(value).date()],
													startDate: d(value).format("YYYY-MM-DD"),
													endDate: d(value).add(1, "day").format("YYYY-MM-DD"),
												}));
											}
										}} customInput={<Input type="text" />} />
									<FormErrorMessage>{t("afspraakBetaalinstructie.invalidDateError")}</FormErrorMessage>
								</FormControl>
							</Stack>
						)}

						{isPeriodiek && ( /* Periodiek */ <>
							<Stack direction={["column", "row"]}>

								<FormControl flex={1} isInvalid={!isValid("startDate")} isRequired>
									<FormLabel>{t("schedule.startDate")}</FormLabel>
									<DatePicker selected={(data.startDate && d(data.startDate, "YYYY-MM-DD").isValid()) ? d(data.startDate, "YYYY-MM-DD").toDate() : null} dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											updateForm("startDate", value ? d(value).format("YYYY-MM-DD") : undefined);
										}} customInput={<Input type="text" />} />
									<FormErrorMessage>{t("afspraakBetaalinstructie.invalidDateError")}</FormErrorMessage>
								</FormControl>

								<FormControl flex={1} isInvalid={!isValid("endDate")}>
									<FormLabel>{t("schedule.endDate")}</FormLabel>
									<DatePicker selected={(data.endDate && d(data.endDate, "YYYY-MM-DD").isValid()) ? d(data.endDate, "YYYY-MM-DD").endOf("day").toDate() : null} dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											updateForm("endDate", value ? d(value).format("YYYY-MM-DD") : undefined);
										}} customInput={<Input type="text" />} isClearable={true} />
									<FormErrorMessage>{t("afspraakBetaalinstructie.invalidDateError")}</FormErrorMessage>
								</FormControl>

							</Stack>

							<Stack direction={["column", "row"]}>
								<FormControl flex={1} isInvalid={repeatType === undefined} isRequired>
									<FormLabel>{t("schedule.repeatType")}</FormLabel>
									<Box flex={1}>
										<Select onChange={(val) => {
											setRepeatType(val?.value);

											const allMonths = Array.from({length: 12}).map((x, i) => i + 1);
											setForm(data => ({
												...data,
												byDay: undefined,
												byMonth: val?.value === RepeatType.Month ? allMonths : undefined,
												byMonthDay: (data.byMonthDay && repeatType === RepeatType.Week) ? data.byMonthDay : undefined,
											}));
										}} value={repeatTypeOptions.find(r => r.value === repeatType)}
										isClearable={false} noOptionsMessage={() => t("schedule.repeatTypeChoose")}
										maxMenuHeight={200} options={repeatTypeOptions}
										styles={reactSelectStyles.default} />
									</Box>
									<FormErrorMessage>{t("schedule.invalidPeriodiekError")}</FormErrorMessage>
								</FormControl>
							</Stack>

							{repeatType === RepeatType.Week && ( /* Wekelijks */
								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isValid("byDay")}>
										<FormLabel>{t("schedule.byDay")}</FormLabel>
										<CheckboxGroup colorScheme={"primary"} defaultValue={[]} value={data.byDay || []} onChange={(val: string[]) => updateForm("byDay", val)}>
											<Wrap>
												<WrapItem><Checkbox value={String(DayOfWeek.Monday)}>Maandag</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(DayOfWeek.Tuesday)}>Dinsdag</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(DayOfWeek.Wednesday)}>Woensdag</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(DayOfWeek.Thursday)}>Donderdag</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(DayOfWeek.Friday)}>Vrijdag</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(DayOfWeek.Saturday)}>Zaterdag</Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(DayOfWeek.Sunday)}>Zondag</Checkbox></WrapItem>
											</Wrap>
										</CheckboxGroup>
										<FormErrorMessage>{t("schedule.invalidByDayError")}</FormErrorMessage>
									</FormControl>
								</Stack>
							)}

							{repeatType && [RepeatType.Month, RepeatType.Year].includes(repeatType) && (/* Maandelijks / Jaarlijks */ <>
								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isValid("byMonth")}>
										<FormLabel>{t("schedule.byMonth")}</FormLabel>
										<CheckboxGroup colorScheme={"primary"} defaultValue={[]} value={(data.byMonth || [])?.map(x => String(x)) || []} onChange={(val: string[]) => updateForm("byMonth", val.map(x => parseInt(x)))}>
											<Wrap>
												<WrapItem><Checkbox value={String(1)}> Januari </Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(2)}> Februari </Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(3)}> Maart </Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(4)}> April </Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(5)}> Mei </Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(6)}> Juni </Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(7)}> Juli </Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(8)}> Augustus </Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(9)}> September </Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(10)}> Oktober </Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(11)}> November </Checkbox></WrapItem>
												<WrapItem><Checkbox value={String(12)}> December </Checkbox></WrapItem>
											</Wrap>
										</CheckboxGroup>
										<FormErrorMessage>{t("schedule.invalidByMonthError")}</FormErrorMessage>
									</FormControl>
								</Stack>

								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isValid("byMonthDay")} isRequired>
										<FormLabel>{t("schedule.byMonthDay")}</FormLabel>
										<Input type={"number"} min={1} max={28} value={undefined} onChange={e => updateForm("byMonthDay", parseInt(e.target.value), newData => ({
											...newData,
											byDay: undefined,
										}))} />
										<FormErrorMessage>{t("schedule.invalidByMonthDayError")}</FormErrorMessage>
									</FormControl>
								</Stack>
							</>)}
						</>)}

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