import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import Routes from "../../../config/routes";
import {Afspraak, Betaalinstructie, UpdateAfspraakMutationVariables, useGetOneAfspraakQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useFakeMutation from "../../../utils/useFakeMutation";
import useHandleMutation from "../../../utils/useHandleMutation";
import BackButton from "../../BackButton";
import Page from "../../Layouts/Page";
import PageNotFound from "../../PageNotFound";
import AfspraakBetaalinstructieForm from "./EditAfspraakBetaalinstructieForm";

const BetaalinstructiePage = () => {
	const {id} = useParams<{id: string}>();
	const {t} = useTranslation();
	const {push} = useHistory();
	const handleMutation = useHandleMutation();

	const $afspraak = useGetOneAfspraakQuery({variables: {id: parseInt(id)}});
	const updateAfspraakBetaalinstructieMutation = useFakeMutation();

	const updateAfspraakBetaalinstructie = (data: UpdateAfspraakMutationVariables["input"]) => handleMutation(updateAfspraakBetaalinstructieMutation({
		variables: {
			id: parseInt(id),
			...data,
		},
	}), t("messages.updateAfspraakSuccess"), () => push(Routes.ViewAfspraak(parseInt(id))));

	return (
		<Page title={t("afspraakDetailView.title")} backButton={<BackButton to={Routes.ViewAfspraak(parseInt(id))} />}>
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