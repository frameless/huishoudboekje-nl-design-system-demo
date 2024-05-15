import React from "react";
import {HStack, Text} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";

const Asterisk = () => {
	const {t} = useTranslation();
	return (
		<HStack spacing={1}>
			<Text data-test="asterisk.required" color={"red.500"}>*</Text>
			<Text>{t("forms.asterisk")}</Text>
		</HStack>
	);
};

export default Asterisk;