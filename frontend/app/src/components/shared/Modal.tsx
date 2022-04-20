import React, {useRef} from 'react';
import {Button, Modal as ChakraModal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";

type ModalProps = {
    title: string,
    isOpen?: boolean,
    children: JSX.Element | JSX.Element[] | string,
    confirmButton?: JSX.Element,
    cancelButton?: boolean,
    onClose: VoidFunction,
}

const Modal: React.FC<ModalProps> = ({title, children, confirmButton, cancelButton = true, onClose, isOpen = true}) => {
    const cancelDeleteRef = useRef(null);
    const {t} = useTranslation();

    return (
        <ChakraModal isOpen onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{children}</ModalBody>
                <ModalFooter>
                    {cancelButton && <Button ref={cancelDeleteRef} onClick={onClose}>{t("global.actions.cancel")}</Button>}
                    {confirmButton}
                </ModalFooter>
            </ModalContent>
        </ChakraModal>
    );
};

export default Modal;