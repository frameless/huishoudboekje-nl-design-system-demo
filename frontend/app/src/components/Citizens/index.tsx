import React from "react";
import {Route} from "react-router-dom";
import Routes from "../../config/routes";
import BurgerList from "./BurgerList";
import CreateBurger from "./CreateBurger";
import BurgerDetail from "./BurgerDetail";

const Citizens = () => (<>
	<Route exact path={Routes.Citizens} component={BurgerList} />
	<Route path={Routes.Citizens + "/:id(\\d+)"} component={BurgerDetail} />
	<Route path={Routes.CitizenNew} exact component={CreateBurger} />
</>);

export default Citizens;