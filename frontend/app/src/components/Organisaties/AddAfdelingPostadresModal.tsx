import React from "react";
import {useTranslation} from "react-i18next";
import SaveAfdelingPostadresErrorHandler from "../../errorHandlers/SaveAfdelingPostadresErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {Afdeling, GetAfdelingDocument, GetOrganisatieDocument, useCreateAfdelingPostadresMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import PostadresForm from "../Postadressen/PostadresForm";
import Modal from "../shared/Modal";

type AddAfdelingPostadresModalProps = {
    afdeling: Afdeling,
    onClose: VoidFunction
};

const AddAfdelingPostadresModal: React.FC<AddAfdelingPostadresModalProps> = ({afdeling, onClose}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const handleSaveAfdelingPostadres = useMutationErrorHandler(SaveAfdelingPostadresErrorHandler);

	const [createAfdelingPostadres] = useCreateAfdelingPostadresMutation({
		refetchQueries: [
			{query: GetOrganisatieDocument, variables: {id: afdeling?.organisatie?.id}},
			{query: GetAfdelingDocument, variables: {id: afdeling.id}},
		],
	});

	const onSavePostadres = (afdelingId: number, postadres) => {
		createAfdelingPostadres({
			variables: {
				afdelingId: afdelingId,
				...postadres,
			},
		}).then(() => {
			toast({
				success: t("messages.postadressen.createSuccess"),
			});
			onClose();
		}).catch(handleSaveAfdelingPostadres);
	};

	return (
		<Modal
			title={t("modals.addPostadres.modalTitle")}
			isOpen={true}
			onClose={() => onClose()}
			showCancelButton={false}
		>
			<PostadresForm onChange={(data) => onSavePostadres(afdeling.id!, data)} onCancel={() => onClose()} />
		</Modal>
	);
};

export default AddAfdelingPostadresModal;