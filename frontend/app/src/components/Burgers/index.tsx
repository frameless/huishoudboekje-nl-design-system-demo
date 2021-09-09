import React, { useState } from "react";
import {Route, Switch} from "react-router-dom";
import Routes, {RouteNames} from "../../config/routes";
import Afspraken2 from "../Afspraken";
import BurgerDetail from "./BurgerDetail/index";
import BurgerEdit from "./BurgerEdit";
import BurgerList from "./BurgerList";
import BurgerSearchContext from "./BurgerSearchContext";
import CreateBurger from "./CreateBurger";

const Burgers = () => {
	const [search, setSearch] = useState<string>("");

	return (
		<BurgerSearchContext.Provider value={[search, setSearch]}>
			<Switch>
				<Route exact path={Routes.Burgers} component={BurgerList} />
				<Route path={Routes.Burger() + "/" + RouteNames.edit} component={BurgerEdit} />
				<Route path={Routes.BurgerAfspraken() + "/" + RouteNames.add} component={Afspraken2} />
				<Route path={Routes.CreateBurger} exact component={CreateBurger} />
				<Route path={Routes.Burger()} component={BurgerDetail} />
			</Switch>
		</BurgerSearchContext.Provider>
	);
};

export default Burgers;