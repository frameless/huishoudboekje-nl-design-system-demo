import {ApolloProvider} from "@apollo/client";
import React from "react";
import BanktransactiesPage from "./components/Banktransacties";
import DetailBurgerView from "./components/Burger/DetailBurgerView";
import Dashboard from "./components/Dashboard";
import {HuishoudboekjeConfig, HuishoudboekjeUser} from "./models";
import createApolloClient from "./services/apolloClient";
import Toekomst from "./components/Toekomst/Toekomst";
import {Route, Routes} from "./utils/Router";

const App: React.FC<{user: HuishoudboekjeUser, config: HuishoudboekjeConfig}> = ({user, config}) => {
	const {apiUrl} = config;
	return (
		<ApolloProvider client={createApolloClient({apiUrl})}>
			<Routes>
				<Route path={"/"} component={<Dashboard />} />
				<Route path={"/banktransacties"} component={<BanktransactiesPage bsn={user.bsn} />} />
				<Route path={"/toekomst"} component={<Toekomst bsn={user.bsn} />} />
				<Route path={"/gegevens"} component={<DetailBurgerView bsn={user.bsn} />} />
			</Routes>
		</ApolloProvider>
	);
};

export default App;