import React from "react";
import {useGetBurgerQuery} from "../../../generated/graphql";
import Queryable from "../../utils/Queryable";
import ToekomstList from "./ToekomstList";
import {Heading2} from "@gemeente-denhaag/typography";
import BackButton from "../BackButton";

const Toekomst: React.FC<{ bsn: number }> = ({bsn}) => {
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	return (
		<div>
			<BackButton label={"Huishoudboekje"} />
			<Heading2>Toekomst</Heading2>
			<Queryable query={$burger} render={data => {
				const {rekeningen = [], afspraken = []} = data.burger || {};

				const burgerRekeningenIds: number[] = rekeningen.map(r => r.id);
				const filteredAfspraken = afspraken.filter(a => burgerRekeningenIds.includes(a.tegenrekening?.id));

				return (
					<div>
						<ToekomstList afspraken={filteredAfspraken} />
					</div>
				)
			}} />
		</div>
	);
};

export default Toekomst;