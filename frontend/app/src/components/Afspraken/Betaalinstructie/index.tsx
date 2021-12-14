import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {
	Afspraak,
	GetAfspraakDocument,
	GetAfsprakenDocument,
	UpdateAfspraakBetaalinstructieMutationVariables,
	useGetAfspraakQuery,
	useUpdateAfspraakBetaalinstructieMutation,
} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import BackButton from "../../Layouts/BackButton";
import Page from "../../Layouts/Page";
import PageNotFound from "../../PageNotFound";
import AfspraakBetaalinstructieForm from "./AfspraakBetaalinstructieForm";

const BetaalinstructiePage = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();
	const navigate = useNavigate();
	const handleMutation = useHandleMutation();

	const $afspraak = useGetAfspraakQuery({variables: {id: parseInt(id)}});
	const [updateAfspraakBetaalinstructieMutation] = useUpdateAfspraakBetaalinstructieMutation({
		refetchQueries: [
			{query: GetAfsprakenDocument},
			{query: GetAfspraakDocument, variables: {id: parseInt(id)}},
		],
	});
	const updateAfspraakBetaalinstructie = (data: UpdateAfspraakBetaalinstructieMutationVariables["betaalinstructie"]) => handleMutation(updateAfspraakBetaalinstructieMutation({
		variables: {
			id: parseInt(id),
			betaalinstructie: data,
		},
	}), t("messages.updateAfspraakSuccess"), () => navigate(AppRoutes.ViewAfspraak(parseInt(id))));

	return (
		<Page title={t("afspraakBetaalinstructie.title")} backButton={<BackButton to={AppRoutes.ViewAfspraak(parseInt(id))} />}>
			<Queryable query={$afspraak} children={data => {
				const afspraak: Afspraak = data.afspraak;

				if (!afspraak) {
					return <PageNotFound />;
				}

				return (
					<AfspraakBetaalinstructieForm afspraak={afspraak} values={afspraak.betaalinstructie} onChange={updateAfspraakBetaalinstructie} />
				);
			}} />
		</Page>
	);
};

export default BetaalinstructiePage;