import {Modal as ChakraModal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ModalProps as ChakraModalProps} from "@chakra-ui/react";
import React from "react";

type ModalProps = Omit<ChakraModalProps, "isOpen"> & {
    title: string,
}

const ModalWithoutClose: React.FC<ModalProps> = ({
    title,
    children,
    ...props
}) => {
    return (
        <ChakraModal isOpen={true} {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>{children}</ModalBody>
                <ModalFooter />
            </ModalContent>
        </ChakraModal>
    );
};
export default ModalWithoutClose;