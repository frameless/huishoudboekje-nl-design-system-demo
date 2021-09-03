import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import d from "../../../utils/dayjs";
import useToaster from "../../../utils/useToaster";
import zod from "../../../utils/zod";

const validator = zod.string().regex(new RegExp(/^\d{4}-\d{2}-\d{2}$/));

const AfspraakEndModal = ({isOpen, onClose, onSubmit}) => {
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
		try {
			const stringDate = d(date).format("YYYY-MM-DD");
			validator.parse(stringDate);
			onSubmit(stringDate);
		}
		catch (e) {
			toast({error: t("errors.invalidDateError")});
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("endAfspraak.confirmModalTitle")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack>
						<Text>{t("endAfspraak.confirmModalBody")}</Text>

						<FormControl flex={1} isInvalid={!isValid()}>
							<FormLabel>{t("schedule.endDate")}</FormLabel>
							<DatePicker selected={(date && d(date).isValid()) ? date : null} dateFormat={"dd-MM-yyyy"}
								onChange={(value: Date) => {
									if (value) {
										setDate(d(value).startOf("day").toDate());
									}
								}} customInput={<Input type="text" isInvalid={!isValid()} />} />
							<FormErrorMessage>{t("errors.invalidDateError")}</FormErrorMessage>
						</FormControl>
					</Stack>
				</ModalBody>
				<ModalFooter>
					<HStack>
						<Button variant={"ghost"} onClick={onClose}>{t("global.actions.cancel")}</Button>
						<Button colorScheme={"primary"} onClick={onClickSubmit}>{t("global.actions.end")}</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AfspraakEndModal;