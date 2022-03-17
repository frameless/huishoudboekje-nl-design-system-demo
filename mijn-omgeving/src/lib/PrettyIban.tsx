import {friendlyFormatIBAN} from "ibantools";
import React from "react";

const PrettyIban: React.FC<{ iban?: string }> = ({iban}) => {
	return React.createElement("span", null, (
		iban ? friendlyFormatIBAN(iban) : "Onbekend"
	));
};
export default PrettyIban;