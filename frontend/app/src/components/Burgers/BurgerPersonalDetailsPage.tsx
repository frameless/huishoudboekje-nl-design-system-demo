import {ChevronDownIcon} from "@chakra-ui/icons";
import {IconButton, Menu, MenuButton, MenuItem, MenuList, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useParams} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Burger, useGetBurgerQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {formatBurgerName} from "../../utils/things";
import BackButton from "../shared/BackButton";
import Page from "../shared/Page";
import PageNotFound from "../shared/PageNotFound";
import {DeprecatedSection} from "../shared/Section";
import BurgerProfileView from "./BurgerDetail/BurgerProfileView";
import BurgerRekeningenView from "./BurgerDetail/BurgerRekeningenView";

const BurgerPersonalDetailsPage = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();

	const $burger = useGetBurgerQuery({
		variables: {
			id: parseInt(id),
		},
	});

	return (
		<Queryable query={$burger}>{(data) => {
			const burger: Burger = data.burger;

			if (!burger) {
				return <PageNotFound />;
			}

			return (
				<Page title={formatBurgerName(burger)} backButton={(
					<Stack direction={["column", "row"]} spacing={[2, 5]}>
						<BackButton to={AppRoutes.Burger(burger.id)} />
					</Stack>
				)} menu={(
					<Menu>
						<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} />
						<MenuList>
							<NavLink to={AppRoutes.EditBurger(id)}><MenuItem>{t("global.actions.edit")}</MenuItem></NavLink>
						</MenuList>
					</Menu>
				)}>
					<DeprecatedSection><BurgerProfileView burger={burger} /></DeprecatedSection>
					<DeprecatedSection><BurgerRekeningenView burger={burger} /></DeprecatedSection>
				</Page>
			);
		}}
		</Queryable>
	);
};

export default BurgerPersonalDetailsPage;