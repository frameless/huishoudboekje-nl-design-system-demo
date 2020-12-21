import {Text, TextProps} from "@chakra-ui/react";
import {friendlyFormatIBAN} from "ibantools";
import React from "react";
import {useTranslation} from "react-i18next";

const PrettyIban: React.FC<{iban?: string} & TextProps> = ({iban, ...props}) => {
	const {t} = useTranslation();

	return (
		<Text fontSize={"sm"} {...props}>{iban ? friendlyFormatIBAN(iban) : t("unknown")}</Text>
	);
};
export default PrettyIban;