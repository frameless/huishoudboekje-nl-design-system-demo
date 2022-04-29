import {Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import Modal from "../../shared/Modal";
import CsmUploadItem from "./CsmUploadItem";

const CsmUploadModal = ({uploads}) => {
	const {t} = useTranslation();

	return (
		<Modal title={t("uploadCsmModal.title")} size={"2xl"} onClose={() => void(0)}>
			<Stack spacing={5}>
				{uploads.map((u, i) => (
					<CsmUploadItem key={i} upload={u} />
				))}
			</Stack>
		</Modal>
	);
};

export default CsmUploadModal;