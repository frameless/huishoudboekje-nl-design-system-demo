import React from "react";
import {useTranslation} from "react-i18next";
import SaveAfdelingErrorHandler from "../../errorHandlers/SaveAfdelingErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {CreateAfdelingMutationVariables, GetOrganisatieDocument, GetOrganisatiesDocument, Organisatie, useCreateAfdelingMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import Modal from "../shared/Modal";
import AfdelingForm from "./AfdelingForm";

type CreateAfdelingModalProps = {
	organisatie: Organisatie,
	onClose: VoidFunction
};

const CreateAfdelingModal: React.FC<CreateAfdelingModalProps> = ({organisatie, onClose}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const handleSaveAfdelingErrors = useMutationErrorHandler(SaveAfdelingErrorHandler);

	const [createAfdeling] = useCreateAfdelingMutation({
		refetchQueries: [
			{query: GetOrganisatiesDocument},
			{query: GetOrganisatieDocument, variables: {id: organisatie.id!}},
		],
	});

	const onSubmit = (afdelingData: CreateAfdelingMutationVariables) => {
		createAfdeling({
			variables: afdelingData,
		}).then(() => {
			toast({
				success: t("messages.afdelingen.createSuccessMessage"),
			});
			onClose();
		}).catch(handleSaveAfdelingErrors);
	};

	return (
		<Modal title={t("modals.addAfdeling.title")} onClose={onClose}>
			<AfdelingForm onChange={onSubmit} organisatie={organisatie} onCancel={onClose} />
		</Modal>
	);
};

export default CreateAfdelingModal;
