import React from "react";
import { Route, Switch } from "react-router-dom";
import Routes from "../../config/routes";
import BurgerList from "./BurgerList";
import CreateBurger from "./CreateBurger";
import BurgerDetail from "./BurgerDetail";
import BurgerEdit from "./BurgerEdit";
import Agreements from "../Agreements";

const Burgers = () => (
	<Switch>
		<Route exact path={Routes.Burgers} component={BurgerList} />
		<Route path={Routes.BurgerDetail + "/:id"} component={BurgerDetail} />
		<Route path={Routes.BurgerEdit + "/:id"} component={BurgerEdit} />
		<Route path={Routes.BurgerNew} exact component={CreateBurger} />
		<Route path={Routes.Agreements} component={Agreements} />
	</Switch>
);

export default Burgers;