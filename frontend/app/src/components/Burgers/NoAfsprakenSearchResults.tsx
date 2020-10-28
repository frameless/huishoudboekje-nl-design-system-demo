import React from "react";
import { Box, BoxProps, Button, Stack, Text } from "@chakra-ui/core";
import { useTranslation } from "react-i18next";
import EmptyIllustration from "../Illustrations/EmptyIllustration";

const NoAfsprakenSearchResults: React.FC<BoxProps & { onSearchReset?: Function }> = ({ onSearchReset }) => {
	const { t } = useTranslation();

	return (
		<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10} borderRadius={5}>
			<Box as={EmptyIllustration} maxWidth={[200, 300, 400]} height={"auto"} />
			<Text fontSize={"sm"}>{t("messages.agreements.noSearchResults")}</Text>
			{onSearchReset && <Button size="sm" variantColor="primary"
									  onClick={() => onSearchReset()}>{t("actions.clearSearch")}</Button>}
		</Stack>
	);
};

export default NoAfsprakenSearchResults;