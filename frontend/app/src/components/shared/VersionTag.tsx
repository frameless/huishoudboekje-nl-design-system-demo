import {Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import VERSION from "../../version";

const VersionTag = () => {
	const {t} = useTranslation();

	return (
		<Stack spacing={2} fontSize={"xs"} textAlign={"center"}>
			<Text color={"gray.400"}>{t("version", {version: VERSION})}</Text>
		</Stack>
	);
};

export default VersionTag;