import {Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {FileUpload, UploadState} from "../../../models/models";
import Modal from "../../shared/Modal";
import CsmUploadItem from "./CsmUploadItem";

type CsmUploadModalProps = {
	uploads: FileUpload[],
	onClose: VoidFunction
};

const CsmUploadModal: React.FC<CsmUploadModalProps> = ({uploads, onClose}) => {
	const {t} = useTranslation();

	return (
		<Modal title={t("uploadCsmModal.title")} size={"2xl"} onClose={() => {
			if (uploads.filter(u => u.state !== UploadState.DONE).length > 0) {
				return;
			}
			onClose();
		}}>
			<Stack spacing={5}>
				{uploads.map((u, i) => (
					<CsmUploadItem key={i} upload={u} />
				))}
			</Stack>
		</Modal>
	);
};

export default CsmUploadModal;
