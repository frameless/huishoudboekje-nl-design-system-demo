import {AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button} from "@chakra-ui/react";
import React, {ReactElement, useRef} from "react";
import {useTranslation} from "react-i18next";

type AlertProps = {
	title: string,
	children: React.ReactNode,
	confirmButton?: ReactElement,
	cancelButton?: boolean,
	onClose: () => void,
};

const Alert: React.FC<AlertProps> = ({title, children, confirmButton, cancelButton = true, onClose}) => {
	const cancelDeleteRef = useRef(null);
	const {t} = useTranslation();

	return (
		<AlertDialog isOpen={true} leastDestructiveRef={cancelDeleteRef} onClose={onClose}>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<AlertDialogHeader fontSize={"lg"} fontWeight={"bold"}>{title}</AlertDialogHeader>
				<AlertDialogCloseButton />
				<AlertDialogBody>{children}</AlertDialogBody>
				<AlertDialogFooter>
					{cancelButton && <Button data-test="buttonModal.cancel" ref={cancelDeleteRef} onClick={onClose}>{t("global.actions.cancel")}</Button>}
					{confirmButton}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default Alert;