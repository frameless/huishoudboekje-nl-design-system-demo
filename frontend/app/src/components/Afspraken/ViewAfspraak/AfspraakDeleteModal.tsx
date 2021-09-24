import {Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";

const AfspraakDeleteModal = ({isOpen, onClose, onSubmit}) => {
	const {t} = useTranslation();

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("deleteAfspraak.confirmModalTitle")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Text>{t("deleteAfspraak.confirmModalBody")}</Text>
				</ModalBody>
				<ModalFooter>
					<HStack>
						<Button variant={"ghost"} onClick={onClose}>{t("global.actions.cancel")}</Button>
						<Button colorScheme={"red"} onClick={onSubmit}>{t("global.actions.delete")}</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AfspraakDeleteModal;