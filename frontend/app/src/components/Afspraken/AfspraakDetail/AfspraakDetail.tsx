import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import useHandleMutation from "../../../utils/useHandleMutation";
import Routes from "../../../config/routes";
import {Afspraak, useDeleteAfspraakMutation, useGetOneAfspraakQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useFakeMutation from "../../../utils/useFakeMutation";
import useToaster from "../../../utils/useToaster";
import zod, {containsZodErrorCode, zoektermValidator} from "../../../utils/zod";
import PageNotFound from "../../PageNotFound";
import AfspraakDetailView from "./AfspraakDetailView";
import AfspraakDetailContext from "./context";

const AfspraakDetail = () => {
	const {id} = useParams<{id: string}>();
	const {t} = useTranslation();
	const {push} = useHistory();
	const handleMutation = useHandleMutation();
	const [deleteAfspraak] = useDeleteAfspraakMutation();
	const toast = useToaster();

	// Todo: implement this once there is a mutation for deleting individual zoektermen from Afspraken. (19-03-2021)
	// const [deleteAfspraakZoekterm] = useDeleteAfspraakZoektermMutation();
	// const [addAfspraakZoekterm] = useAddAfspraakZoektermMutation();
	const addAfspraakZoekterm = useFakeMutation();
	const deleteAfspraakZoekterm = useFakeMutation();

	const $afspraak = useGetOneAfspraakQuery({
		variables: {
			id: parseInt(id),
		},
	});

	return (
		<Queryable query={$afspraak} children={(data) => {
			const afspraak: Afspraak = data.afspraak;
			const {id} = afspraak;

			if (!afspraak || !id) {
				return <PageNotFound />;
			}

			const ctxValue = {
				deleteAfspraak: () => handleMutation(deleteAfspraak({
					variables: {id},
				}), t("messages.agreements.deleteConfirmMessage"), () => push(Routes.Burger(id))),
				deleteAfspraakZoekterm: (zoekterm: string) => handleMutation(deleteAfspraakZoekterm({
					variables: {id, zoekterm},
				}), t("messages.deleteAfspraakZoektermSuccess"), () => $afspraak.refetch()),
				addAfspraakZoekterm: (zoekterm: string, callback) => {
					try {
						const validatedZoekterm = zoektermValidator.parse(zoekterm);
						handleMutation(addAfspraakZoekterm({
							variables: {id, zoekterm: validatedZoekterm},
						}), t("messages.addAfspraakZoektermSuccess"), () => {
							$afspraak.refetch();
						});
						callback();
					}
					catch (err) {
						let error = err.message;

						if (err instanceof zod.ZodError) {
							if (containsZodErrorCode(err, [zod.ZodErrorCode.too_small, zod.ZodErrorCode.invalid_type])) {
								error = "Zoekterm moet minimaal één teken lang zijn.";
							}
						}

						toast({error});
					}
				},
			};

			return (
				<AfspraakDetailContext.Provider value={ctxValue}>
					<AfspraakDetailView afspraak={afspraak} />
				</AfspraakDetailContext.Provider>
			);
		}} />
	);
};

export default AfspraakDetail;