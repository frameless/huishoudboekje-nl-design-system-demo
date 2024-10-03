import {Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure, useToast} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {AppRoutes} from "../../../../config/routes";
import {useLocation, useNavigate} from "react-router-dom";
import {Afspraak, GetAfspraakDocument, GetTransactieDocument, useCreateJournaalpostAfspraakMutation, useEndAfspraakMutation} from "../../../../generated/graphql";
import {useState} from "react";
import d from "../../../../utils/dayjs";
import useToaster from "../../../../utils/useToaster";
import useDateValidator from "../../../../validators/useDateValidator";
import EndAgreementView from "../../../Afspraken/ViewAfspraak/EndAgreementView";
import { formatBurgerName } from "../../../../utils/things";

type ModalProps = {
    afspraak: Afspraak | null
    onOpen,
    onClose,
    isOpen,
    transactionDate,
    transactionId
};

const InactiveAgreementModal: React.FC<ModalProps> = ({afspraak, onOpen, onClose, isOpen, transactionDate, transactionId}) => {
    const {t} = useTranslation(["transactiondetails"]);
    const toast = useToaster()
    const [changeEndDate, setChangeEndDate] = useState(false);


    function onClickChangeEndDate() {
        setChangeEndDate(true)
    }

    function close() {
        setChangeEndDate(false)
        onClose()
    }

    const [createJournaalpostAfspraak] = useCreateJournaalpostAfspraakMutation({
        refetchQueries: [
            {query: GetTransactieDocument, variables: {uuid: transactionId}},
        ],
    });

    function onSubmit() {
        onSelectAfspraak()
    }

    function onSelectAfspraak() {
        const afspraakId = afspraak?.id;

        if (transactionId && afspraakId) {
            createJournaalpostAfspraak({
                variables: {transactionId, afspraakId},
            }).then(() => {
                toast({success: t("messages.journals.createSuccessMessage")});
                close()
            }).catch(err => {
                if (err.message.includes("(some) transactions have unknown ibans ")) {
                    toast({error: t("messages.journals.errors.unknownTransactionIban")})
                } else if (err.message.includes("(some) transactions have no iban")) {
                    toast({error: t("messages.journals.errors.noTransactionIban")})
                } else {
                    toast({error: err.message});
                }
            });
        }
    }


    return (
        <Modal isCentered={true} isOpen={isOpen} onClose={close}>
            <ModalOverlay />
            {!changeEndDate && (
                <ModalContent>
                    <ModalHeader>{t("inactiveModal.title")}</ModalHeader>
                    <ModalBody>
                        {t("inactiveModal.message")}
                    </ModalBody>
                    <ModalCloseButton />
                    <ModalFooter>
                        <Button colorScheme='primary' mr={3} onClick={onClickChangeEndDate}>{t("inactiveModal.changeEnddate")}</Button>
                        <Button variant='ghost' onClick={onClose}>{t("inactiveModal.cancel")}</Button>
                    </ModalFooter>
                </ModalContent>)}
            {changeEndDate && (
                <ModalContent>
                    <ModalHeader>{t("inactiveModal.endAgreementTitle")}</ModalHeader>
                    <ModalBody>
                        <Stack spacing={2}>
                            <Text>
                                {t("inactiveModal.confirmReconciliationMessage", {"description" : afspraak?.omschrijving, "civilian":  formatBurgerName(afspraak?.burger)})}
                            </Text>
                            <Text>
                                {t("inactiveModal.dateInfo", {transactionDate: d(transactionDate).format('DD-MM-YYYY')})}
                            </Text>
                            <EndAgreementView onSubmit={onSubmit} startDate={afspraak?.validFrom} endDate={transactionDate} endAfter={transactionDate} agreementId={afspraak?.id}></EndAgreementView>
                        </Stack>
                    </ModalBody>
                    <ModalCloseButton />
                </ModalContent>

            )}
        </Modal>
    );
};
export default InactiveAgreementModal;


