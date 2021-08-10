import {Stack, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import Routes from "../../../config/routes";
import {Huishouden, useGetHuishoudenQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {formatHuishoudenName} from "../../../utils/things";
import BackButton from "../../Layouts/BackButton";
import Page from "../../Layouts/Page";
import PageNotFound from "../../PageNotFound";
import AddBurgerToHuishoudenModal from "./AddBurgerToHuishoudenModal";
import HuishoudenBurgersView from "./HuishoudenBurgersView";

const HuishoudenDetails = () => {
	const {t} = useTranslation();
	const {id} = useParams<{id: string}>();
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
				<Page title={t("huishoudenName", {name: formatHuishoudenName(huishouden)})} backButton={(
					<Stack direction={["column", "row"]} spacing={[2, 5]}>
						<BackButton to={Routes.Huishoudens} />
						<BackButton to={Routes.RapportageBurger(burgerIds)} label={t("actions.showReports")} />
					</Stack>
				)}>
					<AddBurgerToHuishoudenModal huishouden={huishouden} onClose={addBurgersModal.onClose} isOpen={addBurgersModal.isOpen} />
					<HuishoudenBurgersView huishouden={huishouden} onClickAddButton={() => addBurgersModal.onOpen()} />
				</Page>
			);
		}} />
	);
};

export default HuishoudenDetails;