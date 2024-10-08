import {Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {Afspraak} from "../../../../generated/graphql";
import { formatBurgerName } from "../../../../utils/things";

type ConfirmModalProps = {
    selectedAfspraak: Afspraak | null
    onOpen,
    onClose,
    isOpen,
    onConfirm
};

const ConfirmReconciliationModal: React.FC<ConfirmModalProps> = ({selectedAfspraak, onOpen, onClose, isOpen, onConfirm}) => {
	const {t} = useTranslation();

    return (
        <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t("bookingSection.confirmReconciliationTitle")}</ModalHeader>
                <ModalBody>
                    {t("bookingSection.confirmReconciliationMessage", {"description" : selectedAfspraak?.omschrijving, "civilian":  formatBurgerName(selectedAfspraak?.burger)})}
                </ModalBody>
                <ModalCloseButton />
                <ModalFooter>
                    <Button data-test="button.cancelAfletter" variant='ghost' onClick={onClose}>{t("global.actions.cancel")}</Button>
                    <Button data-test="button.confirmAfletter" colorScheme='primary' mr={3} onClick={onConfirm}>{t("global.actions.confirm")}</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
export default ConfirmReconciliationModal;


