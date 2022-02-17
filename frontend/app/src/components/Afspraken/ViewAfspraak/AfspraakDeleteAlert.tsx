import {Button} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import Alert from "../../shared/Alert";

const AfspraakDeleteAlert = ({isOpen, onClose, onSubmit, disclosure}) => {
	const {t} = useTranslation();

	return (<>
		{disclosure.isOpen && (
			<Alert
				title={t("deleteAfspraak.confirmModalTitle")}
				cancelButton={true}
				confirmButton={
					<Button colorScheme={"red"} ml={3} onClick={onSubmit}>
						{t("global.actions.delete")}
					</Button>
				}
				onClose={disclosure.onClose}
			>
				{t("deleteAfspraak.confirmModalBody")}
			</Alert>
		)
		}
	</>);
};

export default AfspraakDeleteAlert;