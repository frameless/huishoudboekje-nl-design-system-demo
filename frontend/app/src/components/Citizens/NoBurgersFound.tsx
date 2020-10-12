import React from "react";
import {Box, Button, Stack, Text} from "@chakra-ui/core";
import {ReactComponent as Empty} from "../../assets/images/illustration-empty.svg";
import Routes from "../../config/routes";
import { useHistory } from "react-router-dom";
import {useTranslation} from "react-i18next";

const NoBurgersFound = () => {
	const {push} = useHistory();
	const {t} = useTranslation();

	return (
		<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10}>
			<Box as={Empty} maxWidth={[200, 300, 400]} height={"auto"} />
			<Text fontSize={"sm"}>Voeg burgers toe door te klikken op de knop "Burger toevoegen"</Text>
			<Button size={"sm"} variantColor={"primary"} variant={"solid"} leftIcon={"add"}
			        onClick={() => push(Routes.CitizenNew)}>{t("add-citizen-button-label")}</Button>
		</Stack>
	);
};

export default NoBurgersFound;