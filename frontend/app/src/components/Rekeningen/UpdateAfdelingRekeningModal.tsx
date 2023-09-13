import React from "react";
import {useTranslation} from "react-i18next";
import {Afdeling, Burger, GetAfdelingDocument, GetBurgerDetailsDocument, GetRekeningDocument, Rekening, useUpdateRekeningMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import Modal from "../shared/Modal";
import RekeningForm from "./RekeningForm";

type UpdateAfdelingRekeningModalProps = {
	rekening: Rekening,
	onClose: VoidFunction,
	afdeling?: Afdeling,
	burger?: Burger
};

const UpdateAfdelingRekeningModal: React.FC<UpdateAfdelingRekeningModalProps> = ({rekening, onClose, afdeling, burger}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const refetchQueries = [
		{query: GetRekeningDocument, variables: {id: rekening.id}}
	]

	if(afdeling && afdeling.id){
		refetchQueries.push({query: GetAfdelingDocument, variables: {id: afdeling.id}})
	}
	if(burger && burger.id){
		refetchQueries.push({query: GetBurgerDetailsDocument, variables: {id: burger?.id}})
	}

	const [updateAfdelingRekening] = useUpdateRekeningMutation({
		refetchQueries: refetchQueries,
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
	};

	return (
		<Modal title={t("modal.updateAfdelingRekening.title")} onClose={onClose}>
			<RekeningForm onSubmit={onSubmit} onCancel={onClose} rekening={rekening} />
		</Modal>
	);
};

export default UpdateAfdelingRekeningModal;