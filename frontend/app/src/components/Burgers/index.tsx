import React from "react";
import {Route, Switch} from "react-router-dom";
import Routes, {RouteNames} from "../../config/routes";
import Afspraken2 from "../Afspraken";
import BurgerDetail from "./BurgerDetail/index";
import BurgerEdit from "./BurgerEdit";
import BurgerList from "./BurgerList";
import CreateBurger from "./CreateBurger";

const Burgers = () => (
	<Switch>
		<Route exact path={Routes.Burgers} component={BurgerList} />
		<Route path={Routes.Burger() + "/" + RouteNames.edit} component={BurgerEdit} />
		<Route path={Routes.BurgerAfspraken() + "/" + RouteNames.add} component={Afspraken2} />
		<Route path={Routes.CreateBurger} exact component={CreateBurger} />
		<Route path={Routes.Burger()} component={BurgerDetail} />
	</Switch>
);

export default Burgers;