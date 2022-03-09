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
			const {rekeningen} = data.burger || {};
			const {afspraken} = data.burger || {};

			// return (<pre> {JSON.stringify(rekeningen, null, 2)}</pre>)
			return (<ToekomstList rekeningen={rekeningen} afspraken={afspraken} />)
		}} />
	);
};

export default Toekomst;