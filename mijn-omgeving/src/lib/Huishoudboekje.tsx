import React from "react";
import BanktransactiesList from "./BanktransactiesList";
import {useGetBurgerQuery} from "./generated/graphql";
import Queryable from "./Queryable";

type User = {
	bsn: number
}

const Huishoudboekje: React.FC<{user: User}> = ({user}) => {
	const $burger = useGetBurgerQuery({
		variables: {
			bsn: user?.bsn,
		},
	});

	return (
		<Queryable query={$burger} render={data => {
			const {banktransacties} = data.burger;
			const transacties = (banktransacties || []).slice().sort((a, b) => {
				return (a.transactiedatum && b.transactiedatum) && a.transactiedatum < b.transactiedatum ? 1 : -1;
			});

			return (<BanktransactiesList transacties={transacties} />);
		}} />
	);
};

export default Huishoudboekje;