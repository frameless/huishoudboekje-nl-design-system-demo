import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Button, Stack, Text } from "@chakra-ui/core";
import EmptyIllustration from "../Illustrations/EmptyIllustration";
import Routes from "../../config/routes";
import React from "react";
import NoItemsFound from "../Forms/NoItemsFound";

export const NoAfsprakenFound = () => {
	const { push } = useHistory();
	const { t } = useTranslation();
	const { id } = useParams();

	return <NoItemsFound
		hint={t("messages.agreements.addHint", { buttonLabel: t("buttons.common.createNew") })}
		onClick={() => push(push(Routes.CreateBurgerAgreement(id)))}
		buttonLabel={t("buttons.common.createNew")}
	/>
};

export default NoAfsprakenFound;