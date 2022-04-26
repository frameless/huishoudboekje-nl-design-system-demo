import {Button, HStack, Modal as ChakraModal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import Asterisk from "./Asterisk";

type ModalProps = {
	title: string,
	isOpen: boolean,
	children: JSX.Element | JSX.Element[] | string,
	confirmButton?: JSX.Element,
	showCancelButton?: boolean,
	onClose: VoidFunction,
	showAsterisk?: boolean,
	size?: string,
}

const Modal: React.FC<ModalProps> = ({
	title, children, confirmButton, showCancelButton = true,
	onClose, isOpen = true, showAsterisk = true, size,
}) => {
	const cancelDeleteRef = useRef(null);
	const {t} = useTranslation();

	return (
		<ChakraModal isOpen={isOpen} onClose={onClose} size={size}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>{children}</ModalBody>
				<ModalFooter>
					{confirmButton && (
						<Stack align={"flex-end"}>
							<HStack justify={"flex-end"}>
								{showCancelButton && <Button ref={cancelDeleteRef} onClick={onClose}>{t("global.actions.cancel")}</Button>}
								{confirmButton}
							</HStack>
							{showAsterisk && <Asterisk />}
						</Stack>
					)}
				</ModalFooter>
			</ModalContent>
		</ChakraModal>
	);
};

export default Modal;