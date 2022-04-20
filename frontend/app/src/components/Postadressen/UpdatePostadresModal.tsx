import React from 'react';
import {Afdeling, GetAfdelingDocument, Postadres, useUpdatePostadresMutation} from "../../generated/graphql";
import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import PostadresForm from "./PostadresForm";
import useToaster from "../../utils/useToaster";

type UpdatePostadresModalProps = {
    postadres: Postadres,
    afdeling: Afdeling,
    onClose: VoidFunction,
};

const UpdatePostadresModal: React.FC<UpdatePostadresModalProps> = ({postadres, afdeling, onClose}) => {
    const {t} = useTranslation();
    const toast = useToaster();
    const [updatePostadres] = useUpdatePostadresMutation({
        refetchQueries: [
            {query: GetAfdelingDocument, variables: {id: afdeling.id}},
        ],
    });

    const onSubmit = (data) => {
        updatePostadres({
            variables: {
                id: postadres.id!,
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
                <ModalCloseButton />
                <ModalBody>
                    <PostadresForm onChange={onSubmit} onCancel={onClose} postadres={postadres} />
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    );
};

export default UpdatePostadresModal;