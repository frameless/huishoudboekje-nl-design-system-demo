import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import {Link} from "@gemeente-denhaag/link";
import {Heading2} from "@gemeente-denhaag/typography";
import React from "react";
import {useGetBurgerQuery} from "../../../generated/graphql";
import BanktransactiesList from "./BanktransactiesList";
import Queryable from "../../utils/Queryable";
import {NavLink} from "../../utils/Router";

const BanktransactiesPage: React.FC<{ bsn: number }> = ({bsn}) => {
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	return (
		<Queryable query={$burger} render={data => {
			const {banktransacties} = data.burger || {};
			const transacties = (banktransacties || []).slice().sort((a, b) => {
				return (a.transactiedatum && b.transactiedatum) && a.transactiedatum < b.transactiedatum ? 1 : -1;
			});

			return (
				<div>
					<div>
						<NavLink to={"/"}><Link href={"/"} icon={<ArrowLeftIcon />} iconAlign={"start"}>Huishoudboekje</Link></NavLink>
						<Heading2>Banktransacties</Heading2>
					</div>
					<BanktransactiesList transacties={transacties} />
				</div>
			);
		}} />
	);
};

export default BanktransactiesPage;