import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UseDisclosureReturn} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import SaveAfdelingRekeningErrorHandler from "../../errorHandlers/SaveAfdelingRekeningErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {Afdeling, GetAfdelingDocument, GetOrganisatieDocument, useCreateAfdelingRekeningMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import RekeningForm from "./RekeningForm";

type AddAfdelingRekeningModalProps = {
	afdeling: Afdeling,
	disclosure: UseDisclosureReturn,
};

const AddAfdelingRekeningModal: React.FC<AddAfdelingRekeningModalProps> = ({afdeling, disclosure}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const handleSaveAfdelingRekening = useMutationErrorHandler(SaveAfdelingRekeningErrorHandler);
	const [createAfdelingRekening] = useCreateAfdelingRekeningMutation({
		refetchQueries: [
			{query: GetOrganisatieDocument, variables: {id: afdeling?.organisatie?.id}},
			{query: GetAfdelingDocument, variables: {id: afdeling?.id}},
		],
	});

	const onSaveRekening = (rekening) => {
		createAfdelingRekening({
			variables: {
				afdelingId: afdeling.id!,
				rekening,
			},
		}).then(() => {
			toast({
				success: t("messages.rekeningen.createSuccess", {...rekening}),
			});
			disclosure.onClose();
		}).catch(handleSaveAfdelingRekening);
	};

	return (
		<Modal isOpen={disclosure.isOpen} onClose={() => disclosure.onClose()}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("modals.addRekening.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<RekeningForm rekening={{rekeninghouder: afdeling.naam}} onSubmit={onSaveRekening} onCancel={() => disclosure.onClose()} />
				</ModalBody>
				<ModalFooter />
			</ModalContent>
		</Modal>
	);
};

export default AddAfdelingRekeningModal;