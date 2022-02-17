import {Button, UseDisclosureReturn} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Afdeling, GetOrganisatieDocument, GetOrganisatiesDocument, useDeleteAfdelingMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import Alert from "../shared/Alert";

const DeleteAfdelingAlert: React.FC<{ afdeling: Afdeling, disclosure: UseDisclosureReturn }> = ({afdeling, disclosure}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const navigate = useNavigate();

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
			disclosure.onClose();

			if (afdeling.organisatie?.id) {
				navigate(AppRoutes.Organisatie(afdeling.organisatie?.id));
			}
			else {
				navigate(AppRoutes.Organisaties);
			}
		}).catch(err => {
			toast({
				error: err.message,
			});
		});
	};

	return disclosure.isOpen ? (
		<Alert
			title={t("deleteAfspraakModal.title")}
			cancelButton={true}
			confirmButton={
				<Button colorScheme={"red"} ml={3} onClick={onClickSubmit}>
					{t("global.actions.delete")}
				</Button>
			}
			onClose={disclosure.onClose}
		>
			{t("deleteAfspraakModal.confirmModalBody", {afdeling: afdeling.naam})}
		</Alert>
	) : null
};

export default DeleteAfdelingAlert;