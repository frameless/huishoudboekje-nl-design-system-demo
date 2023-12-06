import {Button, HStack, Stack, VStack, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Huishouden, useGetHuishoudenQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {formatHuishoudenName} from "../../../utils/things";
import BackButton from "../../shared/BackButton";
import Page from "../../shared/Page";
import PageNotFound from "../../shared/PageNotFound";
import AddBurgerToHuishoudenModal from "./AddBurgerToHuishoudenModal";
import HuishoudenBurgersView from "./HuishoudenBurgersView";

const HuishoudenDetails = () => {
	const {t} = useTranslation();
	const {id = ""} = useParams<{id: string}>();
	const addBurgersModal = useDisclosure();
	const $huishouden = useGetHuishoudenQuery({fetchPolicy: 'cache-and-network', variables: {id: parseInt(id)}});

	return (
		<Queryable query={$huishouden} children={data => {
			const huishouden: Huishouden = data.huishouden;

			if (!huishouden) {
				return <PageNotFound />;
			}

			const burgerIds: string[] = (huishouden.burgers || []).map(b => String(b.id));

			return (
				<Page title={t("huishoudenName", {name: formatHuishoudenName(huishouden)})} backButton={(<BackButton to={AppRoutes.Huishoudens()} />)} right={(
					<HStack margin={2}>
						<Button size={"sm"} variant={"outline"} colorScheme={"primary"} as={NavLink} to={AppRoutes.Overzicht([...burgerIds])}>{t("global.actions.showOverzicht")}</Button>
						<Button size={"sm"} variant={"outline"} colorScheme={"primary"} as={NavLink} to={AppRoutes.RapportageBurger([...burgerIds])}>{t("global.actions.showReports")}</Button>
					</HStack>
				)}>
					{addBurgersModal.isOpen && (
						<AddBurgerToHuishoudenModal huishouden={huishouden} onClose={addBurgersModal.onClose} />
					)}
					<HuishoudenBurgersView huishouden={huishouden} onClickAddButton={() => addBurgersModal.onOpen()} />
				</Page>
			);
		}} />
	);
};

export default HuishoudenDetails;