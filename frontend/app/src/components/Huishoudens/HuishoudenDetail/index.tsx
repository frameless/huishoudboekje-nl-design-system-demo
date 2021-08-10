import {ChevronDownIcon} from "@chakra-ui/icons";
import {IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useParams} from "react-router-dom";
import Routes from "../../../config/routes";
import {Huishouden, useGetHuishoudenQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {formatHuishoudenName} from "../../../utils/things";
import Page from "../../Layouts/Page";
import PageNotFound from "../../PageNotFound";
import AddBurgerToHuishoudenModal from "./AddBurgerToHuishoudenModal";
import DeleteBurgerFromHuishoudenModal from "./DeleteBurgerFromHuishoudenModal";
import HuishoudenBurgersView from "./HuishoudenBurgersView";

const HuishoudenDetails = () => {
	const {t} = useTranslation();
	const {id} = useParams<{id: string}>();
	const addBurgersModal = useDisclosure();
	const deleteBurgersModal = useDisclosure();
	const $huishouden = useGetHuishoudenQuery({variables: {id: parseInt(id)}});

	return (
		<Queryable query={$huishouden} children={data => {
			const huishouden: Huishouden = data.huishouden;

			if (!huishouden) {
				return <PageNotFound />;
			}

			const burgerIds: number[] = (huishouden.burgers || []).map(b => b.id!);

			return (
				<Page title={t("huishoudenName", {name: formatHuishoudenName(huishouden)})} menu={(
					<Menu>
						<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
						<MenuList>
							<MenuItem onClick={() => addBurgersModal.onOpen()}>{t("actions.addBurgers")}</MenuItem>
							<MenuItem onClick={() => deleteBurgersModal.onOpen()}>{t("actions.deleteBurgers")}</MenuItem>
							<NavLink to={Routes.RapportageBurger(burgerIds)}><MenuItem>{t("sidebar.rapportage")}</MenuItem></NavLink>
						</MenuList>
					</Menu>
				)}>
					<AddBurgerToHuishoudenModal huishouden={huishouden} onClose={addBurgersModal.onClose} isOpen={addBurgersModal.isOpen} />
					<DeleteBurgerFromHuishoudenModal huishouden={huishouden} onClose={deleteBurgersModal.onClose} isOpen={deleteBurgersModal.isOpen} />

					<HuishoudenBurgersView burgers={huishouden.burgers || []} />
				</Page>
			);
		}} />
	);
};

export default HuishoudenDetails;