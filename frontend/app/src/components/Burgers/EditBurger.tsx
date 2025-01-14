import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {
	CreateBurgerMutationVariables,
	GetBurgerDetailsDocument,
	GetBurgersDocument,
	GetBurgersSearchDocument,
	useGetBurgerPersonalDetailsQuery,
	useUpdateBurgerMutation,
} from "../../generated/graphql";
import useStore from "../../store";
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
	const burgerSearch = useStore(store => store.burgerSearch);
	const [isBsnValid, setBsnValid] = useState(true);

	const [updateBurger, $updateBurger] = useUpdateBurgerMutation({
		refetchQueries: [
			{query: GetBurgerDetailsDocument, variables: {id: parseInt(id)}},
			{query: GetBurgersDocument},
			{query: GetBurgersSearchDocument, variables: {search: burgerSearch}},
		],
	});
	const $burger = useGetBurgerPersonalDetailsQuery({
		variables: {id: parseInt(id)},
	});

	const onSubmit = (burgerData: CreateBurgerMutationVariables["input"]) => {
		updateBurger({
			variables: {
				...burgerData,
				id: parseInt(id),
			},
		}).then(() => {
			toast({
				success: t("messages.burgers.updateSuccessMessage"),
			});
			navigate(AppRoutes.ViewBurgerPersonalDetails(id), {replace: true});
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
