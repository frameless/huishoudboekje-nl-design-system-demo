import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import SaveAfdelingPostadresErrorHandler from "../../errorHandlers/SaveAfdelingPostadresErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {Afdeling, GetAfdelingDocument, GetOrganisatieDocument, useCreateAfdelingPostadresMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import PostadresForm from "../Postadressen/PostadresForm";

type AddAfdelingPostadresModalProps = {
    afdeling: Afdeling,
    onClose: VoidFunction
};

const AddAfdelingPostadresModal: React.FC<AddAfdelingPostadresModalProps> = ({afdeling, onClose}) => {
    const {t} = useTranslation();
    const toast = useToaster();
    const handleSaveAfdelingPostadres = useMutationErrorHandler(SaveAfdelingPostadresErrorHandler);

    const [createAfdelingPostadres] = useCreateAfdelingPostadresMutation({
        refetchQueries: [
            {query: GetOrganisatieDocument, variables: {id: afdeling?.organisatie?.id}},
            {query: GetAfdelingDocument, variables: {id: afdeling.id}},
        ],
    });

    const onSavePostadres = (afdelingId: number, postadres) => {
        createAfdelingPostadres({
            variables: {
                afdelingId: afdelingId,
                ...postadres,
            },
        }).then(() => {
            toast({
                success: t("messages.postadressen.createSuccess"),
            });
            onClose();
        }).catch(handleSaveAfdelingPostadres);
    };

    return (
        <Modal isOpen={true} onClose={() => onClose()}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t("modals.addPostadres.modalTitle")}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <PostadresForm onChange={(data) => onSavePostadres(afdeling.id!, data)} onCancel={() => onClose()} />
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    );
};

export default AddAfdelingPostadresModal;