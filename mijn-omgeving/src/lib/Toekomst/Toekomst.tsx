import React from "react";
import {useGetBurgerQuery} from "../../generated/graphql";
import Queryable from "../Queryable";
import ToekomstList from "./ToekomstList";

const Toekomst: React.FC<{ bsn: number }> = ({bsn}) => {
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	return (
		<Queryable query={$burger} render={data => {
			const {rekeningen = [], afspraken = []} = data.burger || {};

			const burgerRekeningenIds: number[] = rekeningen.map(r => r.id);
			const filteredAfspraken = afspraken.filter(a => burgerRekeningenIds.includes(a.tegenrekening?.id));

			// return (<pre> {JSON.stringify(afspraken, null, 2)}</pre>)
			return (<ToekomstList afspraken={filteredAfspraken} />)
		}} />
	);
};

export default Toekomst;