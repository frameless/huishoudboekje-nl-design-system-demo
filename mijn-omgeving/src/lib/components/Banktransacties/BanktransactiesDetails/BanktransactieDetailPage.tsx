import React from "react";
import Queryable from "../../../utils/Queryable";
import {Banktransactie, useGetBanktransactieQuery} from "../../../../generated/graphql";
import BanktransactieDetailView from "./BanktransactieDetailView";
import {Stack, Text} from "@chakra-ui/react";
import {useParams} from "react-router-dom";
import BackButton from "../../BackButton";

const BanktransactieDetailPage: React.FC<{ bsn: number }> = ({bsn}) => {
	const {id = ""} = useParams<{ id: string }>();

	const $transactie = useGetBanktransactieQuery({
		variables: {id: parseInt(id)}
	});

	return (
		<div>
			<Queryable query={$transactie} render={data => {
				const transactie: Banktransactie = data.banktransactie;

				if (!transactie) {
					return (
						<Stack>
							<BackButton to={"/banktransacties"} />
							<Text>Banktransactie niet gevonden.</Text>
						</Stack>
					)
				}

				return (
					<div>
						<BanktransactieDetailView transactie={transactie} bsn={bsn} />
					</div>
				)
			}}
			/>
		</div>
	);
};

export default BanktransactieDetailPage;