import React, {useState} from "react";
import {Route, Switch} from "react-router-dom";
import Routes, {RouteNames} from "../../config/routes";
import Afspraken2 from "../Afspraken";
import PageNotFound from "../PageNotFound";
import BurgerDetail from "./BurgerDetail/index";
import BurgerList from "./BurgerList";
import BurgerSearchContext from "./BurgerSearchContext";
import CreateBurger from "./CreateBurger";
import EditBurger from "./EditBurger";

const Burgers = () => {
	const [search, setSearch] = useState<string>("");

	return (
		<BurgerSearchContext.Provider value={[search, setSearch]}>
			<Switch>
				<Route exact path={Routes.Burgers}>
					<BurgerList />
				</Route>
				<Route path={`${Routes.Burger()}/${RouteNames.edit}`}>
					<EditBurger />
				</Route>
				<Route path={`${Routes.BurgerAfspraken()}/${RouteNames.add}`}>
					<Afspraken2 />
				</Route>
				<Route exact path={Routes.CreateBurger}>
					<CreateBurger />
				</Route>
				<Route path={Routes.Burger()}>
					<BurgerDetail />
				</Route>
				<Route>
					<PageNotFound />
				</Route>
			</Switch>
		</BurgerSearchContext.Provider>
	);
};

export default Burgers;