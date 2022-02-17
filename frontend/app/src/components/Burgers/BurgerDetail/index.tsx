import {ChevronDownIcon} from "@chakra-ui/icons";
import {Button, Divider, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Stack, useDisclosure} from "@chakra-ui/react";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Burger, GetBurgersDocument, GetBurgersSearchDocument, GetHuishoudensDocument, useDeleteBurgerMutation, useGetBurgerQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {formatBurgerName} from "../../../utils/things";
import useToaster from "../../../utils/useToaster";
import Alert from "../../shared/Alert";
import BackButton from "../../shared/BackButton";
import Page from "../../shared/Page";
import PageNotFound from "../../shared/PageNotFound";
import Section from "../../shared/Section";
import {BurgerSearchContext} from "../BurgerSearchContext";
import BurgerAfsprakenView from "./BurgerAfsprakenView";
import BurgerGebeurtenissen from "./BurgerGebeurtenissen";
import BurgerProfileView from "./BurgerProfileView";
import BurgerRekeningenView from "./BurgerRekeningenView";

const BurgerDetailPage = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();
	const toast = useToaster();
	const navigate = useNavigate();
	const deleteAlert = useDisclosure();
	const {search} = useContext(BurgerSearchContext);

	const $burger = useGetBurgerQuery({
		variables: {
			id: parseInt(id),
		},
	});
	const [deleteBurger, $deleteBurger] = useDeleteBurgerMutation({
		variables: {
			id: parseInt(id),
		},
		refetchQueries: [
			{query: GetBurgersSearchDocument, variables: {search}},
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
							<Button isLoading={$deleteBurger.loading} colorScheme="red" onClick={onConfirmDelete} ml={3}>
								{t("global.actions.delete")}
							</Button>
						)}
					>
						{t("messages.burgers.deleteQuestion", {name: `${burger.voornamen} ${burger.achternaam}`})}
					</Alert>
				)}

				<Page title={formatBurgerName(burger)} backButton={(
					<Stack direction={["column", "row"]} spacing={[2, 5]}>
						<BackButton label={t("backToBurgersList")} to={AppRoutes.Burgers()} />
						<BackButton label={t("global.actions.viewBurgerHuishouden")} to={AppRoutes.Huishouden(burger.huishouden?.id)} />
					</Stack>
				)} menu={(
					<Menu>
						<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} />
						<MenuList>
							<Link href={AppRoutes.BrievenExport(id, "excel")} target={"_blank"}><MenuItem>{t("global.actions.brievenExport")}</MenuItem></Link>
							<NavLink to={AppRoutes.RapportageBurger([parseInt(id)])}><MenuItem>{t("sidebar.rapportage")}</MenuItem></NavLink>
							<NavLink to={AppRoutes.Huishouden(burger.huishouden?.id)}><MenuItem>{t("showHuishouden")}</MenuItem></NavLink>
							<Divider />
							<NavLink to={AppRoutes.EditBurger(id)}><MenuItem>{t("global.actions.edit")}</MenuItem></NavLink>
							<MenuItem onClick={() => deleteAlert.onOpen()}>{t("global.actions.delete")}</MenuItem>
						</MenuList>
					</Menu>
				)}>
					<Section><BurgerProfileView burger={burger} /></Section>
					<Section><BurgerRekeningenView burger={burger} /></Section>
					<Section><BurgerAfsprakenView burger={burger} /></Section>
					<Section><BurgerGebeurtenissen burger={burger} /></Section>
				</Page>
			</>);
		}}
		</Queryable>
	);
};

export default BurgerDetailPage;