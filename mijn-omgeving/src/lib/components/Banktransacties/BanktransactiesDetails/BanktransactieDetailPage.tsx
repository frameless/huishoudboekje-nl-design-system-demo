import React from "react";
import Queryable from "../../../utils/Queryable";
import {Burger, useGetBurgerQuery} from "../../../../generated/graphql";
import {useParams} from "react-router-dom";
import BanktransactieDetailView from "./BanktransactieDetailView";
import {Text} from "@chakra-ui/react";

const BanktransactieDetailPage: React.FC<{ bsn: number }> = ({bsn}) => {
	const {id = ""} = useParams<{ id: string }>();

	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	return (
		<Queryable query={$burger} render={data => {
			const burger: Burger = data.burger;
			const transactie = burger.banktransacties?.find(t => t.id === parseInt(id))

			if (!transactie) {
				return <Text>Banktransactie niet gevonden.</Text>
			}

			return <BanktransactieDetailView transactie={transactie} />
		}}
		/>
	);
};

export default BanktransactieDetailPage;