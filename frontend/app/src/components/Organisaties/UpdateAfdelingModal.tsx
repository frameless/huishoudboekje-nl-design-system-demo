import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UseDisclosureReturn} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Afdeling, GetOrganisatieDocument, useUpdateAfdelingMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
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
		<Modal isOpen={true} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("modal.updateAfdeling.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<AfdelingForm onChange={onSubmit} organisatie={afdeling.organisatie!} values={{
						naam: afdeling.naam,
					}} />
				</ModalBody>
				<ModalFooter />
			</ModalContent>
		</Modal>
	);
};

export default UpdateAfdelingModal;