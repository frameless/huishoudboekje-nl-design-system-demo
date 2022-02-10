import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import SaveBurgerErrorHandler from "../../errorHandlers/SaveBurgerErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {CreateBurgerInput, GetBurgersDocument, GetBurgersSearchDocument, GetHuishoudensDocument, useCreateBurgerMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import Page from "../shared/Page";
import BackButton from "../shared/BackButton";
import BurgerForm from "./BurgerForm";
import {BurgerSearchContext} from "./BurgerSearchContext";

const CreateBurger = () => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const toast = useToaster();
	const handleSaveBurgerErrors = useMutationErrorHandler(SaveBurgerErrorHandler);
	const {search} = useContext(BurgerSearchContext);
	const [createBurger, $createBurger] = useCreateBurgerMutation({
		refetchQueries: [
			{query: GetHuishoudensDocument},
			{query: GetBurgersDocument},
			{query: GetBurgersSearchDocument, variables: {search}},
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