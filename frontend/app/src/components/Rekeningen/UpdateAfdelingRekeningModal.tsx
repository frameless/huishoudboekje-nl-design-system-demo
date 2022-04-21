import React from 'react';
import Modal from "../shared/Modal";
import {useTranslation} from "react-i18next";
import useToaster from "../../utils/useToaster";
import {GetRekeningDocument, Rekening, useUpdateRekeningMutation} from "../../generated/graphql";
import UpdateRekeningForm from "./UpdateRekeningForm";

type UpdateAfdelingRekeningModalProps = {
    rekening: Rekening,
    onClose: VoidFunction,
};

const UpdateAfdelingRekeningModal: React.FC<UpdateAfdelingRekeningModalProps> = ({rekening, onClose}) => {
    const {t} = useTranslation();
    const toast = useToaster();
    const [updateAfdelingRekening] = useUpdateRekeningMutation({
        refetchQueries: [
            {query: GetRekeningDocument, variables: {id: rekening.id}},
        ],
    });

    const onSubmit = (data) => {
        updateAfdelingRekening({
            variables: {
                id: rekening.id!,
                ...data,
            },
        }).then(() => {
            toast({
                success: t("messages.rekening.updateSucces"),
            });
            onClose();
        }).catch(err => {
            toast({
                error: err.message,
            });
        });
    }

    return (
        <Modal
            title={t("modal.updateAfdelingRekening.title")}
            showCancelButton={false}
            isOpen={true}
            onClose={onClose}
        >
            {/*<RekeningForm onSubmit={onSubmit} onCancel={onClose} rekening={rekening} />*/}
            <UpdateRekeningForm onSubmit={onSubmit} onCancel={onClose} rekening={rekening} />
        </Modal>
    );
};

export default UpdateAfdelingRekeningModal


;