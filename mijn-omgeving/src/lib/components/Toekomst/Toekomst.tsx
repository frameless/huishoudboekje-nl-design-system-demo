import React from "react";
import {useGetBurgerQuery} from "../../../generated/graphql";
import Queryable from "../../utils/Queryable";
import ToekomstList from "./ToekomstList";
import {Link} from "@gemeente-denhaag/link";
import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import {Heading2} from "@gemeente-denhaag/typography";

const Toekomst: React.FC<{ bsn: number }> = ({bsn}) => {
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	return (
		<Queryable query={$burger} render={data => {
			const {rekeningen = [], afspraken = []} = data.burger || {};

			const burgerRekeningenIds: number[] = rekeningen.map(r => r.id);
			const filteredAfspraken = afspraken.filter(a => burgerRekeningenIds.includes(a.tegenrekening?.id));

			return (
				<div>
					<div>
						<Link href={"/"} icon={<ArrowLeftIcon />} iconAlign={"start"}>Huishoudboekje</Link>
						<Heading2>Toekomst</Heading2>
					</div>
					<ToekomstList afspraken={filteredAfspraken} />
				</div>
			)
		}} />
	);
};

export default Toekomst;