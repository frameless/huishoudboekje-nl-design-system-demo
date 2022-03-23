import React from "react";
import Queryable from "../../../utils/Queryable";
import {Banktransactie, useGetBanktransactieQuery} from "../../../../generated/graphql";
import BanktransactieDetailView from "./BanktransactieDetailView";
import {Text} from "@chakra-ui/react";
import {useParams} from "react-router-dom";

const BanktransactieDetailPage = () => {
	const {id = ""} = useParams<{ id: string }>();

	const $transactie = useGetBanktransactieQuery({
		variables: {id: parseInt(id)}
	});

	return (
		<Queryable query={$transactie} render={data => {
			const transactie: Banktransactie = data.banktransactie;

			if (!transactie) {
				return <Text>Banktransactie niet gevonden.</Text>
			}

			return <BanktransactieDetailView transactie={transactie} />
		}}
		/>
	);
};

export default BanktransactieDetailPage;