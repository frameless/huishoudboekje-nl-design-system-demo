import "@utrecht/components/dist/heading-1/bem.css";
import "@utrecht/components/dist/table/bem.css";
import React from "react";
import BanktransactieListItem from "./BanktransactieListItem";
import {Banktransactie} from "./generated/graphql";

const BanktransactiesList: React.FC<{transacties: Banktransactie[]}> = ({transacties}) => {
	return (<>
		<h1 className={"utrecht-heading-1"}>Uw Huishoudboekje</h1>

		{transacties.length > 0 ? (
			<table className={"utrecht-table"} style={{width: "100%"}}>
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
					{transacties.map(transactie => {
						return <BanktransactieListItem transactie={transactie} />;
					})}
				</tbody>
			</table>
		) : (
			<span>Er zijn geen transacties gevonden.</span>
		)}
	</>);
};

export default BanktransactiesList;