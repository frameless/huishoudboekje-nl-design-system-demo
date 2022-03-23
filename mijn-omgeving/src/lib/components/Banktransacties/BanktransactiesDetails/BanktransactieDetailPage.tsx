import React from "react";
import Queryable from "../../../utils/Queryable";
import {Banktransactie, useGetBanktransactieQuery, useGetBurgerQuery} from "../../../../generated/graphql";
import BanktransactieDetailView from "./BanktransactieDetailView";
import {Stack, Text} from "@chakra-ui/react";
import {NavLink, useParams} from "react-router-dom";
import {Link} from "@gemeente-denhaag/link";
import {ArrowLeftIcon} from "@gemeente-denhaag/icons";

const BanktransactieDetailPage: React.FC<{ bsn: number }> = ({bsn}) => {
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

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
							<NavLink to={"/banktransacties"}><Link href={"/banktransacties"} icon={<ArrowLeftIcon />} iconAlign={"start"}>Terug</Link></NavLink>
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