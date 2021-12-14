import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Afspraak, GetAfspraakDocument, UpdateAfspraakMutationVariables, useGetAfspraakFormDataQuery, useUpdateAfspraakMutation} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import BackButton from "../../Layouts/BackButton";
import Page from "../../Layouts/Page";
import PageNotFound from "../../PageNotFound";
import AfspraakForm from "../AfspraakForm";
import AfspraakFormContext, {AfspraakFormContextType} from "./context";

const EditAfspraak = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();
	const handleMutation = useHandleMutation();
	const [updateAfspraakMutation, $updateAfspraakMutation] = useUpdateAfspraakMutation({
		refetchQueries: [
			{query: GetAfspraakDocument, variables: {id: parseInt(id)}},
		],
	});
	const navigate = useNavigate();

	const $afspraak = useGetAfspraakFormDataQuery({
		variables: {
			afspraakId: parseInt(id),
		},
	});

	return (
		<Queryable query={$afspraak} children={(data) => {
			const afspraak: Afspraak = data.afspraak;

			if (!afspraak) {
				return <PageNotFound />;
			}

			const editAfspraakValues: UpdateAfspraakMutationVariables["input"] = {
				bedrag: parseFloat(afspraak.bedrag),
				credit: afspraak.credit,
				rubriekId: afspraak.rubriek?.id,
				omschrijving: afspraak.omschrijving,
				tegenRekeningId: afspraak.tegenRekening?.id,
				afdelingId: afspraak.afdeling?.id,
				postadresId: afspraak.postadres?.id,
			};

			const updateAfspraak = (data: UpdateAfspraakMutationVariables["input"]) => handleMutation(updateAfspraakMutation({
				variables: {
					id: afspraak.id!,
					input: data,
				},
			}), t("messages.updateAfspraakSuccess"), () => navigate(AppRoutes.ViewAfspraak(afspraak.id)));

			const ctxValue: AfspraakFormContextType = {
				rubrieken: data.rubrieken || [],
				organisaties: data.organisaties || [],
			};

			return (
				<Page title={t("forms.afspraken.titleEdit")} backButton={<BackButton to={AppRoutes.ViewAfspraak(afspraak.id)} />}>
					<AfspraakFormContext.Provider value={ctxValue}>
						<AfspraakForm burgerRekeningen={afspraak.burger?.rekeningen || []} values={editAfspraakValues} onChange={updateAfspraak} isLoading={$updateAfspraakMutation.loading} />
					</AfspraakFormContext.Provider>
				</Page>
			);
		}} />
	);
};

export default EditAfspraak;