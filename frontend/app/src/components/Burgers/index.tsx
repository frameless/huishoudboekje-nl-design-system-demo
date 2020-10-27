import React from "react";
import {Route, Switch} from "react-router-dom";
import Routes from "../../config/routes";
import BurgerList from "./BurgerList";
import CreateBurger from "./CreateBurger";
import BurgerDetail from "./BurgerDetail";
import BurgerEdit from "./BurgerEdit";

const Burgers = () => (
	<Switch>
		<Route exact path={Routes.Burgers} component={BurgerList} />
		<Route path={Routes.BurgerDetail + "/:id"} component={BurgerDetail} />
		<Route path={Routes.BurgerEdit + "/:id"} component={BurgerEdit} />
		<Route path={Routes.CreateBurger} exact component={CreateBurger} />
	</Switch>
);

export default Burgers;