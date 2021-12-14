import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import SaveAfdelingErrorHandler from "../../errorHandlers/SaveAfdelingErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {CreateAfdelingMutationVariables, GetOrganisatieDocument, GetOrganisatiesDocument, Organisatie, useCreateAfdelingMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
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
		}).then(result => {
			toast({
				success: t("messages.afdelingen.createSuccessMessage"),
			});
			onClose();
		}).catch(handleSaveAfdelingErrors);
	};

	return (
		<Modal isOpen={true} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("modals.addAfdeling.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>

					<AfdelingForm onChange={onSubmit} organisatie={organisatie} />

				</ModalBody>
				<ModalFooter />
			</ModalContent>
		</Modal>
	);
};

export default CreateAfdelingModal;