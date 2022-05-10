import {Text} from "@chakra-ui/react";
import {Heading2} from "@gemeente-denhaag/typography";
import React from "react";
import {useGetBurgerQuery} from "../../../generated/graphql";
import Queryable from "../../utils/Queryable";
import BackButton from "../BackButton";
import ToekomstList from "./ToekomstList";

const Toekomst: React.FC<{bsn: number}> = ({bsn}) => {
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

				return filteredAfspraken.length > 0 ? (
					<ToekomstList afspraken={filteredAfspraken} />
				) : (
					<Text>Er zijn geen verwachte transacties gevonden.</Text>
				);
			}} />
		</div>
	);
};

export default Toekomst;