import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import SaveBurgerErrorHandler from "../../errorHandlers/SaveBurgerErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {CreateBurgerInput, GetBurgersDocument, GetHuishoudensDocument, useCreateBurgerMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import BackButton from "../Layouts/BackButton";
import Page from "../Layouts/Page";
import BurgerForm from "./BurgerForm";

const CreateBurger = () => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const toast = useToaster();
	const handleSaveBurgerErrors = useMutationErrorHandler(SaveBurgerErrorHandler);
	const [createBurger, $createBurger] = useCreateBurgerMutation({
		refetchQueries: [
			{query: GetHuishoudensDocument},
			{query: GetBurgersDocument},
		],
	});

	const onSubmit = (burgerData: CreateBurgerInput) => {
		createBurger({
			variables: {
				input: burgerData,
			},
		}).then(result => {
			toast({
				success: t("messages.burgers.createSuccessMessage"),
			});

			const {id} = result?.data?.createBurger?.burger || {};
			if (id) {
				navigate(AppRoutes.Burger(id));
			}
		}).catch(handleSaveBurgerErrors);
	};

	return (
		<Page title={t("forms.createBurger.title")} backButton={<BackButton to={AppRoutes.Burgers()} />}>
			<BurgerForm isLoading={$createBurger.loading} onSubmit={onSubmit} />
		</Page>
	);
};

export default CreateBurger;