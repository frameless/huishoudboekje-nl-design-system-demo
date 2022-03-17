import {friendlyFormatIBAN} from "ibantools";
import React from "react";

type PrettyIbanProps = {
	iban?: string,
	fallback?: string,
};

const PrettyIban: React.FC<PrettyIbanProps> = ({iban, fallback = "Unknown IBAN"}) => {
	return React.createElement("span", null, (
		iban ? friendlyFormatIBAN(iban) : fallback
	));
};

export default PrettyIban;