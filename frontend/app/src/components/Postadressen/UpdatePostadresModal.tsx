import React from "react";
import {useTranslation} from "react-i18next";
import {Afdeling, GetAfdelingDocument, Postadres, useUpdatePostadresMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import Modal from "../shared/Modal";
import PostadresForm from "./PostadresForm";

type UpdatePostadresModalProps = {
    postadres: Postadres,
    afdeling: Afdeling,
    onClose: VoidFunction,
};

const UpdatePostadresModal: React.FC<UpdatePostadresModalProps> = ({postadres, afdeling, onClose}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [updatePostadres] = useUpdatePostadresMutation({
		refetchQueries: [
			{query: GetAfdelingDocument, variables: {id: afdeling.id}},
		],
	});

	const onSubmit = (data) => {
		updatePostadres({
			variables: {
				id: postadres.id!,
				...data,
			},
		}).then(() => {
			toast({
				success: t("messages.postadres.updateSucces"),
			});
			onClose();
		}).catch(err => {
			toast({
				error: err.message,
			});
		});
	};

	return (
		<Modal title={t("modal.updatePostadress.title")} onClose={onClose}>
			<PostadresForm onChange={onSubmit} onCancel={onClose} postadres={postadres} />
		</Modal>
	);
};

export default UpdatePostadresModal;