import {Box, Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text} from "@chakra-ui/react";
import React from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afspraak, CreateAlarmInput, DayOfWeek} from "../../../generated/graphql";
import {RepeatType} from "../../../models/models";
import d from "../../../utils/dayjs";
import {currencyFormat2, useReactSelectStyles} from "../../../utils/things";
import useForm from "../../../utils/useForm";
import useToaster from "../../../utils/useToaster";
import zod from "../../../utils/zod";
import MonthSelector from "../../shared/MonthSelector";
import PeriodiekSelector, {Periodiek} from "../../shared/PeriodiekSelector";
import WeekDaySelector from "../../shared/WeekDaySelector";
import Asterisk from "../../shared/Asterisk";

const eenmaligValidator = zod.object({
	datum: zod.date(), //.refine(val => d().endOf("day").isSameOrBefore(val)), // Must be in the future
	datumMargin: zod.number().min(0),
});

const validator = zod.object({
	isPeriodiek: zod.nativeEnum(Periodiek),
	repeatType: zod.nativeEnum(RepeatType).optional(),
	bedrag: zod.number().min(0),
	bedragMargin: zod.number().min(0),
	datum: zod.date().optional(),
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
			bedrag: afspraak.bedrag,
		},
	});
	const isFieldValid2 = (field: string) => {
		if (!isSubmitted) {
			return true;
		}

		const {datum, datumMargin} = form;
		const parsed = eenmaligValidator.safeParse({datum, datumMargin});
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
			const {bedrag, bedragMargin, datum, datumMargin} = form;
			onSubmit({
				afspraakId: afspraak.id!,
				isActive: true,
				bedrag,
				bedragMargin,
				datum: d(datum).format("YYYY-MM-DD"),
				datumMargin,
			});
			return;
		}

		toast({error: t("global.formError"), title: t("messages.genericError.title")});
	};

	return (
		<Modal isOpen={true} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<form onSubmit={onClickSubmit}>
					<ModalHeader>{t("addAlarmModal.title")}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack>
							<Text>{t("addAlarmModal.helperText")}</Text>

							<PeriodiekSelector value={form.isPeriodiek} isInvalid={!isFieldValid("isPeriodiek")} onChange={p => {
								reset();
								updateForm("isPeriodiek", p);
							}} />

							{form.isPeriodiek === Periodiek.Eenmalig && (<>
								<FormControl flex={1} isInvalid={!isFieldValid("datum") || !isFieldValid2("datum")} isRequired>
									<FormLabel>{t("alarmForm.date")}</FormLabel>
									<DatePicker selected={form.datum} dateFormat={"dd-MM-yyyy"}
										onChange={(value: Date) => {
											if (value) {
												updateForm("datum", d(value).startOf("day").toDate());
											}
										}} customInput={<Input type={"text"} />} />
									<FormErrorMessage>{t("alarmForm.errors.invalidDateError")}</FormErrorMessage>
								</FormControl>

								<FormControl flex={1} isInvalid={!isFieldValid("datumMargin") || !isFieldValid2("datumMargin")} isRequired>
									<FormLabel>{t("alarmForm.datumMargin")}</FormLabel>
									<Input type={"number"} value={form.datumMargin || ""} onChange={e => setForm(x => ({
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
									<WeekDaySelector value={form.byDay || []} onChange={(value => updateForm("byDay", value))} isInvalid={!isFieldValid("byDay")} />

									<FormControl flex={1} isInvalid={!isFieldValid("datumMargin")} isRequired>
										<FormLabel>{t("alarmForm.datumMargin")}</FormLabel>
										<Input type={"number"} value={form.datumMargin || ""} onChange={e => updateForm("datumMargin", parseInt(e.target.value))} min={0} />
										<FormErrorMessage>{t("alarmForm.errors.invalidDatumMarginError")}</FormErrorMessage>
									</FormControl>
								</>)}

								{form.repeatType === RepeatType.Month && (<>
									<MonthSelector value={form.byMonth || []} onChange={(value => updateForm("byMonth", value))} isInvalid={!isFieldValid("byMonth")} />

									<FormControl flex={1} isInvalid={!isFieldValid("byMonthDay")} isRequired>
										<FormLabel>{t("alarmForm.byMonthDay")}</FormLabel>
										<Input type={"number"} value={form.byMonthDay || ""} onChange={e => updateForm("byMonthDay", parseInt(e.target.value))} min={0} max={28} />
										<FormErrorMessage>{t("alarmForm.errors.invalidMonthDayError")}</FormErrorMessage>
									</FormControl>

									<FormControl flex={1} isInvalid={!isFieldValid("datumMargin")} isRequired>
										<FormLabel>{t("alarmForm.datumMargin")}</FormLabel>
										<Input type={"number"} value={form.datumMargin || ""} onChange={e => setForm(x => ({
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

						</Stack>
					</ModalBody>
					<ModalFooter>
						<Stack align={"flex-end"}>
							<HStack>
								<Button variant={"ghost"} onClick={onClose}>{t("global.actions.cancel")}</Button>
								<Button colorScheme={"primary"} onClick={onClickSubmit}>{t("global.actions.save")}</Button>
							</HStack>
							<Asterisk />
						</Stack>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};

export default AddAlarmModal;