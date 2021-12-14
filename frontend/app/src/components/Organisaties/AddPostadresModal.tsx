import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UseDisclosureReturn} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import SaveAfdelingPostadresErrorHandler from "../../errorHandlers/SaveAfdelingPostadresErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {Afdeling, GetAfdelingDocument, GetOrganisatieDocument, useCreateAfdelingPostadresMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import PostadresForm from "../Postadressen/PostadresForm";

const AddPostadresModal: React.FC<{afdeling: Afdeling, disclosure: UseDisclosureReturn}> = ({afdeling, disclosure}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const handleSaveAfdelingPostadres = useMutationErrorHandler(SaveAfdelingPostadresErrorHandler);
	const [createAfdelingPostadres] = useCreateAfdelingPostadresMutation({
		refetchQueries: [
			{query: GetOrganisatieDocument, variables: {id: afdeling?.organisatie?.id}},
			{query: GetAfdelingDocument, variables: {id: afdeling?.id}},
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
			disclosure.onClose();
		}).catch(handleSaveAfdelingPostadres);
	};

	return (
		<Modal isOpen={disclosure.isOpen} onClose={() => disclosure.onClose()}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("modals.addPostadres.modalTitle")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<PostadresForm onSubmit={(data) => onSavePostadres(afdeling.id!, data)} onCancel={() => disclosure.onClose()} />
				</ModalBody>
				<ModalFooter />
			</ModalContent>
		</Modal>
	);
};

export default AddPostadresModal;