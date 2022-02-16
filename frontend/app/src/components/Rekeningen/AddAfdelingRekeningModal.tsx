import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UseDisclosureReturn} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Afdeling, GetAfdelingDocument, GetOrganisatieDocument, useCreateAfdelingRekeningMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import RekeningForm from "./RekeningForm";

type AddAfdelingRekeningModalProps = {
	afdeling: Afdeling,
	onClose: VoidFunction
};

const AddAfdelingRekeningModal: React.FC<AddAfdelingRekeningModalProps> = ({afdeling, onClose}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [createAfdelingRekening] = useCreateAfdelingRekeningMutation({
		refetchQueries: [
			{query: GetOrganisatieDocument, variables: {id: afdeling?.organisatie?.id}},
			{query: GetAfdelingDocument, variables: {id: afdeling?.id}},
		],
	});
	const [isIbanValid, setIbanValid] = useState(true);

	const onSaveRekening = (rekening) => {
		setIbanValid(true);
		createAfdelingRekening({
			variables: {
				afdelingId: afdeling.id!,
				rekening,
			},
		}).then(() => {
			toast({
				success: t("messages.rekeningen.createSuccess", {...rekening}),
			});
			onClose();
		}).catch((err) => {
			let errorMessage = err.message;

			if (err.message.includes("already exists")) {
				errorMessage = t("messages.rekeningen.alreadyExistsError");
			}
			if (err.message.includes("Foutieve IBAN")) {
				errorMessage = t("messages.rekeningen.invalidIbanError");
				setIbanValid(false);
			}

			toast({
				error: errorMessage,
			});
		});
	};

	return (
		<Modal isOpen={true} onClose={() => onClose()}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("modals.addRekening.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<RekeningForm rekening={{rekeninghouder: afdeling.naam}} onSubmit={onSaveRekening} onCancel={() => onClose()} />
				</ModalBody>
				<ModalFooter />
			</ModalContent>
		</Modal>
	);
};

export default AddAfdelingRekeningModal;