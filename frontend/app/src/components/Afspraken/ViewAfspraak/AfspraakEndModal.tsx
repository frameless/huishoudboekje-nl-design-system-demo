import {Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Stack, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import d from "../../../utils/dayjs";
import useToaster from "../../../utils/useToaster";
import useDateValidator from "../../../validators/useDateValidator";
import Modal from "../../shared/Modal";
import {useLocation, useNavigate} from "react-router-dom";

type AfspraakEndModalProps = {
	onClose: VoidFunction,
	onSubmit: (validThrough: Date) => void,
	startDate: Date
};

const AfspraakEndModal: React.FC<AfspraakEndModalProps> = ({onClose, onSubmit, startDate}) => {
	const validator = useDateValidator();
	const location = useLocation();
	const navigate = useNavigate();
	const {t} = useTranslation();
	const toast = useToaster();
	const [date, setDate] = useState<Date>(location.state?.endAt == undefined ? d().toDate() : d(location.state.endAt).toDate());
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

	function onClickClose() {
		if (location.state?.endAt != undefined) {
			navigate(location.pathname, {replace: true})
		}
		onClose()
	}

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
		if (location.state?.endAt != undefined) {
			navigate(location.pathname, {replace: true})
		}
		onSubmit(date);
	};

	return (
		<Modal title={t("endAfspraak.confirmModalTitle")} onClose={onClickClose}>
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
					<Button disabled={showEndDateBeforeStartDateError} colorScheme={"primary"} data-test="button.endAgreement" onClick={onClickSubmit}>{t("global.actions.end")}</Button>
				</Flex>
			</Stack>
		</Modal>
	);
};

export default AfspraakEndModal;
