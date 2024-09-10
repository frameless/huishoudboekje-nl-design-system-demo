import {Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {AppRoutes} from "../../../../config/routes";
import {useNavigate} from "react-router-dom";
import {Afspraak} from "../../../../generated/graphql";

type ModalProps = {
    afspraak: Afspraak | null
    onOpen,
    onClose,
    isOpen,
    transactionDate
};

const InactiveAgreementModal: React.FC<ModalProps> = ({afspraak, onOpen, onClose, isOpen, transactionDate}) => {
    const {t} = useTranslation(["transactiondetails"]);
    const navigate = useNavigate()

    return (
        <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t("inactiveModal.title")}</ModalHeader>
                <ModalBody>
                    {t("inactiveModal.message")}
                </ModalBody>
                <ModalCloseButton />
                <ModalFooter>
                    <Button colorScheme='primary' mr={3} onClick={() => navigate(AppRoutes.ViewAfspraak(String(afspraak?.id)), {state: {endAt: transactionDate, }})}>{t("inactiveModal.changeEnddate")}</Button>
                    <Button variant='ghost' onClick={onClose}>{t("inactiveModal.cancel")}</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
export default InactiveAgreementModal;


