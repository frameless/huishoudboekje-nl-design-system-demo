import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {CreateAfspraakMutationVariables, useCreateAfspraakMutation, useGetCreateAfspraakFormDataQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import Page from "../../shared/Page";
import PageNotFound from "../../shared/PageNotFound";
import BackButton from "../../shared/BackButton";
import AfspraakForm from "../AfspraakForm";
import AfspraakFormContext, {AfspraakFormContextType} from "../EditAfspraak/context";

const CreateAfspraak = () => {
	const {id} = useParams();
	const {t} = useTranslation();
	const navigate = useNavigate();
	const handleMutation = useHandleMutation();

	const [createAfspraakMutation] = useCreateAfspraakMutation();
	const $createAfspraakFormData = useGetCreateAfspraakFormDataQuery({
		variables: {burgerId: parseInt(id!)},
	});

	const createAfspraak = (input: Omit<CreateAfspraakMutationVariables["input"], "burgerId">) => handleMutation(
		createAfspraakMutation({
			variables: {
				input: {
					burgerId: parseInt(id!),
					...input,
				},
			},
		}),
		t("messages.createAfspraakSuccess"),
		(data) => {
			if (data.data?.createAfspraak?.afspraak?.id) {
				navigate(AppRoutes.ViewAfspraak(data.data.createAfspraak.afspraak.id));
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
				<Page title={t("forms.afspraken.titleCreate")} backButton={<BackButton to={AppRoutes.Burger(parseInt(id!))} />}>
					<AfspraakFormContext.Provider value={ctxValue}>
						<AfspraakForm burgerRekeningen={burger?.rekeningen || []} onChange={(data) => createAfspraak(data as CreateAfspraakMutationVariables["input"])} />
					</AfspraakFormContext.Provider>
				</Page>
			);
		}} />
	);
};

export default CreateAfspraak;