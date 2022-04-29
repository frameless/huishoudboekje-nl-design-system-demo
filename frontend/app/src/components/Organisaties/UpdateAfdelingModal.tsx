import React from "react";
import {useTranslation} from "react-i18next";
import {Afdeling, GetOrganisatieDocument, useUpdateAfdelingMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import Modal from "../shared/Modal";
import AfdelingForm from "./AfdelingForm";

type UpdateAfdelingModalProps = {
	afdeling: Afdeling,
	onClose: VoidFunction
};

const UpdateAfdelingModal: React.FC<UpdateAfdelingModalProps> = ({afdeling, onClose}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [updateAfdeling] = useUpdateAfdelingMutation({
		refetchQueries: [
			{query: GetOrganisatieDocument, variables: {id: afdeling?.organisatie?.id}},
		],
	});

	const onSubmit = (data) => {
		updateAfdeling({
			variables: {
				id: afdeling.id!,
				...data,
			},
		}).then(() => {
			toast({
				success: t("messages.afdelingen.updateSuccess"),
			});
			onClose();
		}).catch(err => {
			toast({
				error: err.message,
			});
		});
	};

	return (
		<Modal title={t("modal.updateAfdeling.title")} onClose={onClose}>
			<AfdelingForm onChange={onSubmit} onCancel={onClose} organisatie={afdeling.organisatie!} values={{
				naam: afdeling.naam,
			}} />
		</Modal>
	);
};

export default UpdateAfdelingModal;