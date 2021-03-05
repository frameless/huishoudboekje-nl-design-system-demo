import {ChevronDownIcon} from "@chakra-ui/icons";
import {Button, IconButton, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import React from "react";
import {useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import Routes from "../../../config/routes";
import {Burger, useDeleteBurgerMutation, useGetOneBurgerQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {formatBurgerName} from "../../../utils/things";
import useToaster from "../../../utils/useToaster";
import BackButton from "../../BackButton";
import DeadEndPage from "../../DeadEndPage";
import Alert from "../../Layouts/Alert";
import Page from "../../Layouts/Page";
import Section from "../../Layouts/Section";
import BurgerAfsprakenView from "./BurgerAfsprakenView";
import BurgerGebeurtenissen from "./BurgerGebeurtenissen";
import BurgerProfileView from "./BurgerProfileView";
import BurgerRekeningenView from "./BurgerRekeningenView";

const BurgerDetail = () => {
	const {id} = useParams<{id: string}>();
	const {t} = useTranslation();
	const toast = useToaster();
	const {push} = useHistory();
	const [isAlertOpen, toggleAlert] = useToggle(false);
	const [isDeleted, toggleDeleted] = useToggle(false);

	const $burger = useGetOneBurgerQuery({
		fetchPolicy: "no-cache",
		variables: {id: parseInt(id)},
	});
	const [deleteBurger, $deleteBurger] = useDeleteBurgerMutation({variables: {id: parseInt(id)}});

	const onClickEditMenuItem = () => push(Routes.EditBurger(parseInt(id)));
	const onClickDeleteMenuItem = () => toggleAlert(true);

	return (
		<Queryable query={$burger}>{({burger}: {burger: Burger}) => {
			const onConfirmDelete = () => {
				deleteBurger()
					.then(() => {
						toggleAlert(false);
						toast({
							success: t("messages.burgers.deleteConfirmMessage", {name: `${burger.voornamen} ${burger.achternaam}`}),
						});
						toggleDeleted(true);
					})
					.catch(err => {
						console.error(err);
						toast({
							error: err.message,
						});
					});
			};

			if (isDeleted) {
				return (
					<DeadEndPage message={t("messages.burgers.deleteConfirmMessage", {name: `${burger.voornamen} ${burger.achternaam}`})}>
						<Button colorScheme={"primary"} onClick={() => push(Routes.Burgers)}>{t("actions.backToList")}</Button>
					</DeadEndPage>
				);
			}

			return (<>
				{isAlertOpen && <Alert title={t("messages.burgers.deleteTitle")} cancelButton={true} onClose={() => toggleAlert(false)} confirmButton={(
					<Button isLoading={$deleteBurger.loading} colorScheme="red" onClick={onConfirmDelete} ml={3} data-cy={"inModal"}>{t("actions.delete")}</Button>
				)}>
					{t("messages.burgers.deleteQuestion", {name: `${burger.voornamen} ${burger.achternaam}`})}
				</Alert>}

				<Page title={formatBurgerName(burger)} backButton={<BackButton to={Routes.Burgers} />} menu={(
					<Menu>
						<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
						<MenuList>
							<MenuItem onClick={onClickEditMenuItem}>{t("actions.edit")}</MenuItem>
							<MenuItem onClick={onClickDeleteMenuItem}>{t("actions.delete")}</MenuItem>
						</MenuList>
					</Menu>
				)}>
					<Section><BurgerProfileView burger={burger} /></Section>
					<Section><BurgerRekeningenView burger={burger} refetch={$burger.refetch} /></Section>
					<Section><BurgerAfsprakenView burger={burger} refetch={$burger.refetch} /></Section>
					<Section><BurgerGebeurtenissen burger={burger} /></Section>
				</Page>
			</>);
		}}
		</Queryable>
	);
};

export default BurgerDetail;