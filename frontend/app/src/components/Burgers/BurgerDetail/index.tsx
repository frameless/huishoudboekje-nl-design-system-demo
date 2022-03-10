import {Button, Divider, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Stack, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Burger, GetBurgerDocument, GetBurgersDocument, GetBurgersSearchDocument, GetHuishoudensDocument, useDeleteBurgerMutation, useDeleteHuishoudenBurgerMutation, useGetBurgerQuery} from "../../../generated/graphql";
import {useStore} from "../../../store";
import Queryable from "../../../utils/Queryable";
import {formatBurgerName} from "../../../utils/things";
import useToaster from "../../../utils/useToaster";
import Alert from "../../shared/Alert";
import BackButton from "../../shared/BackButton";
import MenuIcon from "../../shared/MenuIcon";
import Page from "../../shared/Page";
import PageNotFound from "../../shared/PageNotFound";
import BurgerAfsprakenView from "./BurgerAfsprakenView";
import BurgerGebeurtenissen from "./BurgerGebeurtenissen";
import BurgerSignalenView from "./BurgerSignalenView";

const BurgerDetailPage = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();
	const toast = useToaster();
	const navigate = useNavigate();
	const deleteAlert = useDisclosure();
	const deleteHuishoudenBurgerAlert = useDisclosure();
	const {store} = useStore();
	const $burger = useGetBurgerQuery({
		variables: {
			id: parseInt(id),
		},
	});
	const [deleteHuishoudenBurger, $deleteHuishoudenBurger] = useDeleteHuishoudenBurgerMutation({
		refetchQueries: [
			{query: GetBurgersSearchDocument, variables: {search: store.burgerSearch}},
			{query: GetBurgersDocument},
			{query: GetBurgerDocument, variables: {id: parseInt(id)}},
			{query: GetHuishoudensDocument},
		],
	});
	const [deleteBurger, $deleteBurger] = useDeleteBurgerMutation({
		variables: {
			id: parseInt(id),
		},
		refetchQueries: [
			{query: GetBurgersSearchDocument, variables: {search: store.burgerSearch}},
			{query: GetBurgersDocument},
			{query: GetHuishoudensDocument},
		],
	});

	return (
		<Queryable query={$burger}>{(data) => {
			const burger: Burger = data.burger;

			if (!burger) {
				return <PageNotFound />;
			}

			const onConfirmDeleteHuishoudenBurger = () => {
				deleteHuishoudenBurger({
					variables: {
						huishoudenId: burger.huishouden?.id!,
						burgerIds: [parseInt(id)],
					},
				}).then(() => {
					deleteHuishoudenBurgerAlert.onClose();
					toast({
						success: t("messages.burgers.deleteFromHuishoudenConfirmMessage", {name: `${burger.voornamen} ${burger.achternaam}`}),
					});
				}).catch(err => {
					console.error(err);
					toast({
						error: err.message,
					});
				});
			};

			const onConfirmDelete = () => {
				deleteBurger()
					.then(() => {
						toast({
							success: t("messages.burgers.deleteConfirmMessage", {name: `${burger.voornamen} ${burger.achternaam}`}),
						});
						deleteAlert.onClose();
						navigate(AppRoutes.Burgers());
					})
					.catch(err => {
						console.error(err);
						toast({
							error: err.message,
						});
					});
			};

			return (<>
				{deleteAlert.isOpen && (
					<Alert
						title={t("messages.burgers.deleteTitle")}
						cancelButton={true}
						onClose={() => deleteAlert.onClose()}
						confirmButton={(
							<Button isLoading={$deleteBurger.loading} colorScheme={"red"} onClick={onConfirmDelete} ml={3}>
								{t("global.actions.delete")}
							</Button>
						)}
					>
						{t("messages.burgers.deleteQuestion", {name: `${burger.voornamen} ${burger.achternaam}`})}
					</Alert>
				)}
				{deleteHuishoudenBurgerAlert.isOpen && (
					<Alert
						title={t("messages.burgers.deleteFromHuishoudenTitle")}
						cancelButton={true}
						onClose={() => deleteHuishoudenBurgerAlert.onClose()}
						confirmButton={(
							<Button isLoading={$deleteHuishoudenBurger.loading} colorScheme={"red"} onClick={onConfirmDeleteHuishoudenBurger} ml={3}>
								{t("global.actions.delete")}
							</Button>
						)}
					>
						{t("messages.burgers.deleteFromHuishoudenQuestion", {name: `${burger.voornamen} ${burger.achternaam}`})}
					</Alert>
				)}

				<Page title={formatBurgerName(burger)} backButton={(
					<Stack direction={["column", "row"]} spacing={[2, 5]}>
						<BackButton label={t("backToBurgersList")} to={AppRoutes.Burgers()} />
						<BackButton label={t("global.actions.viewBurgerHuishouden")} to={AppRoutes.Huishouden(burger.huishouden?.id)} />
					</Stack>
				)} menu={(
					<Menu>
						<IconButton as={MenuButton} icon={<MenuIcon />} variant={"solid"} aria-label={"Open menu"} />
						<MenuList>
							<Link href={AppRoutes.BrievenExport(id, "excel")} target={"_blank"}><MenuItem>{t("global.actions.brievenExport")}</MenuItem></Link>
							<NavLink to={AppRoutes.RapportageBurger([parseInt(id)])}><MenuItem>{t("global.actions.showReports")}</MenuItem></NavLink>
							<NavLink to={AppRoutes.BurgerPersonalDetails(burger.id)}><MenuItem>{t("global.actions.showPersonalDetails")}</MenuItem></NavLink>
							<NavLink to={AppRoutes.Huishouden(burger.huishouden?.id)}><MenuItem>{t("global.actions.showHuishouden")}</MenuItem></NavLink>
							<Divider />
							<MenuItem onClick={() => deleteHuishoudenBurgerAlert.onOpen()}>{t("global.actions.deleteBurgerFromHuishouden")}</MenuItem>
							<MenuItem onClick={() => deleteAlert.onOpen()}>{t("global.actions.delete")}</MenuItem>
						</MenuList>
					</Menu>
				)}>
					<BurgerSignalenView burger={burger} />
					<BurgerAfsprakenView burger={burger} />
					<BurgerGebeurtenissen burger={burger} />
				</Page>
			</>);
		}}
		</Queryable>
	);
};

export default BurgerDetailPage;