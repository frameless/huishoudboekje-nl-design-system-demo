import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import SaveBurgerErrorHandler from "../../errorHandlers/SaveBurgerErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {GetBurgerDocument, GetBurgersDocument, GetBurgersSearchDocument, UpdateBurgerMutationVariables, useGetBurgerQuery, useUpdateBurgerMutation} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {formatBurgerName} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import BackButton from "../Layouts/BackButton";
import Page from "../Layouts/Page";
import BurgerForm from "./BurgerForm";
import {BurgerSearchContext} from "./BurgerSearchContext";

const EditBurger = () => {
	const {t} = useTranslation();
	const {id = ""} = useParams<{id: string}>();
	const toast = useToaster();
	const navigate = useNavigate();
	const handleSaveBurgerErrors = useMutationErrorHandler(SaveBurgerErrorHandler);
	const {search} = useContext(BurgerSearchContext);

	const [updateBurger, $updateBurger] = useUpdateBurgerMutation({
		refetchQueries: [
			{query: GetBurgerDocument, variables: {id: parseInt(id)}},
			{query: GetBurgersDocument},
			{query: GetBurgersSearchDocument, variables: {search}},
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
			navigate(AppRoutes.Burger(parseInt(id)));
		}).catch(handleSaveBurgerErrors);
	};

	return (
		<Queryable query={$burger} error={<Navigate to={AppRoutes.NotFound} replace />}>{(data) => {
			const burger = data.burger;

			return (
				<Page title={formatBurgerName(burger)} backButton={<BackButton to={AppRoutes.Burger(burger?.id)} />}>
					<BurgerForm burger={burger} onSubmit={onSubmit} isLoading={$burger.loading || $updateBurger.loading} />
				</Page>
			);
		}}
		</Queryable>
	);
};

export default EditBurger;