import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {CreateBurgerInput, GetBurgersDocument, GetHuishoudensDocument, useCreateBurgerMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import BackButton from "../Layouts/BackButton";
import Page from "../Layouts/Page";
import BurgerForm from "./BurgerForm";

const CreateBurger = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const toast = useToaster();
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
		}).catch(err => {
			console.error(err);

			let message = err.message;
			if (err.message.includes("already exists")) {
				message = t("messages.burger.alreadyExists");
			}
			if (err.message.includes("BSN should consist of 8 or 9 digits")) {
				message = t("messages.burger.bsnLengthError");
			}
			if (err.message.includes("BSN does not meet the 11-proef requirement")) {
				message = t("messages.burger.bsnElfProefError");
			}

			toast({
				error: message,
			});
		});
	};

	return (
		<Page title={t("forms.createBurger.title")} backButton={<BackButton to={Routes.Burgers} />}>
			<BurgerForm isLoading={$createBurger.loading} onSubmit={onSubmit} />
		</Page>
	);
};

export default CreateBurger;