import {ChevronDownIcon} from "@chakra-ui/icons";
import {Button, IconButton, Menu, MenuButton, MenuItem, MenuList, useToast} from "@chakra-ui/react";
import React from "react";
import {useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import Routes from "../../../config/routes";
import {Gebruiker, useDeleteBurgerMutation, useGetOneBurgerQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {formatBurgerName} from "../../../utils/things";
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
	const {id} = useParams<{ id: string }>();
	const {t} = useTranslation();
	const toast = useToast();
	const {push} = useHistory();
	const [isAlertOpen, toggleAlert] = useToggle(false);
	const [isDeleted, toggleDeleted] = useToggle(false);

	const $burger = useGetOneBurgerQuery({
		fetchPolicy: "no-cache",
		variables: {id: parseInt(id)}
	});
	const [deleteBurger, $deleteBurger] = useDeleteBurgerMutation({variables: {id: parseInt(id)}});

	const onClickEditMenuItem = () => push(Routes.EditBurger(parseInt(id)));
	const onClickDeleteMenuItem = () => toggleAlert(true);

	return (
		<Queryable query={$burger}>{({gebruiker}: { gebruiker: Gebruiker }) => {
			const onConfirmDelete = () => {
				deleteBurger().then(() => {
					toggleAlert(false);
					toast({
						title: t("messages.burgers.deleteConfirmMessage", {name: `${gebruiker.voornamen} ${gebruiker.achternaam}`}),
						position: "top",
						status: "success",
						isClosable: true,
					});
					toggleDeleted(true);
				});
			};

			if (isDeleted) {
				return (
					<DeadEndPage message={t("messages.burgers.deleteConfirmMessage", {name: `${gebruiker.voornamen} ${gebruiker.achternaam}`})}>
						<Button colorScheme={"primary"} onClick={() => push(Routes.Burgers)}>{t("actions.backToList")}</Button>
					</DeadEndPage>
				);
			}

			return (<>
				{isAlertOpen && <Alert title={t("messages.burgers.deleteTitle")} cancelButton={true} onClose={() => toggleAlert(false)} confirmButton={(
					<Button isLoading={$deleteBurger.loading} colorScheme="red" onClick={onConfirmDelete} ml={3} data-cy={"inModal"}>{t("actions.delete")}</Button>
				)}>
					{t("messages.burgers.deleteQuestion", {name: `${gebruiker.voornamen} ${gebruiker.achternaam}`})}
				</Alert>}

				<Page title={formatBurgerName(gebruiker)} backButton={<BackButton to={Routes.Burgers} />} menu={(
					<Menu>
						<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
						<MenuList>
							<MenuItem onClick={onClickEditMenuItem}>{t("actions.edit")}</MenuItem>
							<MenuItem onClick={onClickDeleteMenuItem}>{t("actions.delete")}</MenuItem>
						</MenuList>
					</Menu>
				)}>
					<Section><BurgerProfileView burger={gebruiker} /></Section>
					<Section><BurgerRekeningenView burger={gebruiker} refetch={$burger.refetch} /></Section>
					<Section><BurgerAfsprakenView burger={gebruiker} refetch={$burger.refetch} /></Section>
					<Section><BurgerGebeurtenissen burger={gebruiker} /></Section>
				</Page>
			</>)
		}}
		</Queryable>
	);
};

export default BurgerDetail;