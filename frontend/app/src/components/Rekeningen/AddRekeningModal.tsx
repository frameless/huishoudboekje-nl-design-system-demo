import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Rekening} from "../../generated/graphql";
import RekeningForm from "./RekeningForm";

type AddRekeningModalProps = {
	name: string,
	onSubmit: (rekening: Rekening) => void,
	onClose: VoidFunction,
};

const AddRekeningModal: React.FC<AddRekeningModalProps> = ({onSubmit, name, onClose}) => {
	const {t} = useTranslation();

	return (
		<Modal isOpen={true} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("modals.addRekening.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>

					<RekeningForm rekening={{rekeninghouder: name}} onSubmit={onSubmit} onCancel={onClose} />

				</ModalBody>
				<ModalFooter />
			</ModalContent>
		</Modal>
	);
};

export default AddRekeningModal;