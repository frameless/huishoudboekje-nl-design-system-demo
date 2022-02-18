import {AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useTranslation} from "react-i18next";

const Alert = ({title, children, confirmButton, cancelButton = true, onClose}) => {
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
					{cancelButton && <Button ref={cancelDeleteRef} onClick={onClose}>{t("global.actions.cancel")}</Button>}
					{confirmButton}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default Alert;