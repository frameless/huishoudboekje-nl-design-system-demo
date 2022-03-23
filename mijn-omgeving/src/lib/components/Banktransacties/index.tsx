import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import {Link} from "@gemeente-denhaag/link";
import {Heading2} from "@gemeente-denhaag/typography";
import React from "react";
import {useGetBurgerQuery} from "../../../generated/graphql";
import BanktransactiesList from "./BanktransactiesList";
import Queryable from "../../utils/Queryable";

const BanktransactiesPage: React.FC<{ bsn: number }> = ({bsn}) => {
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	return (
		<div>
			<Link href={"/"} icon={<ArrowLeftIcon />} iconAlign={"start"}>Huishoudboekje</Link>
			<Heading2>Banktransacties</Heading2>

			<Queryable query={$burger} render={data => {
				const {banktransacties} = data.burger || {};
				const transacties = (banktransacties || []).slice().sort((a, b) => {
					return (a.transactiedatum && b.transactiedatum) && a.transactiedatum < b.transactiedatum ? 1 : -1;
				});

				return (
					<div>
						<BanktransactiesList transacties={transacties} />
					</div>
				)

			}} />
		</div>
	)

};

export default BanktransactiesPage;