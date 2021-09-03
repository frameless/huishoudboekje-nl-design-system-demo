import {AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useTranslation} from "react-i18next";

const Alert = ({title, children, confirmButton, cancelButton = true, onClose}) => {
	const cancelDeleteRef = useRef(null);
	const {t} = useTranslation();

	return (
		<AlertDialog isOpen={true} leastDestructiveRef={cancelDeleteRef} onClose={onClose}>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<AlertDialogHeader fontSize="lg" fontWeight="bold">{title}</AlertDialogHeader>
				<AlertDialogBody>{children}</AlertDialogBody>
				<AlertDialogFooter>
					{cancelButton && <Button ref={cancelDeleteRef} onClick={onClose} data-cy={"inModal"}>{t("global.actions.cancel")}</Button>}
					{confirmButton}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default Alert;