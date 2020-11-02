import React from "react";
import {Route, Switch} from "react-router-dom";
import Routes from "../../config/routes";
import BurgerList from "./BurgerList";
import CreateBurger from "./CreateBurger";
import BurgerDetail from "./BurgerDetail";
import BurgerEdit from "./BurgerEdit";
import CreateAgreement from "../Agreements/CreateAgreement";

const Burgers = () => {
	return (
		<Switch>
			<Route exact path={Routes.Burgers} component={BurgerList} />
			<Route path={Routes.Burgers + "/:id(\\d+)/bewerken"} component={BurgerEdit} />
			<Route path={Routes.Agreements + "/toevoegen"} component={CreateAgreement} />
			<Route path={Routes.Burgers + "/toevoegen"} exact component={CreateBurger} />
			<Route path={Routes.Burgers + "/:id(\\d+)"} component={BurgerDetail} />
		</Switch>
	);
};

export default Burgers;