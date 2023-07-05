import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Afspraak, GetAfspraakDocument, UpdateAfspraakMutationVariables, useGetAfspraakFormDataQuery, useUpdateAfspraakMutation} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import BackButton from "../../shared/BackButton";
import Page from "../../shared/Page";
import PageNotFound from "../../shared/PageNotFound";
import AfspraakForm from "../AfspraakForm";
import AfspraakFormContext, {AfspraakFormContextType} from "./context";
import BurgerContextContainer from "../../Burgers/BurgerContextContainer";

const EditAfspraak = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();
	const navigate = useNavigate();
	const toast = useToaster();
	const [updateAfspraakMutation, $updateAfspraakMutation] = useUpdateAfspraakMutation({
		refetchQueries: [
			{query: GetAfspraakDocument, variables: {id: parseInt(id)}},
		],
	});
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
				validFrom: afspraak.validFrom
			};

			const onSubmitForm = (data) => {
				const input = {
					...data,
					bedrag: String(data.bedrag),
				};

				updateAfspraakMutation({
					variables: {
						id: afspraak.id!,
						input,
					},
				}).then(() => {
					toast({
						success: t("messages.updateAfspraakSuccess"),
					});
					navigate(AppRoutes.ViewAfspraak(String(afspraak.id)), {replace: true});
				}).catch(err => {
					toast.closeAll();
					toast({
						error: err.message,
					});
				});
			};

			const ctxValue: AfspraakFormContextType = {
				rubrieken: data.rubrieken || [],
				organisaties: data.organisaties || [],
			};

			return (
				<Page title={t("forms.afspraken.titleEdit")} backButton={<BackButton to={AppRoutes.ViewAfspraak(String(afspraak.id))} />}>
					<AfspraakFormContext.Provider value={ctxValue}>
						<BurgerContextContainer burger={afspraak.burger}/>
						<AfspraakForm burgerRekeningen={afspraak.burger?.rekeningen || []} values={editAfspraakValues} organisatie={afspraak.afdeling?.organisatie} onSubmit={onSubmitForm} isLoading={$updateAfspraakMutation.loading} />
					</AfspraakFormContext.Provider>
				</Page>
			);
		}} />
	);
};

export default EditAfspraak;
