import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {useCreateAfspraakMutation, useGetCreateAfspraakFormDataQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import BackButton from "../../shared/BackButton";
import Page from "../../shared/Page";
import PageNotFound from "../../shared/PageNotFound";
import AfspraakForm from "../AfspraakForm";
import AfspraakFormContext, {AfspraakFormContextType} from "../EditAfspraak/context";
import BurgerContextContainer from "../../Burgers/BurgerContextContainer";

const CreateAfspraak = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();
	const navigate = useNavigate();
	const toast = useToaster();

	const [createAfspraakMutation] = useCreateAfspraakMutation();
	const $createAfspraakFormData = useGetCreateAfspraakFormDataQuery({
		variables: {
			burgerId: parseInt(id!),
		},
	});

	const onSubmit = (values) => {
		createAfspraakMutation({
			variables: {
				input: {
					burgerId: parseInt(id!),
					...values,
					bedrag: String(values.bedrag),
				},
			},
		}).then(result => {
			toast({
				success: t("messages.createAfspraakSuccess"),
			});

			if (result.data?.createAfspraak?.afspraak?.id) {
				navigate(AppRoutes.ViewAfspraak(String(result.data?.createAfspraak.afspraak.id)));
			}
		}).catch(error => {
			toast({
				error: error.message,
			});
		});
	};

	return (
		<Queryable query={$createAfspraakFormData} children={data => {
			const {organisaties = [], rubrieken = [], burger} = data;
			const ctxValue: AfspraakFormContextType = {organisaties, rubrieken};

			if (!burger) {
				return <PageNotFound />;
			}

			return (
				<Page title={t("forms.afspraken.titleCreate")} backButton={<BackButton to={AppRoutes.ViewBurger(id)} />}>
					<AfspraakFormContext.Provider value={ctxValue}>
						<BurgerContextContainer burger={burger}/>
						<AfspraakForm burgerRekeningen={burger?.rekeningen || []} onSubmit={(data) => onSubmit(data)} />
					</AfspraakFormContext.Provider>
				</Page>
			);
		}} />
	);
};

export default CreateAfspraak;
