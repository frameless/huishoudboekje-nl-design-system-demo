import {Button, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Huishouden, useGetHuishoudenQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {formatHuishoudenName} from "../../../utils/things";
import Page from "../../shared/Page";
import PageNotFound from "../../shared/PageNotFound";
import BackButton from "../../shared/BackButton";
import AddBurgerToHuishoudenModal from "./AddBurgerToHuishoudenModal";
import HuishoudenBurgersView from "./HuishoudenBurgersView";

const HuishoudenDetails = () => {
	const {t} = useTranslation();
	const {id = ""} = useParams<{id: string}>();
	const addBurgersModal = useDisclosure();
	const $huishouden = useGetHuishoudenQuery({variables: {id: parseInt(id)}});

	return (
		<Queryable query={$huishouden} children={data => {
			const huishouden: Huishouden = data.huishouden;

			if (!huishouden) {
				return <PageNotFound />;
			}

			const burgerIds: number[] = (huishouden.burgers || []).map(b => b.id!);

			return (
				<Page title={t("huishoudenName", {name: formatHuishoudenName(huishouden)})} backButton={(<BackButton to={AppRoutes.Huishoudens()} />)} right={(
					<Button size={"sm"} colorScheme={"primary"} as={NavLink} to={AppRoutes.RapportageBurger(burgerIds)}>{t("global.actions.showReports")}</Button>
				)}>
					<AddBurgerToHuishoudenModal huishouden={huishouden} onClose={addBurgersModal.onClose} isOpen={addBurgersModal.isOpen} />
					<HuishoudenBurgersView huishouden={huishouden} onClickAddButton={() => addBurgersModal.onOpen()} />
				</Page>
			);
		}} />
	);
};

export default HuishoudenDetails;