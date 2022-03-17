import {ApolloProvider} from "@apollo/client";
import React from "react";
import createApolloClient from "./services/apolloClient";
import BanktransactiesList from "./Banktransacties/BanktransactiesList";
import {useGetBurgerQuery} from "../generated/graphql";
import Queryable from "./Queryable";
import {Route, Routes} from "react-router-dom";
import Toekomst from "./Toekomst/Toekomst";
import Main from "./Main";
import {Link} from "@gemeente-denhaag/link";
import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import {Heading2} from "@gemeente-denhaag/typography";
import DetailBurgerView from "./Burger/DetailBurgerView";

export type HuishoudboekjeUser = {
    bsn: number
}

export type HuishoudboekjeConfig = {
    apiUrl: string,
}

const HuishoudboekjePage: React.FC<{ bsn: number }> = ({bsn}) => {
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
						<Link href={"/"} icon={<ArrowLeftIcon />} iconAlign={"start"}>Huishoudboekje</Link>
						<Heading2>Banktransacties</Heading2>
					</div>
					<BanktransactiesList transacties={transacties} />
				</div>
			);
		}} />
	);
};

const Huishoudboekje: React.FC<{ user: HuishoudboekjeUser, config: HuishoudboekjeConfig }> = ({user, config}) => {
	const {apiUrl} = config;
	return (
		<ApolloProvider client={createApolloClient({apiUrl})}>
			<Routes>
				<Route path={"/"} element={<Main />} />
				<Route path={"/banktransacties"} element={<HuishoudboekjePage bsn={user.bsn} />} />
				<Route path={"/toekomst"} element={(<Toekomst bsn={user.bsn} />)} />
				<Route path={"/gegevens"} element={(<DetailBurgerView bsn={user.bsn} />)} />
			</Routes>
		</ApolloProvider>
	);
};

export default Huishoudboekje;