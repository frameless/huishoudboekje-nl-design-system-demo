import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Button, Stack, Text } from "@chakra-ui/core";
import EmptyIllustration from "../Illustrations/EmptyIllustration";
import Routes from "../../config/routes";
import React from "react";

export const NoAfsprakenFound = () => {
	const { push } = useHistory();
	const { t } = useTranslation();
	const { id } = useParams();

	return (
		<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} borderRadius={5} p={20} spacing={10}>
			<Box as={EmptyIllustration} maxWidth={[200, 300, 400]} height={"auto"} />
			<Text
				fontSize={"sm"}>{t("messages.agreements.addHint", { buttonLabel: t("buttons.agreements.createNew") })}</Text>
			<Button size={"sm"} variantColor={"primary"} variant={"solid"} leftIcon={"add"}
				onClick={() => push(Routes.CreateBurgerAgreement(id))}>{t("buttons.agreements.createNew")}</Button>
		</Stack>
	);
};

export default NoAfsprakenFound;