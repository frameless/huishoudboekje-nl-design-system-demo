import React from "react";
import {HStack, Text} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";

const Asterisk = () => {
	const {t} = useTranslation();
	return (
		<HStack>
			<Text color={"red.500"}>*</Text>
			<Text>{t("forms.Asterisk")}</Text>
		</HStack>
	);
};

export default Asterisk;