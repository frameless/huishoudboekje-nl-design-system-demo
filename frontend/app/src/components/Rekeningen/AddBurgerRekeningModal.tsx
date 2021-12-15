import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UseDisclosureReturn} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import SaveBurgerRekeningErrorHandler from "../../errorHandlers/SaveBurgerRekeningErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {Burger, GetBurgerDocument, useCreateBurgerRekeningMutation} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import RekeningForm from "./RekeningForm";

type AddBurgerRekeningModalProps = {
	burger: Burger,
	disclosure: UseDisclosureReturn,
};

const AddBurgerRekeningModal: React.FC<AddBurgerRekeningModalProps> = ({burger, disclosure}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const handleSaveBurgerRekening = useMutationErrorHandler(SaveBurgerRekeningErrorHandler);
	const [createBurgerRekening] = useCreateBurgerRekeningMutation({
		refetchQueries: [
			{query: GetBurgerDocument, variables: {id: burger.id}},
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
				success: t("messages.rekeningen.createSuccess", {...rekening}),
			});
			disclosure.onClose();
		}).catch(handleSaveBurgerRekening);
	};

	return (
		<Modal isOpen={disclosure.isOpen} onClose={() => disclosure.onClose()}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("modals.addRekening.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<RekeningForm rekening={{rekeninghouder: formatBurgerName(burger)}} onSubmit={onSaveRekening} onCancel={() => disclosure.onClose()} />
				</ModalBody>
				<ModalFooter />
			</ModalContent>
		</Modal>
	);
};

export default AddBurgerRekeningModal;