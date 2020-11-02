import React from "react";
import {Route, Switch} from "react-router-dom";
import Routes, {RouteNames} from "../../config/routes";
import BurgerList from "./BurgerList";
import CreateBurger from "./CreateBurger";
import BurgerDetail from "./BurgerDetail";
import BurgerEdit from "./BurgerEdit";
import CreateAgreement from "../Agreements/CreateAgreement";

const Burgers = () => (
	<Switch>
		<Route exact path={Routes.Burgers} component={BurgerList} />
		<Route path={Routes.Burger() + "/" + RouteNames.edit} component={BurgerEdit} />
		<Route path={Routes.BurgerAgreements() + "/" + RouteNames.add} component={CreateAgreement} />
		<Route path={Routes.CreateBurger} exact component={CreateBurger} />
		<Route path={Routes.Burger()} component={BurgerDetail} />
	</Switch>
);

export default Burgers;