import {friendlyFormatIBAN} from "ibantools";
import React from "react";

type PrettyIbanProps = {
	iban?: string,
	fallback?: string,
};

const PrettyIban: React.FC<PrettyIbanProps> = ({iban, fallback = "Unknown IBAN"}) => {
	const formatted = iban ? friendlyFormatIBAN(iban) : fallback;
	return React.createElement("span", null, formatted);
};

export default PrettyIban;
