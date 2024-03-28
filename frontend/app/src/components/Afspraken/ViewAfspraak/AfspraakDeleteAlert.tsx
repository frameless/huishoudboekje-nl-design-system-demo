import {Button} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import Alert from "../../shared/Alert";

type AfspraakDeleteAlertProps = {
	onClose: VoidFunction,
	onConfirm: VoidFunction
};

const AfspraakDeleteAlert: React.FC<AfspraakDeleteAlertProps> = ({onClose, onConfirm}) => {
	const {t} = useTranslation();

	return (
		<Alert
			title={t("deleteAfspraak.confirmModalTitle")}
			cancelButton={true}
			onClose={onClose}
			confirmButton={(
				<Button data-test="button.Delete" colorScheme={"red"} ml={3} onClick={onConfirm}>
					{t("global.actions.delete")}
				</Button>
			)}
		>
			{t("deleteAfspraak.confirmModalBody")}
		</Alert>
	);
};

export default AfspraakDeleteAlert;