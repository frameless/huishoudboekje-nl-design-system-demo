import React from "react";
import {useGetBurgerQuery} from "../../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {Link} from "@gemeente-denhaag/link";
import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import {Heading2} from "@gemeente-denhaag/typography";


const Afspraken: React.FC<{ bsn: number }> = ({bsn}) => {
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	return (
		<Queryable query={$burger} render={data => {
			const {afspraken = []} = data.burger || {};

			return (
				<div>
					<Link href={"/"} icon={<ArrowLeftIcon />} iconAlign={"start"}>Huishoudboekje</Link>
					<Heading2>Afspraken</Heading2>
					{afspraken.map(afspraak => {
						return afspraak.id
					})}
				</div>
			)
		}} />
	);
};

export default Afspraken;