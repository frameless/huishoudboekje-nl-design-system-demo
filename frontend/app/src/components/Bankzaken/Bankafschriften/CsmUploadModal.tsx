import {Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import CsmUploadItem from "./CsmUploadItem";
import Modal from "../../shared/Modal";

const CsmUploadModal = ({uploads}) => {
    const {t} = useTranslation();

    return (
        <Modal
            title={t("uploadCsmModal.title")}
            isOpen={true}
            onClose={() => void (0)}
            size={"2xl"}
        >
            <Stack spacing={5}>
                {uploads.map((u, i) => (
                    <CsmUploadItem key={i} upload={u} />
                ))}
            </Stack>
        </Modal>
    );
};

export default CsmUploadModal;