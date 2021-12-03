import React from "react";
import {Banktransactie} from "./generated/graphql";

const nf = new Intl.NumberFormat("nl-NL", {style: "currency", currency: "EUR"});

const BanktransactieListItem: React.FC<{transactie: Banktransactie}> = ({transactie}) => {
	const bedrag = transactie.bedrag * (transactie.isCredit ? 1 : -1);

	return (<tr>
		<td style={{verticalAlign: "top"}}>{transactie.transactiedatum}</td>
		<td style={{paddingBottom: 10}}>
			<span>{transactie.tegenrekening?.rekeninghouder} ({transactie.tegenrekeningIban})</span>
			<br />
			<span style={{fontSize: 14}}>{transactie.informationToAccountOwner}</span>
			<br />
		</td>
		<td style={{verticalAlign: "top"}}>{nf.format(bedrag)}</td>
	</tr>);
};

export default BanktransactieListItem;