import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {CreateBurgerInput, GetBurgersDocument, GetHuishoudensDocument, useCreateBurgerMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import BackButton from "../Layouts/BackButton";
import Page from "../Layouts/Page";
import BurgerForm from "./BurgerForm";
import SaveBurgerErrorHandler from "../../errorHandlers/SaveBurgerErrorHandler";

const CreateBurger = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
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
				push(Routes.Burger(id));
			}
		}).catch(handleSaveBurgerErrors);
	};

	return (
		<Page title={t("forms.createBurger.title")} backButton={<BackButton to={Routes.Burgers} />}>
			<BurgerForm isLoading={$createBurger.loading} onSubmit={onSubmit} />
		</Page>
	);
};

export default CreateBurger;