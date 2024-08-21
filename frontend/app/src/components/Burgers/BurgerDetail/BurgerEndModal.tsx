import {Button, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack, Text} from "@chakra-ui/react";
import React, {useRef, useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import d from "../../../utils/dayjs";
import Modal from "../../shared/Modal";

type BurgerEndModalProps = {
	onClose: VoidFunction,
	onSubmit: (enddate: Date) => void
};

const BurgerEndModal: React.FC<BurgerEndModalProps> = ({onClose, onSubmit}) => {
	const {t} = useTranslation();
	const [date, setDate] = useState<Date>(d().startOf("day").toDate());

	const [confirmModal, setconfirmModal] = useState<boolean>(false);
	const cancelRef = useRef<HTMLButtonElement | null>(null);

	const isInvalid = (): boolean => {
		return d(date).isBefore(d().startOf("day"))
	};

	const onClickSubmit = () => {
		setconfirmModal(true)
	};

	const onConfirmEnd = () => {
		onSubmit(date);
		onClose()
	};

	return (
		<Modal title={ !confirmModal ? t("messages.burgers.endModal.title") : t("messages.burgers.endModal.confirmTitle")} onClose={onClose}>
				{!confirmModal &&
					<Stack>
						<Text>{t("messages.burgers.endModal.message")}</Text>
						<FormControl flex={1} isInvalid={isInvalid()}>
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
									}
								}}
								customInput={<Input type={"text"} data-test="input.endDate" autoComplete="no" aria-autocomplete="none" />} />
							<FormErrorMessage>{t("messages.burgers.endModal.invalidDateError")}</FormErrorMessage>
						</FormControl>
						<Flex justify={"flex-end"}>
							<Button data-test="button.endModal.confirm" isDisabled={isInvalid()} colorScheme={"primary"} onClick={onClickSubmit}>{t("messages.burgers.endModal.button")}</Button>
						</Flex>
					</Stack>
				}
				{confirmModal &&
					<Stack>
						<Text>{t("messages.burgers.endModal.confirmMessage", {date: d(date).format("DD-MM-YYYY")})}</Text>
						<Flex justify={"flex-end"}>
							<HStack>
								<Button data-test="button.warnModal.cancel" ref={cancelRef} onClick={onClose}>{t("global.actions.cancel")}</Button>
								<Button data-test="button.warnModal.confirm" colorScheme={"primary"} onClick={onConfirmEnd}>{t("global.actions.end")}</Button>
							</HStack>
						</Flex>
					</Stack>
				}
		</Modal>
	);
};

export default BurgerEndModal;
