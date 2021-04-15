import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import Routes from "../../../config/routes";
import {Afspraak, useAddAfspraakZoektermMutation, useDeleteAfspraakMutation, useDeleteAfspraakZoektermMutation, useGetAfspraakQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import useToaster from "../../../utils/useToaster";
import zod, {containsZodErrorCode, zoektermValidator} from "../../../utils/zod";
import AfspraakDetailView from "./AfspraakDetailView";
import AfspraakDetailContext from "./context";

const ViewAfspraak = () => {
	const {id} = useParams<{id: string}>();
	const {t} = useTranslation();
	const {push} = useHistory();
	const toast = useToaster();
	const handleMutation = useHandleMutation();

	const [deleteAfspraak] = useDeleteAfspraakMutation();
	const [addAfspraakZoekterm] = useAddAfspraakZoektermMutation();
	const [deleteAfspraakZoekterm] = useDeleteAfspraakZoektermMutation();
	const $afspraak = useGetAfspraakQuery({
		fetchPolicy: "no-cache",
		variables: {
			id: parseInt(id),
		},
	});

	return (
		<Queryable query={$afspraak} children={(data) => {
			const afspraak: Afspraak = data.afspraak;
			const ctxValue = {
				deleteAfspraak: () => handleMutation(deleteAfspraak({
					variables: {id: parseInt(id)},
				}), t("messages.deleteAfspraakSuccess"), () => push(Routes.Burger(afspraak.burger?.id))),
				addAfspraakZoekterm: (zoekterm: string, callback) => {
					try {
						const validatedZoekterm = zoektermValidator.parse(zoekterm);
						handleMutation(addAfspraakZoekterm({
							variables: {afspraakId: parseInt(id), zoekterm: validatedZoekterm},
						}), t("messages.addAfspraakZoektermSuccess"), () => $afspraak.refetch());
						callback();
					}
					catch (err) {
						let error = err.message;

						if (err instanceof zod.ZodError) {
							if (containsZodErrorCode(err, [zod.ZodErrorCode.too_small, zod.ZodErrorCode.invalid_type])) {
								error = t("messages.zoektermLengthError");
							}
						}

						toast({error});
					}
				},
				deleteAfspraakZoekterm: (zoekterm: string) => handleMutation(deleteAfspraakZoekterm({
					variables: {afspraakId: parseInt(id), zoekterm},
				}), t("messages.deleteAfspraakZoektermSuccess"), () => $afspraak.refetch()),
				refetch: $afspraak.refetch,
			};

			return (
				<AfspraakDetailContext.Provider value={ctxValue}>
					<AfspraakDetailView afspraak={afspraak} />
				</AfspraakDetailContext.Provider>
			);
		}} />
	);
};

export default ViewAfspraak;