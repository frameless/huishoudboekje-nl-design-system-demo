import {Stack, Text} from "@chakra-ui/react";
import React from "react";

import {useTranslation} from "react-i18next";
import Modal from "../../shared/Modal";
import EndAgreementView from "./EndAgreementView";

type AfspraakEndModalProps = {
	onClose: VoidFunction,
	startDate: Date,
	agreementId
};

const AfspraakEndModal: React.FC<AfspraakEndModalProps> = ({onClose, startDate, agreementId}) => {
	const {t} = useTranslation();

	function closeWindow() {
		onClose()
	}


	return (
		<Modal title={t("endAfspraak.confirmModalTitle")} onClose={closeWindow}>
			<Stack>
				<Text>{t("endAfspraak.confirmModalBody")}</Text>

				<EndAgreementView startDate={startDate} onSubmit={(closeWindow)} agreementId={agreementId}></EndAgreementView>
			</Stack>
		</Modal>
	);
};

export default AfspraakEndModal;
