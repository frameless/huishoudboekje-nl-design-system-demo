import {Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Stack, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import d from "../../../utils/dayjs";
import useToaster from "../../../utils/useToaster";
import zod from "../../../utils/zod";
import Modal from "../../shared/Modal";

const validator = zod.string().regex(new RegExp(/^\d{4}-\d{2}-\d{2}$/));

type AfspraakEndModalProps = {
	onClose: VoidFunction,
	onSubmit: (validThrough: Date) => void
};

const AfspraakEndModal: React.FC<AfspraakEndModalProps> = ({onClose, onSubmit}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [date, setDate] = useState<Date>(d().toDate());

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

		onSubmit(date);
	};

	return (
		<Modal title={t("endAfspraak.confirmModalTitle")} onClose={onClose}>
			<Stack>
				<Text>{t("endAfspraak.confirmModalBody")}</Text>

				<FormControl flex={1} isInvalid={!isValid()}>
					<FormLabel>{t("schedule.endDate")}</FormLabel>
					<DatePicker selected={(date && d(date).isValid()) ? date : null} dateFormat={"dd-MM-yyyy"}
						onChange={(value: Date) => {
							if (value) {
								setDate(d(value).startOf("day").toDate());
							}
						}} customInput={<Input type={"text"} isInvalid={!isValid()} />} />
					<FormErrorMessage>{t("errors.invalidDateError")}</FormErrorMessage>
				</FormControl>

				<Flex justify={"flex-end"}>
					<Button colorScheme={"primary"} onClick={onClickSubmit}>{t("global.actions.end")}</Button>
				</Flex>
			</Stack>
		</Modal>
	);
};

export default AfspraakEndModal;