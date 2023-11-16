import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Afspraak, GetAfspraakDocument, GetBurgerDetailsDocument, UpdateAfspraakBetaalinstructieMutationVariables, useGetAfspraakQuery, useUpdateAfspraakBetaalinstructieMutation} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import BackButton from "../../shared/BackButton";
import Page from "../../shared/Page";
import PageNotFound from "../../shared/PageNotFound";
import AfspraakBetaalinstructieForm from "./AfspraakBetaalinstructieForm";

const BetaalinstructiePage = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();
	const navigate = useNavigate();
	const handleMutation = useHandleMutation();

	const $afspraak = useGetAfspraakQuery({variables: {id: parseInt(id)}});

	const refetchQueries = [
		{query: GetAfspraakDocument, variables: {id: parseInt(id)}}
	]

	if($afspraak.data?.afspraak?.burger?.id){
		refetchQueries.push({query: GetBurgerDetailsDocument, variables: {id: $afspraak.data?.afspraak?.burger?.id}})
	}

	const [updateAfspraakBetaalinstructieMutation] = useUpdateAfspraakBetaalinstructieMutation({
		refetchQueries: refetchQueries,
	});
	const updateAfspraakBetaalinstructie = (data: UpdateAfspraakBetaalinstructieMutationVariables["betaalinstructie"]) => handleMutation(updateAfspraakBetaalinstructieMutation({
		variables: {
			id: parseInt(id),
			betaalinstructie: data,
		},
	}), t("messages.updateBetaalinstructieSuccess"), () => navigate(AppRoutes.ViewAfspraak(id)));

	return (
		<Page title={t("afspraakBetaalinstructie.title")} backButton={<BackButton to={AppRoutes.ViewAfspraak(id)} />}>
			<Queryable query={$afspraak} children={data => {
				const afspraak: Afspraak = data.afspraak;

				if (!afspraak) {
					return <PageNotFound />;
				}

				return (
					<AfspraakBetaalinstructieForm afspraak={afspraak} onChange={updateAfspraakBetaalinstructie} />
				);
			}} />
		</Page>
	);
};

export default BetaalinstructiePage;
