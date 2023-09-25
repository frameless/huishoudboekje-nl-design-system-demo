import React from "react";
import {useTranslation} from "react-i18next";
import SaveBurgerRekeningErrorHandler from "../../errorHandlers/SaveBurgerRekeningErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {Burger, GetBurgerDetailsDocument, useCreateBurgerRekeningMutation} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import Modal from "../shared/Modal";
import RekeningForm from "./RekeningForm";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../config/routes";

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
	const navigate = useNavigate();
	const burger_id = burger.id ? burger.id : 0;

	const onSaveRekening = (rekening) => {
		createBurgerRekening({
			variables: {
				burgerId: burger.id!,
				rekening,
			},
		}).then(() => {
			toast({
				success: t("messages.rekeningen.createSuccess", {iban: rekening.iban, rekeninghouder: rekening.rekeninghouder}),
			});
			onClose();
			navigate(AppRoutes.ViewBurgerPersonalDetails(burger_id.toString()), {replace: true});
		}).catch(handleSaveBurgerRekening);
	};

	return (
		<Modal title={t("modals.addRekening.title")} onClose={() => onClose()}>
			<RekeningForm rekening={{rekeninghouder: formatBurgerName(burger)}} onSubmit={onSaveRekening} onCancel={() => onClose()} />
		</Modal>
	);
};

export default AddBurgerRekeningModal;
