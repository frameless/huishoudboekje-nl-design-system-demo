import {ApolloProvider} from "@apollo/client";
import React from "react";
import createApolloClient from "./services/apolloClient";
import BanktransactiesList from "./Banktransacties/BanktransactiesList";
import {useGetBurgerQuery} from "../generated/graphql";
import Queryable from "./Queryable";
import Navigation from "./Navigation";
import {Route, Routes} from "react-router-dom";
import Toekomst from "./Toekomst/Toekomst";

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

			return (<BanktransactiesList transacties={transacties} />);
		}} />
	);
};

const Huishoudboekje: React.FC<{ user: HuishoudboekjeUser, config: HuishoudboekjeConfig }> = ({user, config}) => {
	const {apiUrl} = config;
	return (
		<ApolloProvider client={createApolloClient({apiUrl})}>

			<div className={"container"}>
				<Navigation />
			</div>

			<Routes>
				<Route path={"/"} element={<HuishoudboekjePage bsn={user.bsn} />} />
				<Route path={"/toekomst"} element={(
					<Toekomst bsn={user.bsn} />
				)} />
			</Routes>
		</ApolloProvider>
	);
};

export default Huishoudboekje;