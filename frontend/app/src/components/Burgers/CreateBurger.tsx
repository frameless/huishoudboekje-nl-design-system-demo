import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {CreateBurgerMutationVariables, GetBurgersDocument, GetBurgersSearchDocument, GetHuishoudensDocument, useCreateBurgerMutation} from "../../generated/graphql";
import useStore from "../../store";
import useToaster from "../../utils/useToaster";
import BackButton from "../shared/BackButton";
import Page from "../shared/Page";
import BurgerForm from "./BurgerForm";

const CreateBurger = () => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const toast = useToaster();
	const [isBsnValid, setBsnValid] = useState(true);
	const handleSaveBurgerErrors = (t) => (err) => {
		setBsnValid(true);

		let message = err.message;
		if (err.message.includes("already exists")) {
			message = t("messages.burgers.alreadyExists");
		}
		if (err.message.includes("BSN should consist of 8 or 9 digits")) {
			message = t("messages.burgers.bsnLengthError");
			setBsnValid(false);
		}
		if (err.message.includes("BSN does not meet the 11-proef requirement")) {
			message = t("messages.burgers.bsnElfProefError");
			setBsnValid(false);
		}

		toast({
			error: message,
		});
	};
	const burgerSearch = useStore(store => store.burgerSearch);
	const [createBurger, $createBurger] = useCreateBurgerMutation({
		refetchQueries: [
			{query: GetHuishoudensDocument},
			{query: GetBurgersDocument},
			{query: GetBurgersSearchDocument, variables: {search: burgerSearch}},
		],
	});

	const onSubmit = (burgerData: CreateBurgerMutationVariables["input"]) => {
		createBurger({
			variables: {
				input: {
					...burgerData
				},
			},
		}).then(result => {
			toast({
				success: t("messages.burgers.createSuccessMessage"),
			});

			const {id} = result?.data?.createBurger?.burger || {};
			if (id) {
				navigate(AppRoutes.ViewBurger(String(id)));
			}
		}).catch(handleSaveBurgerErrors(t));
	};

	return (
		<Page title={t("forms.createBurger.title")} backButton={<BackButton to={AppRoutes.Burgers()} />}>
			<BurgerForm isLoading={$createBurger.loading} onSubmit={onSubmit} isBsnValid={isBsnValid} />
		</Page>
	);
};

export default CreateBurger;
