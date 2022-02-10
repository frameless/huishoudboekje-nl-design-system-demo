import {friendlyFormatIBAN} from "ibantools";
import React from "react";
import {useTranslation} from "react-i18next";

const PrettyIban: React.FC<{iban?: string}> = ({iban, ...props}) => {
	const {t} = useTranslation();

	return React.createElement("span", null, (
		iban ? friendlyFormatIBAN(iban) : t("unknown")
	));
};
export default PrettyIban;