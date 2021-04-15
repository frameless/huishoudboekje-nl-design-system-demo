import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../../config/routes";
import {CreateAfspraakMutationVariables, useCreateAfspraakMutation, useGetCreateAfspraakFormDataQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import BackButton from "../../Layouts/BackButton";
import Page from "../../Layouts/Page";
import PageNotFound from "../../PageNotFound";
import AfspraakForm from "../AfspraakForm";
import AfspraakFormContext, {AfspraakFormContextType} from "../EditAfspraak/context";

const CreateAfspraak: React.FC<{burgerId: number}> = ({burgerId}) => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const handleMutation = useHandleMutation();

	const [createAfspraakMutation] = useCreateAfspraakMutation();
	const $createAfspraakFormData = useGetCreateAfspraakFormDataQuery({
		variables: {burgerId},
	});

	const createAfspraak = (input: Omit<CreateAfspraakMutationVariables["input"], "burgerId">) => handleMutation(
		createAfspraakMutation({
			variables: {
				input: {
					burgerId,
					...input,
				},
			},
		}),
		t("messages.createAfspraakSuccess"),
		(data) => {
			if (data.data?.createAfspraak?.afspraak?.id) {
				push(Routes.ViewAfspraak(data.data.createAfspraak.afspraak.id));
			}
		});

	return (
		<Queryable query={$createAfspraakFormData} children={data => {
			const {organisaties = [], rubrieken = [], burger} = data;
			const ctxValue: AfspraakFormContextType = {organisaties, rubrieken};

			if (!burger) {
				return <PageNotFound />;
			}

			return (
				<Page title={t("forms.agreements.titleCreate")} backButton={<BackButton to={Routes.Burger(burgerId)} />}>
					<AfspraakFormContext.Provider value={ctxValue}>
						<AfspraakForm burgerRekeningen={burger?.rekeningen || []} onChange={(data) => createAfspraak(data as CreateAfspraakMutationVariables["input"])} />
					</AfspraakFormContext.Provider>
				</Page>
			);
		}} />
	);
};

export default CreateAfspraak;