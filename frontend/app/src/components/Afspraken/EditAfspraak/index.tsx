import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import Routes from "../../../config/routes";
import {Afspraak, useGetAfspraakFormDataQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useFakeMutation from "../../../utils/useFakeMutation";
import useHandleMutation from "../../../utils/useHandleMutation";
import PageNotFound from "../../PageNotFound";
import AfspraakFormContext from "../AfspraakForm/context";
import EditAfspraakForm from "./EditAfspraakForm";

export type AfspraakBetalingValues = {
	rubriek?: number,
	omschrijving?: string,
	tegenrekening?: number,
	bedrag?: number,
	credit?: boolean,
}

const EditAfspraak = () => {
	const {id} = useParams<{id: string}>();
	const {t} = useTranslation();
	const {push} = useHistory();
	const handleMutation = useHandleMutation();
	const $afspraakFormData = useGetAfspraakFormDataQuery({
		variables: {
			afspraakId: parseInt(id),
		},
	});

	// Todo: implement this once there's a mutation for this action.
	// const [updateAfspraakBetalingMutation] = useUpdateAfspraakMutation();
	const updateAfspraakBetalingMutation = useFakeMutation();

	return (
		<Queryable query={$afspraakFormData} children={(data) => {
			const {organisaties = [], rubrieken = []} = data;
			const afspraak: Afspraak = data.afspraak;

			if (!afspraak) {
				return <PageNotFound />;
			}

			const ctxValue = {afspraak, organisaties, rubrieken};
			const {bedrag, rubriek, tegenRekening, beschrijving, credit} = afspraak;
			const values = {
				bedrag: parseFloat(bedrag),
				credit,
				rubriek: rubriek?.id,
				omschrijving: beschrijving,
				tegenrekening: tegenRekening?.id,
			};

			const updateAfspraakBetaling = (data: AfspraakBetalingValues) => handleMutation(updateAfspraakBetalingMutation({
				variables: {
					id: afspraak.id!,
					...data,
				},
			}), t("messages.updateAfspraakSuccess"), () => push(Routes.ViewAfspraak(afspraak.id)));

			return (
				<AfspraakFormContext.Provider value={ctxValue}>
					<EditAfspraakForm afspraak={afspraak} values={values} onChange={updateAfspraakBetaling} />
				</AfspraakFormContext.Provider>
			);
		}} />
	);
};

export default EditAfspraak;