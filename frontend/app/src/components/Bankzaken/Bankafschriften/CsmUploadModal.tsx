import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import CsmUploadItem from "./CsmUploadItem";

const CsmUploadModal = ({uploads}) => {
	const {t} = useTranslation();

	return (
		<Modal isOpen={true} onClose={() => void(0)}>
			<ModalOverlay />
			<ModalContent minWidth={["90%", null, "800px"]}>
				<ModalHeader>{t("uploadCsmModal.title")}</ModalHeader>
				<ModalBody>
					<Stack spacing={5}>
						{uploads.map((u, i) => (
							<CsmUploadItem key={i} upload={u} />
						))}
					</Stack>
				</ModalBody>
				<ModalFooter />
			</ModalContent>
		</Modal>
	);
};

export default CsmUploadModal;