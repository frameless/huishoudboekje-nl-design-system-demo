import {Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Stack, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import d from "../../../utils/dayjs";
import useToaster from "../../../utils/useToaster";
import useDateValidator from "../../../validators/useDateValidator";
import Modal from "../../shared/Modal";

type AfspraakEndModalProps = {
	onClose: VoidFunction,
	onSubmit: (validThrough: Date) => void,
	startDate: Date
};

const AfspraakEndModal: React.FC<AfspraakEndModalProps> = ({onClose, onSubmit, startDate}) => {
	const validator = useDateValidator();
	const {t} = useTranslation();
	const toast = useToaster();
	const [date, setDate] = useState<Date>(d().toDate());
	const [showEndDateBeforeStartDateError, setShowEndDateBeforeStartDateError] = useState<boolean>(false);

	const isValid = (): boolean => {
		try {
			const stringDate = d(date).format("YYYY-MM-DD");
			validator.parse(stringDate);
			return true;
		}
		catch (e) {
			return false;
		}
	};

	const onClickSubmit = () => {
		if (!isValid()) {
			toast({
				error: t("errors.invalidDateError"),
			});
			return;
		}
		if (showEndDateBeforeStartDateError) {
			toast({
				error: t("errors.endDateBeforeStartDate")
			});
			return;
		}

		onSubmit(date);
	};

	return (
		<Modal title={t("endAfspraak.confirmModalTitle")} onClose={onClose}>
			<Stack>
				<Text>{t("endAfspraak.confirmModalBody")}</Text>

				<FormControl flex={1} isInvalid={!isValid()}>
					<FormLabel>{t("schedule.endDate")}</FormLabel>
					<DatePicker
						selected={date && d(date).isValid() ? date : null} dateFormat={"dd-MM-yyyy"}
						autoComplete="no"
						aria-autocomplete="none"
						isClearable={false}
						selectsRange={false}
						showYearDropdown
						dropdownMode={"select"}
						onChange={(value: Date) => {
							if (value) {
								setDate(d(value).startOf("day").toDate());
								setShowEndDateBeforeStartDateError(d(startDate).isAfter(d(value)))
							}
						}}
						customInput={<Input type={"text"} isInvalid={!isValid()} autoComplete="no" aria-autocomplete="none" />} />
					<FormErrorMessage>{t("errors.invalidDateError")}</FormErrorMessage>
					{showEndDateBeforeStartDateError === true && (<Text fontStyle={"italic"} color={"red.500"}>{t("errors.endDateBeforeStartDate")}</Text>)}

				</FormControl>

				<Flex justify={"flex-end"}>
					<Button disabled={showEndDateBeforeStartDateError} colorScheme={"primary"} onClick={onClickSubmit}>{t("global.actions.end")}</Button>
				</Flex>
			</Stack>
		</Modal>
	);
};

export default AfspraakEndModal;
