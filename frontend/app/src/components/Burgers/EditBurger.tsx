import React from "react";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {GetBurgerDocument, GetBurgersDocument, UpdateBurgerMutationVariables, useGetBurgerQuery, useUpdateBurgerMutation} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {formatBurgerName} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import BackButton from "../Layouts/BackButton";
import Page from "../Layouts/Page";
import BurgerForm from "./BurgerForm";
import SaveBurgerErrorHandler from "../../errorHandlers/SaveBurgerErrorHandler";

const EditBurger = () => {
	const {t} = useTranslation();
	const {id} = useParams<{id: string}>();
	const toast = useToaster();
	const {push} = useHistory();
	const handleSaveBurgerErrors = useMutationErrorHandler(SaveBurgerErrorHandler);

	const [updateBurger, $updateBurger] = useUpdateBurgerMutation({
		refetchQueries: [
			{query: GetBurgerDocument, variables: {id: parseInt(id)}},
			{query: GetBurgersDocument},
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
			push(Routes.Burger(parseInt(id)));
		}).catch(handleSaveBurgerErrors);
	};

	return (
		<Queryable query={$burger} error={<Redirect to={Routes.NotFound} />}>{(data) => {
			const burger = data.burger;

			return (
				<Page title={formatBurgerName(burger)} backButton={<BackButton to={Routes.Burger(burger?.id)} />}>
					<BurgerForm burger={burger} onSubmit={onSubmit} isLoading={$burger.loading || $updateBurger.loading} />
				</Page>
			);
		}}
		</Queryable>
	);
};

export default EditBurger;