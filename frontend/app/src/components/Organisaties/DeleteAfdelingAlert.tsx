import {Button} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Afdeling, GetOrganisatieDocument, GetOrganisatiesDocument, useDeleteAfdelingMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import Alert from "../shared/Alert";

type DeleteAfdelingAlertProps = {
	afdeling: Afdeling,
	onClose: VoidFunction
};

const DeleteAfdelingAlert: React.FC<DeleteAfdelingAlertProps> = ({afdeling, onClose}) => {
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
			onClose();

			if (afdeling.organisatie?.id) {
				navigate(AppRoutes.Organisatie(String(afdeling.organisatie.id)));
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

	return (
		<Alert
			title={t("deleteAfdelingAlert.title")}
			cancelButton={true}
			confirmButton={
				<Button data-test="modalDepartment.delete" colorScheme={"red"} ml={3} onClick={onClickSubmit}>
					{t("global.actions.delete")}
				</Button>
			}
			onClose={onClose}
		>
			{t("deleteAfdelingAlert.confirmModalBody", {afdeling: afdeling.naam})}
		</Alert>
	);
};

export default DeleteAfdelingAlert;