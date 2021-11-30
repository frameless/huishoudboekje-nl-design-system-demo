import React from "react";
import {Banktransactie} from "./generated/graphql";

const BanktransactiesList: React.FC<{transacties: Banktransactie[]}> = ({transacties}) => {
	const nf = new Intl.NumberFormat("nl-NL", {style: "currency", currency: "EUR"});

	return (<>
		<h1>Uw Huishoudboekje</h1>

		<table style={{
			width: "100%",
		}}>
			<thead style={{
				textAlign: "left",
			}}>
				<tr>
					<th>Datum</th>
					<th>Tegenrekening</th>
					<th>Bedrag</th>
				</tr>
			</thead>
			<tbody>
				{transacties.map(t => {
					const bedrag = t.bedrag * (t.isCredit ? 1 : -1);

					return (
						<tr>
							<td>{t.transactiedatum}</td>
							<td>{t.tegenrekening?.rekeninghouder} ({t.tegenrekeningIban})</td>
							<td>{nf.format(bedrag)}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	</>);
};

export default BanktransactiesList;