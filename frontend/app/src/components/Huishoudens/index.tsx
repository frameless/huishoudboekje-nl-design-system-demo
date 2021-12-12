import React from "react";
import {Route, Switch} from "react-router-dom";
import Routes from "../../config/routes";
import PageNotFound from "../PageNotFound";
import HuishoudenDetails from "./HuishoudenDetail";
import HuishoudensList from "./HuishoudensList";

const Huishoudens = () => {
	return (
		<Switch>
			<Route exact path={Routes.Huishoudens}>
				<HuishoudensList />
			</Route>
			<Route path={Routes.Huishouden()}>
				<HuishoudenDetails />
			</Route>
			<Route>
				<PageNotFound />
			</Route>
		</Switch>
	);
};

export default Huishoudens;