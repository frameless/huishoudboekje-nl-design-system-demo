import React from "react";
import {useTranslation} from "react-i18next";
import SaveBurgerRekeningErrorHandler from "../../errorHandlers/SaveBurgerRekeningErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {Burger, GetBurgerDetailsDocument, useCreateBurgerRekeningMutation} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import Modal from "../shared/Modal";
import RekeningForm from "./RekeningForm";

type AddBurgerRekeningModalProps = {
	burger: Burger,
	onClose: VoidFunction,
};

const AddBurgerRekeningModal: React.FC<AddBurgerRekeningModalProps> = ({burger, onClose}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const handleSaveBurgerRekening = useMutationErrorHandler(SaveBurgerRekeningErrorHandler);
	const [createBurgerRekening] = useCreateBurgerRekeningMutation({
		refetchQueries: [
			{query: GetBurgerDetailsDocument, variables: {id: burger.id}},
		],
	});

	const onSaveRekening = (rekening) => {
		createBurgerRekening({
			variables: {
				burgerId: burger.id!,
				rekening,
			},
		}).then(() => {
			toast({
				success: t("messages.rekeningen.createSuccess", {rekening}),
			});
			onClose();
		}).catch(handleSaveBurgerRekening);
	};

	return (
		<Modal title={t("modals.addRekening.title")} onClose={() => onClose()}>
			<RekeningForm rekening={{rekeninghouder: formatBurgerName(burger)}} onSubmit={onSaveRekening} onCancel={() => onClose()} />
		</Modal>
	);
};

export default AddBurgerRekeningModal;
