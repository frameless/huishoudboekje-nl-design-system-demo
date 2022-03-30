import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {GetBurgerDocument, GetBurgersDocument, GetBurgersSearchDocument, UpdateBurgerMutationVariables, useGetBurgerQuery, useUpdateBurgerMutation} from "../../generated/graphql";
import {useStore} from "../../store";
import Queryable from "../../utils/Queryable";
import {formatBurgerName} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import BackButton from "../shared/BackButton";
import Page from "../shared/Page";
import BurgerForm from "./BurgerForm";

const EditBurger = () => {
	const {t} = useTranslation();
	const {id = ""} = useParams<{id: string}>();
	const toast = useToaster();
	const navigate = useNavigate();
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
	const {store} = useStore();
	const [isBsnValid, setBsnValid] = useState(true);

	const [updateBurger, $updateBurger] = useUpdateBurgerMutation({
		refetchQueries: [
			{query: GetBurgerDocument, variables: {id: parseInt(id)}},
			{query: GetBurgersDocument},
			{query: GetBurgersSearchDocument, variables: {search: store.burgerSearch}},
		],
	});
	const $burger = useGetBurgerQuery({
		variables: {id: parseInt(id)},
	});

	const onSubmit = (burgerData: UpdateBurgerMutationVariables) => {
		updateBurger({
			variables: burgerData,
		}).then(() => {
			toast({
				success: t("messages.burgers.updateSuccessMessage"),
			});
			navigate(AppRoutes.ViewBurgerPersonalDetails(id));
		}).catch(handleSaveBurgerErrors(t));
	};

	return (
		<Queryable query={$burger} error={<Navigate to={AppRoutes.NotFound} replace />}>{(data) => {
			const burger = data.burger;

			return (
				<Page title={formatBurgerName(burger)} backButton={<BackButton to={AppRoutes.ViewBurger(burger?.id)} />}>
					<BurgerForm burger={burger} onSubmit={onSubmit} isLoading={$burger.loading || $updateBurger.loading} isBsnValid={isBsnValid} />
				</Page>
			);
		}}
		</Queryable>
	);
};

export default EditBurger;