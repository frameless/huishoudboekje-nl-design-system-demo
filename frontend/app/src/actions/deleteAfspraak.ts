import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../config/routes";
import {Afspraak, useDeleteAfspraakMutation} from "../generated/graphql";
import useToaster from "../utils/useToaster";

const useDeleteAfspraakAction = (afspraak: Afspraak) => {
	const toast = useToaster();
	const {t} = useTranslation();
	const {push} = useHistory();

	const [deleteAfspraak] = useDeleteAfspraakMutation();
	const onDeleteAfspraak = () => {
		deleteAfspraak({
			variables: {
				id: afspraak.id!,
			},
		}).then(() => {
			toast({
				success: t("messages.agreements.deleteConfirmMessage"),
			});
			push(Routes.Burger(afspraak.burger?.id));
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	return onDeleteAfspraak;
};

export default useDeleteAfspraakAction;