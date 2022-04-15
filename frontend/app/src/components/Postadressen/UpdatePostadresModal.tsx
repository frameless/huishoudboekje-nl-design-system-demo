import React from 'react';
import {Postadres, useUpdatePostadresMutation} from "../../generated/graphql";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import PostadresForm from "./PostadresForm";
import useToaster from "../../utils/useToaster";

type UpdatePostadresModalProps = {
    postadres: Postadres,
    onClose: VoidFunction
};

const UpdatePostadresModal: React.FC<UpdatePostadresModalProps> = (postadres, onClose) => {
    const {t} = useTranslation();
    const toast = useToaster();
    const [updatePostadres] = useUpdatePostadresMutation();

    const onSubmit = (data) => {
        updatePostadres({
            variables: {
                id: postadres.postadres.id,
                ...data,
            },
        }).then(() => {
            toast({
                success: t("messages.postadres.updateSucces"),
            });
            onClose();
        }).catch(err => {
            toast({
                error: err.message,
            });
        });
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t("modal.updatePostadress.title")}</ModalHeader>
                <ModalBody>
                    <PostadresForm onSubmit={onSubmit} onCancel={onClose} postadres={postadres.postadres} values={{
                        straatnaam: postadres.postadres.straatnaam,
                        huisnummer: postadres.postadres.huisnummer,
                        postcode: postadres.postadres.postcode,
                        plaatsnaam: postadres.postadres.straatnaam,
                    }} />
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    );
};

export default UpdatePostadresModal;