import {Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, UseDisclosureReturn} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Afdeling, GetOrganisatieDocument, GetOrganisatiesDocument, useDeleteAfdelingMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";

const DeleteAfdelingModal: React.FC<{afdeling: Afdeling, disclosure: UseDisclosureReturn}> = ({afdeling, disclosure}) => {
	const {isOpen, onClose} = disclosure;
	const {t} = useTranslation();
	const toast = useToaster();

	const [deleteAfdeling] = useDeleteAfdelingMutation({
		refetchQueries: [
			{query: GetOrganisatiesDocument},
			{query: GetOrganisatieDocument, variables: {id: afdeling.organisatie?.id}},
		],
	});

	const onClickSubmit = () => {
		deleteAfdeling({
			variables: {afdelingId: afdeling.id!},
		}).then(() => {
			toast({
				success: t("messages.deleteAfdelingSuccess", {name: afdeling.naam}),
			});
		}).catch(err => {
			toast({
				error: err.message,
			});
		});
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("deleteAfspraakModal.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Text>{t("deleteAfspraakModal.confirmModalBody")}</Text>
				</ModalBody>
				<ModalFooter>
					<HStack>
						<Button variant={"ghost"} onClick={onClose}>{t("global.actions.cancel")}</Button>
						<Button colorScheme={"primary"} onClick={onClickSubmit}>{t("global.actions.delete")}</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DeleteAfdelingModal;